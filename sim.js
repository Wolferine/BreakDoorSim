"use strict";
/* Simulation engine : 1-second tick model, beam-search route planner, manual-mode helpers.
   Tick model: income is added, scheduled events fire, then any number of purchases / decomposes can happen
   instantly (no cooldowns). The game always lasts 1200 s on the countdown timer; the start delay only adds
   seconds before it (state.t starts negative). */

const NUM_CASH = 5, EPS = 1e-9, NEVER = -1e9, FAR = 1e9, HORIZON = 1200;
const BUYBACK_COST_GOLD = 500, BUYBACK_DELAY = 30, BUYBACK_GOLD = {11: 1, 12: 2};

const fmtInt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

class Data {
  constructor(d) {
    const cost = c => [+(c.cash || 0), +(c.gold || 0)];
    this.cash = [null, ...d.cash_machine.map(r => ({cost: cost(r.cost), door: r.door_required, cash: r.income, gold: 0}))];
    this.unlock = [null, ...d.cash_machine_unlocks.map(r => [cost(r.cost), r.requires_cash_machine_level])];
    this.gold = [null, ...d.gold_machine.map(r => ({cost: cost(r.cost), door: r.door_required, cash: 0, gold: r.gold_per_second}))];
    this.decomp = [null, ...d.decompose.map(r => [r.gold_input, r.cash_output])];
    this.door = [null, ...d.door.map(r => ({cost: cost(r.cost), name: r.name}))];
    this.turret = [null, ...d.turret.map(r => ({cost: cost(r.cost), door: 0, cash: r.cash_per_second, gold: r.gold_per_second}))];
    this.maxCash = this.cash.length - 1; this.maxGold = this.gold.length - 1;
    this.maxDoor = this.door.length - 1; this.maxTurret = this.turret.length - 1;
  }
  static cum(table) {
    const out = [[0, 0]];
    for (let i = 1; i < table.length; i++) {
      const [c, g] = table[i].cost, p = out[out.length - 1];
      out.push([p[0] + c, p[1] + g]);
    }
    return out;
  }
}

// ---- state: {t, cash, gold, cl (sorted desc, 0 = locked), gl, door, tu, ld (last decompose tick), bb (buyback active tick)}
function makeState(cfg) {
  const st = cfg.start || {};
  const cl = [...(st.cash_machine_levels || [1, 0, 0, 0, 0]), 0, 0, 0, 0, 0].slice(0, NUM_CASH).sort((a, b) => b - a);
  return {
    // an explicit start.time_seconds wins (used when resuming from manual mode)
    t: st.time_seconds !== undefined ? Math.trunc(st.time_seconds) : -Math.trunc(cfg.start_delay_seconds || 0),
    cash: +(st.cash || 0), gold: +(st.gold || 0), cl,
    gl: Math.trunc(st.gold_machine_level || 0), door: Math.max(1, Math.trunc(st.door_level || 1)),
    tu: cfg.use_turret !== false ? Math.trunc(st.turret_level || 0) : 0,
    ld: st.last_decompose_tick ?? NEVER, bb: st.buyback_tick ?? FAR,
  };
}
const copyState = s => ({...s});  // cl is never mutated in place
const stateSig = s => s.cl.join(",") + "|" + s.gl + "|" + s.door + "|" + s.tu + "|" + (s.bb < FAR ? 1 : 0);
const stateToDict = s => ({t: s.t, cash: s.cash, gold: s.gold, cash_levels: [...s.cl], gold_level: s.gl, door: s.door,
                           turret: s.tu, last_decompose: s.ld, buyback_tick: s.bb});
const stateFromDict = d => ({t: Math.trunc(d.t), cash: +d.cash, gold: +d.gold, cl: [...d.cash_levels].sort((a, b) => b - a),
                             gl: Math.trunc(d.gold_level), door: Math.trunc(d.door), tu: Math.trunc(d.turret),
                             ld: d.last_decompose ?? NEVER, bb: d.buyback_tick ?? FAR});

/** Income per second for tick `at` (default: the current tick). */
function rates(D, s, at) {
  let c = 0, g = s.gl ? D.gold[s.gl].gold : 0;
  for (const l of s.cl) if (l) c += D.cash[l].cash;
  if (s.bb <= (at === undefined ? s.t : at)) for (const l of s.cl) g += BUYBACK_GOLD[l] || 0;
  if (s.tu) { c += D.turret[s.tu].cash; g += D.turret[s.tu].gold; }
  return [c, g];
}

class Timeline {
  constructor(cfg) {
    this.events = new Map(); this.mults = [];
    const spec = new Set(), add = (t, e) => { if (!this.events.has(t)) this.events.set(t, []); this.events.get(t).push(e); spec.add(t); };
    this.oneDec = !!cfg.one_decompose_per_second;
    const drops = cfg.drops || {};
    if (drops.enabled !== false) {
      for (const d of drops.table || []) {
        const m = +(d.multiplier ?? 1), cash = +(d.cash || 0) * m, gold = +(d.gold || 0) * m;
        if (cash || gold) add(Math.trunc(d.minute * 60), {type: "drop", minute: d.minute, cash, gold});
      }
    }
    for (const e of cfg.events || []) {
      const t = Math.trunc((e.minute || 0) * 60 + (e.second || 0));
      if (e.type === "income_multiplier") {
        const dur = Math.trunc((e.duration_minutes || 0) * 60 + (e.duration_seconds || 0));
        this.mults.push([t, t + dur, e.cash ?? 1, e.gold ?? 1]);
        spec.add(t); spec.add(t + dur);
      } else if (e.amount) add(t, e);
    }
    this.special = [...spec].sort((a, b) => a - b);
  }
  nextSpecial(t) {  // first special tick > t, or null
    let lo = 0, hi = this.special.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (this.special[mid] <= t) lo = mid + 1; else hi = mid; }
    return lo < this.special.length ? this.special[lo] : null;
  }
  mult(tick) {
    let mc = 1, mg = 1;
    for (const [a, b, xc, xg] of this.mults) if (a <= tick && tick < b) { mc *= xc; mg *= xg; }
    return [mc, mg];
  }
}

function tick(D, s, TL) {
  s.t += 1;
  const [cr, gr] = rates(D, s), [mc, mg] = TL.mult(s.t);
  s.cash += cr * mc; s.gold += gr * mg;
  for (const e of TL.events.get(s.t) || []) {
    if (e.type === "add_cash") s.cash += e.amount;
    else if (e.type === "add_gold") s.gold += e.amount;
    else if (e.type === "drop") { s.cash += e.cash; s.gold += e.gold; }
  }
}

function eventText(e) {
  if (e.type === "drop") {
    const parts = [e.cash ? "$" + fmtInt(e.cash) : "", e.gold ? fmtInt(e.gold) + " Gold" : ""].filter(Boolean);
    return `DROP (min ${e.minute}): +` + parts.join(" +");
  }
  return `EVENT ${e.type} +${fmtInt(e.amount)}`;
}

/** Log entries for scheduled events that fired in (t0, t1]. */
function eventEntries(TL, t0, t1) {
  const out = [];
  for (const t of [...TL.events.keys()].sort((a, b) => a - b))
    if (t0 < t && t <= t1) for (const e of TL.events.get(t)) out.push({t, type: "event", text: eventText(e)});
  return out;
}

/** Next tick that must be stepped individually (scheduled event or buyback activation). */
function nextStop(TL, s) {
  const nb = TL.nextSpecial(s.t);
  return (s.t < s.bb && s.bb < FAR && (nb === null || s.bb < nb)) ? s.bb : nb;
}

function advanceTo(D, s, TL, T) {
  while (s.t < T) {
    const nb = nextStop(TL, s), end = Math.min(T, nb !== null ? nb - 1 : T);
    if (end > s.t) {
      const k = end - s.t, [cr, gr] = rates(D, s, s.t + 1), [mc, mg] = TL.mult(s.t + 1);
      s.cash += cr * mc * k; s.gold += gr * mg * k; s.t = end;
    } else tick(D, s, TL);
  }
}

function affordable(D, gl, cash, gold, C, G, dec, cap) {
  if (gold + EPS < G) return false;
  if (cash + EPS >= C) return true;
  if (dec && gl) {
    const [gin, cout] = D.decomp[gl];
    let n = Math.floor((gold - G + EPS) / gin);
    if (cap !== undefined && cap !== null) n = Math.min(n, cap);
    return n > 0 && cash + n * cout + EPS >= C;
  }
  return false;
}

/** Max units decomposable right now: null = unlimited, else 1 (or 0 if already used this second). */
const decCap = (TL, s) => !TL.oneDec ? null : (s.ld === s.t ? 0 : 1);

/** Like waitFor(dec=true) but at most one decompose per second, so each unit costs a tick. */
function waitOnePerSecond(D, s, TL, C, G, limit, entries) {
  const [gin, cout] = D.decomp[s.gl];
  for (;;) {
    if (s.cash + EPS >= C && s.gold + EPS >= G) return true;
    const spare = s.gold - G;
    if (s.ld !== s.t && s.cash + EPS < C && spare + EPS >= gin) {
      s.gold -= gin; s.cash += cout; s.ld = s.t;
      if (entries) entries.push(snap(D, s, "decompose", `Decompose x1 (-${gin} Gold, +$${fmtInt(cout)})`));
      continue;
    }
    if (s.t >= limit) return false;
    const nb = nextStop(TL, s), end = Math.min(limit, nb !== null ? nb - 1 : limit);
    if (spare + EPS >= gin || end <= s.t) { tick(D, s, TL); continue; }
    const K = end - s.t;
    let [cr, gr] = rates(D, s, s.t + 1);
    const [mc, mg] = TL.mult(s.t + 1);
    cr *= mc; gr *= mg;
    const ready = k => {
      const c = s.cash + cr * k, g = s.gold + gr * k;
      return (c + EPS >= C && g + EPS >= G) || g - G + EPS >= gin;
    };
    if (!ready(K)) { s.cash += cr * K; s.gold += gr * K; s.t = end; continue; }
    let lo = 1, hi = K;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (ready(mid)) hi = mid; else lo = mid + 1; }
    s.cash += cr * lo; s.gold += gr * lo; s.t += lo;
  }
}

/** Advance s until (C, G) is affordable (optionally decomposing gold). False if not before `limit`. */
function waitFor(D, s, TL, C, G, dec, limit, entries) {
  if (dec && TL.oneDec && s.gl) return waitOnePerSecond(D, s, TL, C, G, limit, entries);
  while (!affordable(D, s.gl, s.cash, s.gold, C, G, dec)) {
    if (s.t >= limit) return false;
    const nb = nextStop(TL, s), end = Math.min(limit, nb !== null ? nb - 1 : limit);
    if (end > s.t) {
      const K = end - s.t;
      let [cr, gr] = rates(D, s, s.t + 1);
      const [mc, mg] = TL.mult(s.t + 1);
      cr *= mc; gr *= mg;
      if (!affordable(D, s.gl, s.cash + cr * K, s.gold + gr * K, C, G, dec)) {
        s.cash += cr * K; s.gold += gr * K; s.t = end; continue;
      }
      let lo = 1, hi = K;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (affordable(D, s.gl, s.cash + cr * mid, s.gold + gr * mid, C, G, dec)) hi = mid; else lo = mid + 1;
      }
      s.cash += cr * lo; s.gold += gr * lo; s.t += lo;
      return true;
    }
    tick(D, s, TL);
  }
  return true;
}

// ---- actions
/** [label, [cash, gold], blockedReason | null] */
function actionInfo(D, s, cfg, kind, idx = 0) {
  if (kind === "cash_up") {
    const l = s.cl[idx];
    if (l === 0) return ["Cash Machine (locked)", [0, 0], "Locked"];
    if (l >= D.maxCash) return [`Cash Machine Lv.${l} (MAX)`, [0, 0], "Max level"];
    const n = D.cash[l + 1];
    return [`Cash Machine Lv.${l} -> Lv.${l + 1}`, n.cost, n.door > s.door ? `Needs Door Lv.${n.door}` : null];
  }
  if (kind === "cash_unlock") {
    const n = s.cl.indexOf(0);
    if (n < 0) return ["Unlock Cash Machine", [0, 0], "All unlocked"];
    const [cost, req] = D.unlock[n + 1];
    return [`Unlock Cash Machine #${n + 1}`, cost, s.cl[0] < req ? `Needs a Cash Machine at Lv.${req}` : null];
  }
  if (kind === "door_up") {
    if (s.door >= D.maxDoor) return [`Door Lv.${s.door} (MAX)`, [0, 0], "Max level"];
    return [`Door Lv.${s.door} -> Lv.${s.door + 1}`, D.door[s.door + 1].cost, null];
  }
  if (kind === "gold_up") {
    if (s.gl >= D.maxGold) return [`Gold Machine Lv.${s.gl} (MAX)`, [0, 0], "Max level"];
    const n = D.gold[s.gl + 1];
    return [s.gl === 0 ? "Unlock Gold Machine" : `Gold Machine Lv.${s.gl} -> Lv.${s.gl + 1}`, n.cost, n.door > s.door ? `Needs Door Lv.${n.door}` : null];
  }
  if (kind === "turret_up") {
    if (cfg.use_turret === false) return ["Turret", [0, 0], "Turret disabled"];
    if (s.tu >= D.maxTurret) return [`Turret Lv.${s.tu} (MAX)`, [0, 0], "Max level"];
    return [s.tu ? `Turret Lv.${s.tu} -> Lv.${s.tu + 1}` : "Build Turret Lv.1", D.turret[s.tu + 1].cost, null];
  }
  if (kind === "buyback") {
    if (!cfg.engineer) return ["Buyback upgrade", [0, 0], "Engineer disabled"];
    return [`Buyback upgrade (active ${BUYBACK_DELAY}s after buying)`, [0, BUYBACK_COST_GOLD], s.bb < FAR ? "Already bought" : null];
  }
  throw new Error("unknown action " + kind);
}

function applyAction(s, kind, idx) {
  if (kind === "buyback") s.bb = s.t + BUYBACK_DELAY;
  else if (kind === "door_up") s.door += 1;
  else if (kind === "gold_up") s.gl += 1;
  else if (kind === "turret_up") s.tu += 1;
  else {
    const cl = [...s.cl], j = kind === "cash_unlock" ? cl.indexOf(0) : cl.indexOf(cl[idx]);
    cl[j] += 1;
    s.cl = cl;
  }
}

function candidates(D, s, cfg) {
  const out = [];
  for (let i = 0; i < NUM_CASH; i++) if (s.cl[i] > 0 && (i === 0 || s.cl[i] !== s.cl[i - 1])) out.push(["cash_up", i]);
  out.push(["cash_unlock", 0], ["door_up", 0], ["gold_up", 0], ["turret_up", 0], ["buyback", 0]);
  const res = [];
  for (const [kind, idx] of out) {
    const [label, cost, reason] = actionInfo(D, s, cfg, kind, idx);
    if (reason === null) res.push([kind, idx, label, cost]);
  }
  return res;
}

const round2 = x => Math.round(x * 100) / 100;
function snap(D, s, type, text) {
  const [cr, gr] = rates(D, s);
  return {t: s.t, type, text, cash: round2(s.cash), gold: round2(s.gold), cash_rate: cr, gold_rate: gr,
          cash_levels: [...s.cl], gold_level: s.gl, door: s.door, turret: s.tu};
}

function buy(D, s, kind, idx, label, C, G, dec, entries) {
  if (dec && s.cash + EPS < C) {
    const [gin, cout] = D.decomp[s.gl], n = Math.ceil((C - s.cash - EPS) / cout);
    s.gold -= n * gin; s.cash += n * cout; s.ld = s.t;
    entries.push(snap(D, s, "decompose", `Decompose x${n} (-${n * gin} Gold, +$${fmtInt(n * cout)})`));
  }
  s.cash = Math.max(0, s.cash - C);
  s.gold = Math.max(0, s.gold - G);
  applyAction(s, kind, idx);
  entries.push(snap(D, s, "buy", label));
}

// ---- goals
class Goal {
  constructor(D, goal) {
    goal = goal || {};
    const cm = [...(goal.cash_machines || []), 0, 0, 0, 0, 0].slice(0, NUM_CASH);
    this.cash = cm.map(x => Math.min(Math.trunc(x || 0), D.maxCash)).sort((a, b) => b - a);
    this.gold = Math.min(Math.trunc(goal.gold_machine || 0), D.maxGold);
    this.turret = Math.min(Math.trunc(goal.turret || 0), D.maxTurret);
    let door = Math.min(Math.trunc(goal.door || 0), D.maxDoor);
    for (let l = 1; l <= this.cash[0]; l++) door = Math.max(door, D.cash[l].door);
    for (let l = 1; l <= this.gold; l++) door = Math.max(door, D.gold[l].door);
    this.door = door;
    [this.cc, this.gc, this.tc, this.dc] = [D.cash, D.gold, D.turret, D.door].map(Data.cum);
    this.D = D;
  }
  met(s) {
    for (let j = 0; j < NUM_CASH; j++) if (s.cl[j] < this.cash[j]) return false;
    return s.gl >= this.gold && s.tu >= this.turret && s.door >= this.door;
  }
  /** Remaining cost in cash-equivalents (gold valued at gv). */
  remaining(s, gv) {
    const D = this.D;
    let c = 0, g = 0;
    for (let j = 0; j < NUM_CASH; j++) {
      if (this.cash[j] > s.cl[j]) {
        if (s.cl[j] === 0) { c += D.unlock[j + 1][0][0]; g += D.unlock[j + 1][0][1]; }
        c += this.cc[this.cash[j]][0] - this.cc[s.cl[j]][0];
        g += this.cc[this.cash[j]][1] - this.cc[s.cl[j]][1];
      }
    }
    for (const [tgt, cur, cum] of [[this.gold, s.gl, this.gc], [this.turret, s.tu, this.tc], [this.door, s.door, this.dc]]) {
      if (tgt > cur) { c += cum[tgt][0] - cum[cur][0]; g += cum[tgt][1] - cum[cur][1]; }
    }
    return c + gv * g;
  }
}

/** Greedy best-ROI completion of the goal from s; returns finish time (H + penalty if not reached). */
function rollout(D, cfg, TL, s0, goal, gv, H) {
  const s = copyState(s0), ncash = goal.cash.filter(x => x > 0).length;
  let guard = 0;
  while (!goal.met(s) && s.t < H && guard < 400) {
    guard++;
    let best = null;
    const offer = (kind, idx, C, G, gain, doorNeed) => {
      if (gain <= 0) return;
      if (doorNeed > s.door) {
        const first = D.door[s.door + 1].cost;
        C += first[0]; G += first[1];
        for (let d = s.door + 2; d <= doorNeed; d++) { C += D.door[d].cost[0]; G += D.door[d].cost[1]; }
        const score = (C + G * gv) / gain;
        if (best === null || score < best[0]) best = [score, "door_up", 0, first[0], first[1]];
        return;
      }
      const score = (C + G * gv) / gain;
      if (best === null || score < best[0]) best = [score, kind, idx, C, G];
    };
    for (let i = 0; i < NUM_CASH; i++) {
      if (0 < s.cl[i] && s.cl[i] < Math.min(goal.cash[i], D.maxCash) && (i === 0 || s.cl[i] !== s.cl[i - 1])) {
        const n = D.cash[s.cl[i] + 1];
        offer("cash_up", i, n.cost[0], n.cost[1], n.cash - D.cash[s.cl[i]].cash, n.door);
      }
    }
    const j = s.cl.indexOf(0);
    if (j >= 0 && j < ncash) {
      const [[uc, ug], req] = D.unlock[j + 1];
      if (s.cl[0] >= req) offer("cash_unlock", 0, uc, ug, D.cash[1].cash + 0.5 * D.cash[Math.min(3, D.maxCash)].cash, 0);
    }
    if (s.gl < D.maxGold) {
      const n = D.gold[s.gl + 1], old = s.gl ? D.gold[s.gl].gold : 0;
      offer("gold_up", 0, n.cost[0], n.cost[1], (n.gold - old) * gv, n.door);
    }
    if (cfg.use_turret !== false && s.tu < Math.min(goal.turret, D.maxTurret)) {
      const n = D.turret[s.tu + 1], old = s.tu ? D.turret[s.tu] : {cash: 0, gold: 0};
      offer("turret_up", 0, n.cost[0], n.cost[1], n.cash - old.cash + (n.gold - old.gold) * gv, 0);
    }
    if (s.door < goal.door && best === null) {
      const c = D.door[s.door + 1].cost;
      best = [0, "door_up", 0, c[0], c[1]];
    }
    if (best === null) return H + 1e6;
    const [, kind, idx, C, G] = best;
    if (!waitFor(D, s, TL, C, G, true, H)) return H + goal.remaining(s, gv) / 1e3 + 1;
    if (s.cash + EPS < C) {
      const [gin, cout] = D.decomp[s.gl], n = Math.ceil((C - s.cash - EPS) / cout);
      s.gold -= n * gin; s.cash += n * cout;
    }
    s.cash = Math.max(0, s.cash - C);
    s.gold = Math.max(0, s.gold - G);
    applyAction(s, kind, idx);
  }
  return goal.met(s) ? s.t : H + 1;
}

// ---- beam search
function beam(D, cfg, TL, s0, goal, gv, width, H, useRollout) {
  const heuristic = s => {
    const [cr, gr] = rates(D, s, s.bb < FAR ? s.bb : undefined);
    if (useRollout) return rollout(D, cfg, TL, s, goal, gv, H);
    const need = Math.max(0, goal.remaining(s, gv) - s.cash - gv * s.gold), inc = cr + gv * gr;
    return s.t + (inc > 0 ? need / inc : 1e12);
  };
  const root = {s: s0, parent: null, entries: [], h: heuristic(s0)};
  if (goal.met(s0)) return {node: root, reached: s0.t, h: root.h};
  let layer = [root], best = null, bestT = Infinity, last = root;
  while (layer.length) {
    const nxt = new Map();
    for (const node of layer) {
      const s = node.s;
      for (const [kind, idx, label, [C, G]] of candidates(D, s, cfg)) {
        const variants = [], s2 = copyState(s), t1 = waitFor(D, s2, TL, C, G, false, H) ? s2.t : null;
        if (t1 !== null) variants.push([s2, false, []]);
        if (s.gl && C > 0) {
          const s3 = copyState(s), ent = [];
          if (waitFor(D, s3, TL, C, G, true, H, ent) && (t1 === null || s3.t < t1)) variants.push([s3, true, ent]);
        }
        for (const [sNew, dec, entries] of variants) {
          if (sNew.t >= bestT) continue;
          buy(D, sNew, kind, idx, label, C, G, dec, entries);
          const child = {s: sNew, parent: node, entries, h: 0};
          if (goal.met(sNew)) { best = child; bestT = sNew.t; continue; }
          child.h = heuristic(sNew);
          const key = stateSig(sNew), old = nxt.get(key);
          if (!old || child.h < old.h) nxt.set(key, child);
        }
      }
    }
    layer = [...nxt.values()].sort((a, b) => a.h - b.h).slice(0, width);
    if (layer.length) last = layer[0];
  }
  return best ? {node: best, reached: bestT, h: bestT} : {node: last, reached: null, h: last.h};
}

/** Clamp user-supplied settings. */
function normalizeConfig(cfg) {
  cfg = JSON.parse(JSON.stringify(cfg || {}));
  const sc = cfg.search || {};
  sc.beam_width = Math.max(5, Math.min(Math.trunc(+sc.beam_width || 30), 2000));
  sc.gold_values = (sc.gold_values && sc.gold_values.length ? sc.gold_values : [10, 20, 40]).map(Number).slice(0, 3);
  cfg.search = sc;
  cfg.start_delay_seconds = Math.max(0, Math.min(Math.trunc(+cfg.start_delay_seconds || 0), 120));
  cfg.one_decompose_per_second = !!cfg.one_decompose_per_second;
  cfg.engineer = !!cfg.engineer;
  const dr = cfg.drops || {};
  dr.table = (dr.table || []).slice(0, 50).map(d => ({
    minute: Math.max(0, Math.min(+d.minute || 0, 20)), cash: +d.cash || 0, gold: +d.gold || 0,
    multiplier: Math.max(0, Math.min(d.multiplier === undefined || d.multiplier === "" ? 1 : +d.multiplier || 0, 1000))}));
  cfg.drops = dr;
  cfg.events = (cfg.events || []).slice(0, 50);
  return cfg;
}

const entryOrder = (a, b) => a[0].t - b[0].t || ((a[0].type === "event" ? 0 : 1) - (b[0].type === "event" ? 0 : 1)) || a[1] - b[1];
const sortEntries = es => es.map((e, i) => [e, i]).sort(entryOrder).map(x => x[0]);

function plan(D, cfgIn) {
  const cfg = normalizeConfig(cfgIn), TL = new Timeline(cfg), s0 = makeState(cfg), H = HORIZON;
  const goal = new Goal(D, cfg.goal), sc = cfg.search, width = sc.beam_width, gvs = sc.gold_values;
  const results = [...new Set([...gvs, 5, 100])].sort((a, b) => a - b).map(gv => beam(D, cfg, TL, s0, goal, gv, width * 2, H, false));
  if (sc.rollout !== false) for (const gv of gvs) results.push(beam(D, cfg, TL, s0, goal, gv, width, H, true));
  const reached = results.filter(r => r.reached !== null);
  const r = reached.length ? reached.reduce((a, b) => b.reached < a.reached ? b : a)
                           : results.reduce((a, b) => b.h < a.h ? b : a);
  const chain = [];
  for (let n = r.node; n; n = n.parent) chain.push(n);
  const route = chain.reverse().flatMap(n => n.entries);
  const endT = r.reached !== null ? r.reached : H;
  route.push(...eventEntries(TL, s0.t, endT));
  for (const e of [...route])
    if (e.type === "buy" && e.text.startsWith("Buyback") && e.t + BUYBACK_DELAY <= endT)
      route.push({t: e.t + BUYBACK_DELAY, type: "event", text: "Buyback upgrade is now active"});
  return {route: sortEntries(route), reached: r.reached, goal_met: r.reached !== null, final: stateToDict(r.node.s), horizon_seconds: H};
}

// ---- manual mode
function manualView(D, cfgIn, s) {
  const cfg = normalizeConfig(cfgIn), TL = new Timeline(cfg), acts = [];
  for (let i = 0; i < NUM_CASH; i++) {
    if (s.cl[i] > 0) acts.push(["cash_up", i]);
    else if (s.cl[i] === 0 && (i === 0 || s.cl[i - 1] > 0)) acts.push(["cash_unlock", i]);
  }
  acts.push(["door_up", 0], ["gold_up", 0], ["turret_up", 0]);
  if (cfg.engineer) acts.push(["buyback", 0]);
  const cap = decCap(TL, s), out = [];
  for (const [kind, idx] of acts) {
    let [label, [C, G], reason] = actionInfo(D, s, cfg, kind, idx);
    if (kind === "cash_up") label = `Machine #${idx + 1}: ${label}`;
    out.push({kind, idx, label, cash: C, gold: G, blocked: reason,
              affordable: reason === null && affordable(D, s.gl, s.cash, s.gold, C, G, false),
              affordable_decompose: reason === null && affordable(D, s.gl, s.cash, s.gold, C, G, true, cap)});
  }
  const [cr, gr] = rates(D, s), dc = s.gl ? D.decomp[s.gl] : null;
  let maxUnits = dc ? Math.floor((s.gold + EPS) / dc[0]) : 0;
  if (cap !== null) maxUnits = Math.min(maxUnits, cap);
  return {state: stateToDict(s), cash_rate: cr, gold_rate: gr, actions: out,
          decompose: dc ? {gold_in: dc[0], cash_out: dc[1], max_units: maxUnits} : null};
}

/** Returns {state, entries, error}. */
function manualAct(D, cfgIn, sd, action) {
  const cfg = normalizeConfig(cfgIn), s = stateFromDict(sd), TL = new Timeline(cfg), t0 = s.t;
  let entries = [];
  const fail = error => ({state: s, entries, error});
  const type = action.type;
  if (type === "wait") {
    const n = Math.max(0, Math.min(Math.trunc(+action.seconds || 1), 3600));
    advanceTo(D, s, TL, s.t + n);
    entries.push(...eventEntries(TL, t0, s.t), snap(D, s, "wait", `Waited ${n}s`));
  } else if (type === "buy" || type === "wait_until") {
    const kind = action.kind, idx = Math.trunc(action.idx || 0), dec = action.decompose !== false;
    const [label, [C, G], reason] = actionInfo(D, s, cfg, kind, idx);
    if (reason) return fail(reason);
    if (type === "wait_until") {
      if (!waitFor(D, s, TL, C, G, dec, s.t + 3600, entries)) return fail("Not affordable within 1 hour");
      entries.push(...eventEntries(TL, t0, s.t), snap(D, s, "wait", "Waited until affordable"));
      entries = sortEntries(entries);
    }
    if (!affordable(D, s.gl, s.cash, s.gold, C, G, dec, decCap(TL, s))) return fail("Not enough cash/gold");
    buy(D, s, kind, idx, label, C, G, dec, entries);
  } else if (type === "until_next") {
    const dec = action.decompose !== false, list = [];
    let best = null;
    for (let i = 0; i < NUM_CASH; i++) list.push(["cash_up", i], ["cash_unlock", i]);
    list.push(["door_up", 0], ["gold_up", 0], ["turret_up", 0], ["buyback", 0]);
    for (const [kind, idx] of list) {
      const [label, [C, G], reason] = actionInfo(D, s, cfg, kind, idx);
      if (reason || affordable(D, s.gl, s.cash, s.gold, C, G, dec, decCap(TL, s))) continue;
      const c = copyState(s);
      if (waitFor(D, c, TL, C, G, dec, s.t + 3600) && (best === null || c.t < best[0])) best = [c.t, label];
    }
    if (best === null) return fail("Nothing becomes affordable within 1 hour");
    advanceTo(D, s, TL, best[0]);
    entries.push(...eventEntries(TL, t0, s.t), snap(D, s, "wait", `Waited ${best[0] - t0}s until: ${best[1]}`));
  } else if (type === "decompose") {
    if (!s.gl) return fail("No gold machine");
    const [gin, cout] = D.decomp[s.gl], cap = decCap(TL, s);
    let n = Math.min(Math.trunc(+action.units || 1), Math.floor((s.gold + EPS) / gin));
    if (cap !== null) {
      if (cap === 0) return fail("Already decomposed this second - wait 1s");
      n = Math.min(n, cap);
    }
    if (n <= 0) return fail("Not enough gold");
    s.gold -= n * gin; s.cash += n * cout; s.ld = s.t;
    entries.push(snap(D, s, "decompose", `Decompose x${n} (-${n * gin} Gold, +$${fmtInt(n * cout)})`));
  } else return fail("Unknown action");
  return {state: s, entries, error: null};
}

// Browser: plan() and friends are globals. Node/tests: exported below.
if (typeof module !== "undefined") module.exports = {Data, makeState, plan, manualView, manualAct, stateToDict, normalizeConfig, stateFromDict};
