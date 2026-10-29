// Game stat tables (edit directly)
const BLOXY_DATA = {
 "_info": "Units: cash/gold per second for income, absolute amounts for costs. door_required = minimum door level.",
 "cash_machine": [
  {
   "level": 1,
   "income": 1,
   "cost": {
    "cash": 0,
    "gold": 0
   },
   "door_required": 0
  },
  {
   "level": 2,
   "income": 2,
   "cost": {
    "cash": 8,
    "gold": 0
   },
   "door_required": 0
  },
  {
   "level": 3,
   "income": 4,
   "cost": {
    "cash": 40,
    "gold": 0
   },
   "door_required": 2
  },
  {
   "level": 4,
   "income": 8,
   "cost": {
    "cash": 80,
    "gold": 0
   },
   "door_required": 3
  },
  {
   "level": 5,
   "income": 16,
   "cost": {
    "cash": 180,
    "gold": 0
   },
   "door_required": 0
  },
  {
   "level": 6,
   "income": 32,
   "cost": {
    "cash": 320,
    "gold": 0
   },
   "door_required": 5
  },
  {
   "level": 7,
   "income": 64,
   "cost": {
    "cash": 900,
    "gold": 10
   },
   "door_required": 6
  },
  {
   "level": 8,
   "income": 128,
   "cost": {
    "cash": 2000,
    "gold": 20
   },
   "door_required": 0
  },
  {
   "level": 9,
   "income": 256,
   "cost": {
    "cash": 4500,
    "gold": 38
   },
   "door_required": 7
  },
  {
   "level": 10,
   "income": 512,
   "cost": {
    "cash": 14000,
    "gold": 68
   },
   "door_required": 8
  },
  {
   "level": 11,
   "income": 1024,
   "cost": {
    "cash": 30000,
    "gold": 120
   },
   "door_required": 0
  },
  {
   "level": 12,
   "income": 2048,
   "cost": {
    "cash": 70000,
    "gold": 210
   },
   "door_required": 0
  }
 ],
 "cash_machine_unlocks": [
  {
   "number": 1,
   "cost": {
    "cash": 0,
    "gold": 0
   },
   "requires_cash_machine_level": 0
  },
  {
   "number": 2,
   "cost": {
    "cash": 0,
    "gold": 25
   },
   "requires_cash_machine_level": 6
  },
  {
   "number": 3,
   "cost": {
    "cash": 0,
    "gold": 55
   },
   "requires_cash_machine_level": 8
  },
  {
   "number": 4,
   "cost": {
    "cash": 0,
    "gold": 110
   },
   "requires_cash_machine_level": 9
  },
  {
   "number": 5,
   "cost": {
    "cash": 0,
    "gold": 200
   },
   "requires_cash_machine_level": 10
  }
 ],
 "gold_machine": [
  {
   "level": 1,
   "cost": {
    "cash": 0,
    "gold": 0
   },
   "gold_per_second": 0.5,
   "door_required": 5
  },
  {
   "level": 2,
   "cost": {
    "cash": 120,
    "gold": 0
   },
   "gold_per_second": 0.5,
   "door_required": 0
  },
  {
   "level": 3,
   "cost": {
    "cash": 300,
    "gold": 0
   },
   "gold_per_second": 1.0,
   "door_required": 0
  },
  {
   "level": 4,
   "cost": {
    "cash": 680,
    "gold": 0
   },
   "gold_per_second": 1.5,
   "door_required": 0
  },
  {
   "level": 5,
   "cost": {
    "cash": 1400,
    "gold": 0
   },
   "gold_per_second": 2.0,
   "door_required": 0
  },
  {
   "level": 6,
   "cost": {
    "cash": 2800,
    "gold": 0
   },
   "gold_per_second": 2.5,
   "door_required": 0
  },
  {
   "level": 7,
   "cost": {
    "cash": 5600,
    "gold": 0
   },
   "gold_per_second": 3.5,
   "door_required": 0
  },
  {
   "level": 8,
   "cost": {
    "cash": 5900,
    "gold": 0
   },
   "gold_per_second": 4.5,
   "door_required": 0
  },
  {
   "level": 9,
   "cost": {
    "cash": 7700,
    "gold": 0
   },
   "gold_per_second": 5.5,
   "door_required": 0
  },
  {
   "level": 10,
   "cost": {
    "cash": 15400,
    "gold": 0
   },
   "gold_per_second": 7.5,
   "door_required": 0
  },
  {
   "level": 11,
   "cost": {
    "cash": 30800,
    "gold": 0
   },
   "gold_per_second": 9.5,
   "door_required": 0
  },
  {
   "level": 12,
   "cost": {
    "cash": 42000,
    "gold": 0
   },
   "gold_per_second": 11.5,
   "door_required": 0
  },
  {
   "level": 13,
   "cost": {
    "cash": 54400,
    "gold": 0
   },
   "gold_per_second": 14.0,
   "door_required": 0
  },
  {
   "level": 14,
   "cost": {
    "cash": 60000,
    "gold": 0
   },
   "gold_per_second": 16.5,
   "door_required": 0
  },
  {
   "level": 15,
   "cost": {
    "cash": 65200,
    "gold": 0
   },
   "gold_per_second": 19.0,
   "door_required": 0
  },
  {
   "level": 16,
   "cost": {
    "cash": 74000,
    "gold": 0
   },
   "gold_per_second": 22.0,
   "door_required": 0
  },
  {
   "level": 17,
   "cost": {
    "cash": 85200,
    "gold": 0
   },
   "gold_per_second": 25.0,
   "door_required": 0
  },
  {
   "level": 18,
   "cost": {
    "cash": 109800,
    "gold": 0
   },
   "gold_per_second": 28.0,
   "door_required": 0
  },
  {
   "level": 19,
   "cost": {
    "cash": 146800,
    "gold": 0
   },
   "gold_per_second": 31.0,
   "door_required": 0
  },
  {
   "level": 20,
   "cost": {
    "cash": 186800,
    "gold": 0
   },
   "gold_per_second": 34.5,
   "door_required": 0
  },
  {
   "level": 21,
   "cost": {
    "cash": 227000,
    "gold": 0
   },
   "gold_per_second": 38.0,
   "door_required": 0
  },
  {
   "level": 22,
   "cost": {
    "cash": 317800,
    "gold": 0
   },
   "gold_per_second": 41.5,
   "door_required": 0
  },
  {
   "level": 23,
   "cost": {
    "cash": 368700,
    "gold": 0
   },
   "gold_per_second": 45.0,
   "door_required": 0
  },
  {
   "level": 24,
   "cost": {
    "cash": 416300,
    "gold": 0
   },
   "gold_per_second": 50.0,
   "door_required": 0
  },
  {
   "level": 25,
   "cost": {
    "cash": 470200,
    "gold": 0
   },
   "gold_per_second": 55.0,
   "door_required": 0
  },
  {
   "level": 26,
   "cost": {
    "cash": 529180,
    "gold": 0
   },
   "gold_per_second": 60.0,
   "door_required": 0
  },
  {
   "level": 27,
   "cost": {
    "cash": 596920,
    "gold": 0
   },
   "gold_per_second": 65.0,
   "door_required": 0
  },
  {
   "level": 28,
   "cost": {
    "cash": 659940,
    "gold": 0
   },
   "gold_per_second": 70.0,
   "door_required": 0
  },
  {
   "level": 29,
   "cost": {
    "cash": 743120,
    "gold": 0
   },
   "gold_per_second": 75.0,
   "door_required": 0
  },
  {
   "level": 30,
   "cost": {
    "cash": 852920,
    "gold": 0
   },
   "gold_per_second": 80.0,
   "door_required": 0
  }
 ],
 "decompose": [
  {
   "level": 1,
   "gold_input": 5,
   "cash_output": 50
  },
  {
   "level": 2,
   "gold_input": 5,
   "cash_output": 65
  },
  {
   "level": 3,
   "gold_input": 9,
   "cash_output": 90
  },
  {
   "level": 4,
   "gold_input": 13,
   "cash_output": 125
  },
  {
   "level": 5,
   "gold_input": 17,
   "cash_output": 326
  },
  {
   "level": 6,
   "gold_input": 21,
   "cash_output": 1070
  },
  {
   "level": 7,
   "gold_input": 25,
   "cash_output": 1680
  },
  {
   "level": 8,
   "gold_input": 29,
   "cash_output": 2780
  },
  {
   "level": 9,
   "gold_input": 33,
   "cash_output": 4290
  },
  {
   "level": 10,
   "gold_input": 37,
   "cash_output": 5680
  },
  {
   "level": 11,
   "gold_input": 41,
   "cash_output": 8680
  },
  {
   "level": 12,
   "gold_input": 45,
   "cash_output": 13820
  },
  {
   "level": 13,
   "gold_input": 49,
   "cash_output": 13820
  },
  {
   "level": 14,
   "gold_input": 57,
   "cash_output": 13820
  },
  {
   "level": 15,
   "gold_input": 73,
   "cash_output": 14950
  },
  {
   "level": 16,
   "gold_input": 97,
   "cash_output": 17520
  },
  {
   "level": 17,
   "gold_input": 121,
   "cash_output": 19560
  },
  {
   "level": 18,
   "gold_input": 153,
   "cash_output": 22380
  },
  {
   "level": 19,
   "gold_input": 193,
   "cash_output": 25770
  },
  {
   "level": 20,
   "gold_input": 225,
   "cash_output": 27100
  },
  {
   "level": 21,
   "gold_input": 273,
   "cash_output": 29420
  },
  {
   "level": 22,
   "gold_input": 321,
   "cash_output": 31300
  },
  {
   "level": 23,
   "gold_input": 369,
   "cash_output": 32380.0
  },
  {
   "level": 24,
   "gold_input": 417,
   "cash_output": 33270
  },
  {
   "level": 25,
   "gold_input": 473,
   "cash_output": 34590
  },
  {
   "level": 26,
   "gold_input": 537,
   "cash_output": 35090
  },
  {
   "level": 27,
   "gold_input": 593,
   "cash_output": 36430
  },
  {
   "level": 28,
   "gold_input": 657,
   "cash_output": 37720
  },
  {
   "level": 29,
   "gold_input": 721,
   "cash_output": 38850
  },
  {
   "level": 30,
   "gold_input": 793,
   "cash_output": 39930
  }
 ],
 "door": [
  {
   "level": 1,
   "name": "Wood Door",
   "max_hp": 1000,
   "cost": {
    "cash": 0,
    "gold": 0
   }
  },
  {
   "level": 2,
   "name": "Stone Door",
   "max_hp": 1500,
   "cost": {
    "cash": 0,
    "gold": 0
   }
  },
  {
   "level": 3,
   "name": "Steel Door",
   "max_hp": 2000,
   "cost": {
    "cash": 30,
    "gold": 0
   }
  },
  {
   "level": 4,
   "name": "Iron Gate",
   "max_hp": 6000,
   "cost": {
    "cash": 80,
    "gold": 0
   }
  },
  {
   "level": 5,
   "name": "Reinforced Gate",
   "max_hp": 12500,
   "cost": {
    "cash": 200,
    "gold": 0
   }
  },
  {
   "level": 6,
   "name": "Titanium Gate",
   "max_hp": 25000,
   "cost": {
    "cash": 800,
    "gold": 0
   }
  },
  {
   "level": 7,
   "name": "Adamantium Gate",
   "max_hp": 50000,
   "cost": {
    "cash": 2000,
    "gold": 15
   }
  },
  {
   "level": 8,
   "name": "Obsidian Fortress Gate",
   "max_hp": 100000,
   "cost": {
    "cash": 5000,
    "gold": 32
   }
  },
  {
   "level": 9,
   "name": "Dragon Scale Gate",
   "max_hp": 200000,
   "cost": {
    "cash": 12000,
    "gold": 62
   }
  },
  {
   "level": 10,
   "name": "Mythril Barrier",
   "max_hp": 350000,
   "cost": {
    "cash": 28000,
    "gold": 110
   }
  },
  {
   "level": 11,
   "name": "Celestial Vault",
   "max_hp": 600000,
   "cost": {
    "cash": 65000,
    "gold": 185
   }
  },
  {
   "level": 12,
   "name": "Eternal Divine Gate",
   "max_hp": 1200000,
   "cost": {
    "cash": 130000,
    "gold": 300
   }
  },
  {
   "level": 13,
   "name": "Eternal Divine Gate",
   "max_hp": 1800000,
   "cost": {
    "cash": 300000,
    "gold": 500
   }
  },
  {
   "level": 14,
   "name": "Eternal Divine Gate",
   "max_hp": 2200000,
   "cost": {
    "cash": 150000,
    "gold": 200
   }
  },
  {
   "level": 15,
   "name": "Eternal Divine Gate",
   "max_hp": 2900000,
   "cost": {
    "cash": 0,
    "gold": 500
   }
  },
  {
   "level": 16,
   "name": "Eternal Divine Gate",
   "max_hp": 3300000,
   "cost": {
    "cash": 0,
    "gold": 1000
   }
  },
  {
   "level": 17,
   "name": "Eternal Divine Gate",
   "max_hp": 3800000,
   "cost": {
    "cash": 0,
    "gold": 1500
   }
  },
  {
   "level": 18,
   "name": "Eternal Divine Gate",
   "max_hp": 4100000,
   "cost": {
    "cash": 0,
    "gold": 2000
   }
  },
  {
   "level": 19,
   "name": "Eternal Divine Gate",
   "max_hp": 4600000,
   "cost": {
    "cash": 0,
    "gold": 2500
   }
  },
  {
   "level": 20,
   "name": "Eternal Divine Gate",
   "max_hp": 5400000,
   "cost": {
    "cash": 0,
    "gold": 3000
   }
  }
 ],
 "turret": [
  {
   "level": 1,
   "cost": {
    "cash": 10,
    "gold": 0
   },
   "damage": 128,
   "hits_per_second": 1,
   "range": 30,
   "cash_per_shot": 1,
   "gold_per_shot": 0,
   "cash_per_second": 1,
   "gold_per_second": 0
  },
  {
   "level": 2,
   "cost": {
    "cash": 50,
    "gold": 0
   },
   "damage": 225,
   "hits_per_second": 1,
   "range": 30,
   "cash_per_shot": 1,
   "gold_per_shot": 0,
   "cash_per_second": 1,
   "gold_per_second": 0
  },
  {
   "level": 3,
   "cost": {
    "cash": 300,
    "gold": 0
   },
   "damage": 450,
   "hits_per_second": 1,
   "range": 30,
   "cash_per_shot": 2,
   "gold_per_shot": 0,
   "cash_per_second": 2,
   "gold_per_second": 0
  },
  {
   "level": 4,
   "cost": {
    "cash": 700,
    "gold": 0
   },
   "damage": 240,
   "hits_per_second": 4,
   "range": 30,
   "cash_per_shot": 1,
   "gold_per_shot": 0,
   "cash_per_second": 4,
   "gold_per_second": 0
  },
  {
   "level": 5,
   "cost": {
    "cash": 1300,
    "gold": 0
   },
   "damage": 1250,
   "hits_per_second": 2,
   "range": 30,
   "cash_per_shot": 2,
   "gold_per_shot": 0,
   "cash_per_second": 4,
   "gold_per_second": 0
  },
  {
   "level": 6,
   "cost": {
    "cash": 2500,
    "gold": 18
   },
   "damage": 4000,
   "hits_per_second": 1,
   "range": 40,
   "cash_per_shot": 15,
   "gold_per_shot": 0,
   "cash_per_second": 15,
   "gold_per_second": 0
  },
  {
   "level": 7,
   "cost": {
    "cash": 6500,
    "gold": 34
   },
   "damage": 725,
   "hits_per_second": 10,
   "range": 30,
   "cash_per_shot": 3,
   "gold_per_shot": 0,
   "cash_per_second": 30,
   "gold_per_second": 0
  },
  {
   "level": 8,
   "cost": {
    "cash": 18000,
    "gold": 58
   },
   "damage": 2240,
   "hits_per_second": 5,
   "range": 30,
   "cash_per_shot": 10,
   "gold_per_shot": 0,
   "cash_per_second": 50,
   "gold_per_second": 0
  },
  {
   "level": 9,
   "cost": {
    "cash": 35000,
    "gold": 98
   },
   "damage": 17000,
   "hits_per_second": 2,
   "range": 30,
   "cash_per_shot": 39,
   "gold_per_shot": 1,
   "cash_per_second": 78,
   "gold_per_second": 2
  },
  {
   "level": 10,
   "cost": {
    "cash": 80000,
    "gold": 200
   },
   "damage": 50000,
   "hits_per_second": 1,
   "range": 30,
   "cash_per_shot": 108,
   "gold_per_shot": 2,
   "cash_per_second": 108,
   "gold_per_second": 2
  },
  {
   "level": 11,
   "cost": {
    "cash": 160000,
    "gold": 350
   },
   "damage": 82500,
   "hits_per_second": 2,
   "range": 35,
   "cash_per_shot": 90,
   "gold_per_shot": 1,
   "cash_per_second": 180,
   "gold_per_second": 2
  },
  {
   "level": 12,
   "cost": {
    "cash": 320000,
    "gold": 450
   },
   "damage": 137500,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 120,
   "gold_per_shot": 1,
   "cash_per_second": 240,
   "gold_per_second": 2
  },
  {
   "level": 13,
   "cost": {
    "cash": 440000,
    "gold": 1000
   },
   "damage": 240000,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 154,
   "gold_per_shot": 2,
   "cash_per_second": 308,
   "gold_per_second": 4
  },
  {
   "level": 14,
   "cost": {
    "cash": 750000,
    "gold": 2000
   },
   "damage": 550000,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 154,
   "gold_per_shot": 2,
   "cash_per_second": 308,
   "gold_per_second": 4
  },
  {
   "level": 15,
   "cost": {
    "cash": 2500000,
    "gold": 3000
   },
   "damage": 700000,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 154,
   "gold_per_shot": 2,
   "cash_per_second": 308,
   "gold_per_second": 4
  },
  {
   "level": 16,
   "cost": {
    "cash": 0,
    "gold": 4500
   },
   "damage": 850000,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 154,
   "gold_per_shot": 2,
   "cash_per_second": 308,
   "gold_per_second": 4
  },
  {
   "level": 17,
   "cost": {
    "cash": 0,
    "gold": 5000
   },
   "damage": 1000000,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 154,
   "gold_per_shot": 2,
   "cash_per_second": 308,
   "gold_per_second": 4
  },
  {
   "level": 18,
   "cost": {
    "cash": 0,
    "gold": 5500
   },
   "damage": 1200000,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 154,
   "gold_per_shot": 2,
   "cash_per_second": 308,
   "gold_per_second": 4
  },
  {
   "level": 19,
   "cost": {
    "cash": 0,
    "gold": 6000
   },
   "damage": 1400000,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 154,
   "gold_per_shot": 2,
   "cash_per_second": 308,
   "gold_per_second": 4
  },
  {
   "level": 20,
   "cost": {
    "cash": 0,
    "gold": 6500
   },
   "damage": 1600000,
   "hits_per_second": 2,
   "range": 40,
   "cash_per_shot": 154,
   "gold_per_shot": 2,
   "cash_per_second": 308,
   "gold_per_second": 4
  }
 ]
};
