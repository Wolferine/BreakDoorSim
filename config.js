// Default settings (edit directly)
const BREAKDOOR_CONFIG = {
 "goal": {
  "cash_machines": [
   12,
   12,
   12,
   12,
   12
  ],
  "gold_machine": null,
  "door": null,
  "turret": null
 },
 "start_delay_seconds": 15,
 "one_decompose_per_second": true,
 "engineer": false,
 "start": {
  "cash": 0,
  "gold": 0,
  "cash_machine_levels": [
   1,
   0,
   0,
   0,
   0
  ],
  "gold_machine_level": 0,
  "door_level": 1,
  "turret_level": 0
 },
 "use_turret": true,
 "search": {
  "beam_width": 150,
  "gold_values": [
   10,
   20,
   40
  ],
  "rollout": true
 },
 "drops": {
  "enabled": true,
  "table": [
   {
    "minute": 1,
    "cash": 300,
    "gold": 0,
    "multiplier": 1
   },
   {
    "minute": 3,
    "cash": 300,
    "gold": 20,
    "multiplier": 1
   },
   {
    "minute": 5,
    "cash": 0,
    "gold": 100,
    "multiplier": 1
   },
   {
    "minute": 7,
    "cash": 0,
    "gold": 150,
    "multiplier": 1
   },
   {
    "minute": 9,
    "cash": 0,
    "gold": 200,
    "multiplier": 1
   },
   {
    "minute": 11,
    "cash": 0,
    "gold": 250,
    "multiplier": 1
   },
   {
    "minute": 13,
    "cash": 0,
    "gold": 400,
    "multiplier": 1
   },
   {
    "minute": 15,
    "cash": 0,
    "gold": 500,
    "multiplier": 1
   }
  ]
 },
 "gems": {
  "gold_efficiency": 0
 },
 "events": [],
 "_notes": {
  "gems": "gold_efficiency: % boost to the gold machine's generation only (not engineer/turret/drops). 0 = none",
  "drops": "One-time cash/gold at elapsed minute (timer shows 20 - minute). Amount x (1 + 0.1 x dead_people) x multiplier (0 disables it, 2 = twice)",
  "goal": "Rush: reach this as fast as possible. Set any of: cash_machines (5 target levels, 0 = not needed), gold_machine, door, turret. null = no requirement",
  "start_delay_seconds": "The game always lasts 20:00 on the countdown timer; the delay adds extra seconds before it (e.g. 8 = starts at 20:08). Everything runs normally during the delay",
  "one_decompose_per_second": "true = at most one decompose per 1-second tick",
  "events": "Examples: {\"minute\": 5, \"type\": \"add_cash\", \"amount\": 500} | {\"minute\": 8, \"second\": 30, \"type\": \"add_gold\", \"amount\": 50} | {\"minute\": 10, \"type\": \"income_multiplier\", \"duration_minutes\": 2, \"cash\": 2.0, \"gold\": 1.0}"
 }
};
