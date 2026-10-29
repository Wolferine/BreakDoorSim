# Bloxy build simulator

Plans the fastest route to a goal (default: 5 cash machines at Lv.12) and offers a manual mode.
The game timer always counts down from 20:00; the start delay adds extra seconds.

## Use

Open `index.html` in a browser.
or go to <https://wolferine.github.io/BreakDoorSim/>

## Files

- `index.html` - UI
- `sim.js` - simulation engine and route planner
- `worker.js` - runs the planner off the main thread
- `data.js` - game stat tables
- `config.js` - default settings and drops table
