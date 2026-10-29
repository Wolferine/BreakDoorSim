"use strict";
// Runs the planner off the main thread. The page passes {data, cfg}; sim.js provides Data and plan.
importScripts("sim.js");
onmessage = async e => {
  try { postMessage({result: await plan(new Data(e.data.data), e.data.cfg, text => postMessage({progress: text}))}); }
  catch (err) { postMessage({error: String(err && err.message || err)}); }
};
