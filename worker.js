"use strict";
// Runs the planner off the main thread. The page passes {data, cfg}; sim.js provides Data and plan.
importScripts("sim.js");
onmessage = e => {
  try { postMessage({result: plan(new Data(e.data.data), e.data.cfg)}); }
  catch (err) { postMessage({error: String(err && err.message || err)}); }
};
