addLayer("r", {
  symbol: "R",
  color: "#8F48E8",
  Gcolor: "repeating-linear-gradient(-45deg, #8F48E8, #8F48E8 20px, #883FE2 20px, #883FE2 40px)",
  displayRow: 25,
  row: 25,
  position: 0,
  tooltip(){
    if(player.r.points.gte(11)) return `<h2>Rebirth</h2><br>Rebirth r${formatWhole(player.r.points)}m${formatWhole(player.mr.points)}`
    return `<h2>Rebirth</h2><br>Rebirth r${formatWhole(player.r.points)}`
  },
  shouldNotify(){return this.canReset()},
  
  startData() { return {
    unlocked: true,
    points: new Decimal(0),
    offline: new Decimal(0),
    speed: 1,
  }},
  type: "custom",
  getNextAt(){
    let costs = [0,5,75,15000,5000000,1e10,1e13,1e16,1e20,1e175,"1e2025","1e7000","eeeeee9"]
    return new Decimal(costs[player[this.layer].points])
  },
  getResetGain(){
    return new Decimal(1)
  },
  canReset(){
    return getPointGen().gte(this.getNextAt())
  },
  prestigeButtonText(){
    if(player.r.points.gte(12)) return "Congratulations! You are at the final rebirth!"
    return "Lose all progress for a rebirth point<br>Requires: " + format(this.getNextAt()) + " points per second"
  },
  requires(){
    return this.getNextAt()
  },
  
  milestones: {
    0: {
      requirementDescription: "[1] 6 rebirths",
      effectDescription: "Keep two milestone points permamently (including on row 3 and rebirth)",
      done() { return player.r.points.gte(6)},
      unlocked() {return this.done()}
    },
    1: {
      requirementDescription: "[2] 7 rebirths",
      effectDescription: "Keep four milestone points permamently",
      done() { return player.r.points.gte(7)},
      unlocked() {return this.done()}
    },
    2: {
      requirementDescription: "[3] 8 rebirths",
      effectDescription: "Keep prestige upgrade automation",
      done() { return player.r.points.gte(8)},
      unlocked() {return this.done()}
    },
    3: {
      requirementDescription: "[4] 9 rebirths",
      effectDescription: "Keep five milestone points permamently<br>You can also automate reseting for collapse points.",
      toggles: [["c","autoCollapse"]],
      done() { return player.r.points.gte(9)},
      unlocked() {return this.done()}
    },
    4: {
      requirementDescription: "[5] 10 rebirths",
      effectDescription: "Get 5x collapse points<br>You can also automate reseting for upgrade points",
      toggles: [["u","autoUpgrade"]],
      done() { return player.r.points.gte(10)},
      unlocked() {return this.done()}
    },
    5: {
      requirementDescription: "[6] 12 rebirths",
      effectDescription: "The first two minirebirths are kept on Rebirths. You can buy-max energy upgrades, and automate boosters.",
      tooltip(){"Unlocks content in Upgrade and Booster layers"},
      done() { return player.r.points.gte(12)},
      toggles: [["b","autoBooster"]],
      unlocked() {return this.done()}
    }, //hasMilestone("r",5)
  },
  
  resource: "rebirth points",
  baseResource: "points per second",
  baseAmount() {return getPointGen()},
  
  tabFormat: {
    "Rebirths": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "milestones",
        "blank",
        "blank",
        "blank",
        "blank",
        ["raw-html",`<a href="https://rebirth-tree-rewritten.glitch.me" target="_self">This button will redirect you to glitch (older version) if you have lost your save</a>`,
        "blank",]
      ],
    },
    "Mini Rebirths": {
      embedLayer: "mr",
      unlocked(){return player.r.points.gte(11)},
    },
  },
  
  layerShown(){return true},
}) //REBIRTH
addLayer("mr", {
  color: "#8F48E8",
  Gcolor: "repeating-linear-gradient(-45deg, #8F48E8, #8F48E8 20px, #883FE2 20px, #883FE2 40px)",
  row: 24,
  
  startData() { return {
    unlocked: false,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
    used: new Decimal(0),
  }},
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;
    layerDataReset(this.layer);
    if(hasMilestone("r",5)) player.mr.points = new Decimal(2);
  },
  resource: "mini rebirths",
  baseAmount() {return player.c.points},
  baseResource: "collapse points",
  
  type: "custom",
  requires(){
    let costs = [1,"1e30","1e80","1e100","1e110","1e900","eeeeeeee9"];
    if(player.mr.points.gte(5)) return false
    return new Decimal(costs[player[this.layer].points]);
  },
  canReset(){return this.requires() ? player.c.points.gte(this.requires()) : false},
  prestigeButtonText(){
    if(!this.requires()) return "The next minirebirth is unobtainable"
    return `Next mini rebirth: ${format(this.getNextAt())} collapse points`
  },
  getNextAt(){return this.requires()},
  getResetGain(){return new Decimal(1)},
  totalEssence(){
    var essence = player.mr.points
    if(player.r.points.gte(12)) essence = essence.add(2)

    essence = essence.add(player.mr.challenges[11])
    essence = essence.add(player.mr.challenges[12])
    essence = essence.add(player.mr.challenges[21])
    
    return essence
  },
  essence(){
    var essence = player.mr.points.sub(player.mr.used)
    if(player.r.points.gte(12)) essence = essence.add(2)

    essence = essence.add(player.mr.challenges[11])
    essence = essence.add(player.mr.challenges[12])
    essence = essence.add(player.mr.challenges[21])
    
    return essence
  },
  
  tabFormat: [
    "main-display",
    "prestige-button",
    "milestones",
    "blank",
    ["display-text",
      function() {
        if(player.mr.points.gte(3)) return `You have ${formatWhole(tmp.mr.essence)}/${formatWhole(tmp.mr.totalEssence)} minirebirth essences<br>You get a minirebirth essence every minirebirth or completed challenge`
        return `You have ${formatWhole(tmp.mr.essence)}/${formatWhole(tmp.mr.totalEssence)} minirebirth essences<br>You get a minirebirth essence every minirebirth`
      }],
    ["clickables",1],
    "blank",
    "upgrades",
    "blank",
    "challenges",
  ],
  
  clickables: {
    11: {
      display() {return "Respec all upgrades"},
      tooltip(){
        if(!inChallenge("mr",11) && !inChallenge("mr",12) && !inChallenge("mr",21)) return `This will force a MR reset`
        return `You are currently inside a challenge, so this button is unusable.`
      },
      onClick() {
        doReset("mr",true)
        player.mr.upgrades = [];
        player.mr.used = new Decimal(0)
      },
      canClick() {return player.mr.used.gte(1) && !inChallenge("mr",11) && !inChallenge("mr",12) && !inChallenge("mr",21)},
      style: {"width":"300px"},
    }
  },
  milestones: {
    0: {
      requirementDescription: "[1] 1 Minirebirth / 1 collapse",
      effectDescription: "Unlock automation for U & C upgrades",
      done() { return player.mr.points.gte(1)},
      toggles: [["u","autoUUpgrade"],["c","autoUpgrade"]],
      unlocked() {return player.mr.points.gte(0)}
    },
    1: {
      requirementDescription: "[2] 2 Minirebirths / e30 collapse",
      effectDescription: "Get 5% of collapse points per second and automate milestone resets",
      done() { return player.mr.points.gte(2)},
      toggles: [["m","autoReset"]],
      unlocked() {return player.mr.points.gte(1)}
    },
    2: {
      requirementDescription: "[3] 3 Minirebirths / e80 collapse",
      effectDescription: "Unlock Challenges",
      done() { return player.mr.points.gte(3)},
      unlocked() {return player.mr.points.gte(2)}
    },
    3: {
      requirementDescription: "[4] 4 Minirebirths / e100 collapse",
      effectDescription: "Unlock some upgrades & a new challenge",
      done() { return player.mr.points.gte(4)},
      unlocked() {return player.mr.points.gte(3)}
    },
    4: {
      requirementDescription: "[5] 5 Minirebirths / e110 collapse",
      effectDescription: "Start with one collapse point and get a few new upgrades",
      done() { return player.mr.points.gte(5)},
      unlocked() {return player.mr.points.gte(4)}
    },
    5: {
      requirementDescription: "[6] 6 Minirebirths / e900 collapse",
      effectDescription: "This doesn't do anything yet.",
      done() { return player.mr.points.gte(6)},
      unlocked() {return player.mr.points.gte(5) && player.r.points.gte(12)}
    },
  },
  challenges: {
    11: {
      fullDisplay(){
        let sacrifices = "A powerful Power, Uselessness"
        if(player.mr.challenges[11] >= 1) sacrifices += ", Anti-Boosters"
        if(player.mr.challenges[11] >= 2) sacrifices += ", Inflated Upgrades"
        if(player.mr.challenges[11] >= 3) sacrifices += ", Extremely Powerful"

        return `<h2>Eternally Trapped [${player.mr.challenges[11]}/3]</h2><br> You are stuck in level 2 of ${sacrifices}. Also reduces Collapse requirement by /100<br>Goal: 1e9 collapse points<br>Reward: Strengthen sacrifice reward by ^+0.2 per level`},
      onEnter(){
        if(player.mr.challenges[11] == 0) player.c.sacrifices = [2,0,0,2,0]
        if(player.mr.challenges[11] == 1) player.c.sacrifices = [2,0,2,2,0]
        if(player.mr.challenges[11] == 2) player.c.sacrifices = [2,2,2,2,0]
        if(player.mr.challenges[11] == 3) player.c.sacrifices = [2,2,2,2,2]
      },
      onExit(){
        if(!hasAchievement("sa",12) && player.mr.challenges[11]>=3 && !player.c.autoCollapse && !player.c.autoUpgrade && !player.u.autoUpgrade && !player.u.autoUUpgrade && !player.b.autoBooster) player.sa.achievements.push(12)
      },
      canComplete: function() {return player.c.points.gte(1e9)},
      completionLimit: 3,
      unlocked(){return hasMilestone("mr",2)}
    },
    12: {
      fullDisplay(){return `<h2>Total point breakdown [${player.mr.challenges[12]}/5]</h2><br> Nerf or remove almost every upgrade/milestone in the prestige layer.<br>Goal: ${format(this.goal())} points<br>Reward: Strengthens the first collapse upgrade and passive generation`},
      goal(){return new Decimal([1e10,1e50,1e200,"1e500","1e800","1e800"][player.mr.challenges[12]])},
      onEnter(){player.c.sacrifices = [this.difficulty(),this.difficulty(),this.difficulty(),this.difficulty(),this.difficulty()]},
      canComplete: function() {return player.points.gte(this.goal())},
      completionLimit: 5,
      unlocked(){return hasMilestone("mr",2)}
    },
    21: {
      fullDisplay(){return `<h2>Feature Disablation [${player.mr.challenges[21]}/3]</h2><br>You are unable to use Collapse Sacrifices. You act like you are in "Anti-boosters" 10 times, and "Inflated Upgrades" 6 times. You also gain ^0.75 points<br>Goal: ${formatWhole(new Decimal(1e20).pow(player.mr.challenges[21]).mul(1e11))} points<br>Reward: ^1.1 points`},
      onEnter(){player.c.sacrifices = [1,6,10,0,0]},
      canComplete: function() {return player.points.gte(new Decimal(1e20).pow(player.mr.challenges[21]).mul(1e11))},
      completionLimit: 3,
      unlocked(){return hasMilestone("mr",3)}
    },
  },
  upgrades: {
    11: {
      fullDisplay(){
        return "<big>^1.1 points</big><br>Cost: 1 Minirebirth essence"
      },
      
      canAfford(){
        return layers.mr.essence().gte(1)
      },
      pay(){
        player.mr.used = player.mr.used.add(1)
      },
    },
    12: {
      fullDisplay(){
        return "<big>Nerf Milestone 2's effect by -2</big><br>Cost: -2 Minirebirth essence"
      },
      
      canAfford(){
        return layers.mr.essence().gte(-2)
      },
      pay(){
        player.mr.used = player.mr.used.sub(2)
      },

      unlocked(){return player.r.points.gte(12)}
    },
    21: {
      fullDisplay(){
        return "<big>^1.1 points</big><br>Cost: 1 Minirebirth essence"
      },
      
      canAfford(){
        return layers.mr.essence().gte(1) && hasUpgrade("mr",11)
      },
      pay(){
        player.mr.used = player.mr.used.add(1)
      },
      branches: [11],
    },
    22: {
      fullDisplay(){
        return "Gain a static 100x point multiplier<br>Cost: 1 Minirebirth Essence"
      },
      tooltip: "This will ignore any challenge effects.",
      
      canAfford(){
        return layers.mr.essence().gte(1) && hasUpgrade("mr",11)
      },
      pay(){
        player.mr.used = player.mr.used.add(1)
      },
      branches: [11],
    },
    23: {
      fullDisplay(){
        return "Unlock two new milestones<br>Cost: 2 Minirebirth Essence"
      },
      tooltip: "(they cost 55 & 90 M points)",
      
      canAfford(){
        return layers.mr.essence().gte(2) && hasUpgrade("mr",11)
      },
      pay(){
        player.mr.used = player.mr.used.add(2)
      },
      branches: [11],
    },
    31: {
      fullDisplay(){
        return "<big>^1.1 points</big><br>Cost: 2 Minirebirth essences"
      },
      
      canAfford(){
        return layers.mr.essence().gte(2) && hasUpgrade("mr",21)
      },
      pay(){
        player.mr.used = player.mr.used.add(2)
      },
      branches: [21],
      unlocked(){return hasMilestone("mr",3)},
    },
    32: {
      fullDisplay(){
        return "Gain 10x prestige points<br>Cost: 1 Minirebirth Essence"
      },
      
      canAfford(){
        return layers.mr.essence().gte(1) && hasUpgrade("mr",22)
      },
      pay(){
        player.mr.used = player.mr.used.add(1)
      },
      branches: [22],
    },
    33: {
      fullDisplay(){
        return "Reduce milestone point requirement<br>Cost: 1 Minirebirth Essence"
      },
      tooltip: "(sqrts the requirement)",
      
      canAfford(){
        return layers.mr.essence().gte(1) && hasUpgrade("mr",23)
      },
      pay(){
        player.mr.used = player.mr.used.add(1)
      },
      branches: [23],
      unlocked(){return hasMilestone("mr",3)},
    },
    42: {
      fullDisplay(){
        return "U points are cheaper to get<br>Cost: 2 Minirebirth Essences"
      },
      tooltip: "this also gives you +2 max U points",
      
      canAfford(){
        return layers.mr.essence().gte(2) && hasUpgrade("mr",32)
      },
      pay(){
        player.mr.used = player.mr.used.add(2)
      },
      branches: [32],
      unlocked(){return hasMilestone("mr",3)},
    },
    51: {
      fullDisplay(){
        return "Increase collapse point gain formula to be stronger<br>Cost: 2 Minirebirth Essences"
      },
      tooltip: "This goes from log10(x) to log2(x)<sup>5</sup>",
  
      
      canAfford(){
        return layers.mr.essence().gte(2) && hasUpgrade("mr",42)
      },
      pay(){
        player.mr.used = player.mr.used.add(2)
      },
      branches: [42],
      unlocked(){return hasMilestone("mr",4)},
    },
    52: {
      fullDisplay(){
        return "U points are even cheaper<br>Cost: 1 Minirebirth Essence"
      },
      tooltip: "^0.55 it's price",
      
      canAfford(){
        return layers.mr.essence().gte(1) && hasUpgrade("mr",42)
      },
      pay(){
        player.mr.used = player.mr.used.add(1)
      },
      branches: [42],
      unlocked(){return hasMilestone("mr",3)},
    },
    53: {
      fullDisplay(){
        return "Strengthen the first (top-left) upgrade in collapse<br>Cost: 2 Minirebirth Essences"
      },
      
      canAfford(){
        return layers.mr.essence().gte(2) && hasUpgrade("mr",42)
      },
      pay(){
        player.mr.used = player.mr.used.add(2)
      },
      branches: [42],
      unlocked(){return hasMilestone("mr",4)},
    },
    61: {
      fullDisplay(){
        return "The 'Collapse Boost' upgrade in Energy can be bought 8,901 more times.<br>Cost: 2 Minirebirth Essences"
      },
      
      canAfford(){
        return layers.mr.essence().gte(2) && hasUpgrade("mr",51) && hasUpgrade("mr",52) && hasUpgrade("mr",53)
      },
      pay(){
        player.mr.used = player.mr.used.add(2)
      },
      branches: [51,52,53],
      unlocked(){return hasMilestone("mr",4) && player.r.points.gte(12)},
    },
  },
  
  hotkeys: [
    {key: "R", description: "Shift + R: Reset for a minirebirth", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  layerShown(){return false},
}) //Mini Rebirth
addLayer("a", {
  tabFormat: {
    "Achievements": {
      content: [
        ["display-text",
        function() {return `Achievements are boosting point gain by <strong>x${format(layers.a.achBoost())}</strong>`}],
        "blank",
        "blank",
        "achievements"
      ],
    },
    "Secret Achievments": {
      embedLayer: "sa",
      unlocked(){return player.sa.achievements.length>=1},
    },
  },

  symbol: "A",
  color: "#ffee00",
  Gcolor: "repeating-linear-gradient(-45deg, #ffee00, #ffee00 20px, #F3E303 20px, #F3E303 40px)",
  row: "side",
  position: 0,
  tooltip(){
    return "<h2>Achievements</h2><br>" + formatWhole(player.a.achievements.length) + " Achievements"
  },
  
  startData() { return {
    unlocked: true,
		points: new Decimal(0),
  }},
  //achievementPopups: true,
  achievements: {
    11: {
      name: "It begins..",
      done() {return player.r.points.gte(1)},
      tooltip: "Get one rebirth",
    },
    12: {
      name: "Rebirth two",
      done() {return player.r.points.gte(2)},
      tooltip: "Get two rebirths",
    },
    13: {
      name: "Rebirth three",
      done() {return player.r.points.gte(3)},
      tooltip: "Get three rebirths",
    },
    14: {
      name: "What's this..?",
      done() {return player.u.points.gte(1)},
      tooltip: "Obtain a upgrade point",
    },
    15: {
      name: "Triplets",
      done() {return player.u.points.gte(3)},
      tooltip: "Obtain three upgrade points",
    },
    16: {
      name: "All Star",
      done() {return player.u.points.gte(4)},
      tooltip: "Obtain four upgrade points",
    },
    17: {
      name: "Rebirth Four",
      done() {return player.r.points.gte(4)},
      tooltip: "Obtain four rebirth points at once",
    },
    21: {
      name: "Boosts",
      done() {return player.b.points.gte(1)},
      tooltip: "Obtain a booster",
    },
    22: {
      name: "Triplets! Again..",
      done() {return player.b.points.gte(3)},
      tooltip: "Obtain three booster points at once",
    },
    23: {
      name: "Gotta get them all",
      done() {return player.r.points.gte(5)},
      tooltip: "Obtain five rebirth points",
    },
    24: {
      name: "Persistance",
      done() {return player.m.points.gte(1)},
      tooltip: "Obtain a milestone point",
    },
    25: {
      name: "Finally, some automation!",
      done() {return player.m.points.gte(3)},
      tooltip: "Obtain three milestone points",
    },
    26: {
      name: "More upgrades!",
      done() {return player.m.points.gte(4)},
      tooltip: "Obtain four milestone points",
    },
    27: {
      name: "I need them all!",
      done() {return player.m.points.gte(5)},
      tooltip: "Obtain five milestone points",
    },
    31: {
      name: "Here we go again!",
      done() {return player.r.points.gte(6)},
      tooltip: "Obtain 6 rebirth points",
    },
    32: {
      name: "Another layer!",
      done() {return player.c.points.gte(1)},
      tooltip: "Get your first collapse point",
    },
    33: {
      name: "An upgrade",
      done() {return player.c.upgrades.length >= 1},
      tooltip: "Buy a collapse upgrade",
    },
    34: {
      name: "Pentagon",
      done() {return player.c.upgrades.length >= 5},
      tooltip: "Buy all 5 collapse upgrades",
    },
    35: {
      name: "Buyout",
      done() {return player.c.upgrades.length >= 7},
      tooltip: "Buy all 7 collapse upgrades",
    },
    36: {
      name: "The Start of a New Rebirth",
      done() {return player.r.points.gte(7)},
      tooltip: "Obtain seven rebirth points",
    },
    37: {
      name: "Sacrifices",
      done() {return tmp.c.sacAm >= 1 && player.points.gte(1e9)},
      tooltip: "Complete a run with one or more sacrifices",
    },
    41: {
      name: "Double Sacrifices",
      done() {return tmp.c.sacAm >= 2 && player.points.gte(1e9)},
      tooltip: "Complete a run with two or more sacrifices",
    },
    42: {
      name: "Triple Sacrifices",
      done() {return tmp.c.sacAm >= 3 && player.points.gte(1e9)},
      tooltip: "Complete a run with three or more sacrifices",
    },
    43: {
      name: "Another Buyout",
      done() {return player.c.upgrades.length >= 11},
      tooltip: "Obtain eleven collapse upgrades",
    },
    44: {
      name: "Deca-boosters",
      done() {return player.b.points.gte(10)},
      tooltip: "Obtain ten booster points",
    },
    45: {
      name: "Rebirth Eight",
      done() {return player.r.points.gte(8)},
      tooltip: "Get your 8th rebirth",
    },
    46: {
      name: "I'm back",
      done() {return player.r.points.gte(8) && player.c.upgrades.length >= 11},
      tooltip: "Obtain eleven collapse upgrades during your 8th rebirth",
    },
    47: {
      name: "Quadrupled sacrifices",
      done() {return tmp.c.sacAm >= 4 && player.points.gte(1e9)},
      tooltip: "Complete a run with four or more sacrifices",
    },
    51: {
      name: "Getting them all",
      done() {return tmp.c.sacAm >= 5 && player.points.gte(1e10)},
      tooltip: "Complete a run with five or more sacrifices",
    },
    52: {
      name: "Collapse Millionare",
      done() {return player.c.points.gte(1e6)},
      tooltip: "Get 1e6 collapse points",
    },
    53: {
      name: "So many Upgrades",
      done() {return player.c.upgrades.length >= 18},
      tooltip: "Obtain 18 collapse upgrades",
    },
    54: {
      name: "Billionare",
      done() {return player.c.points.gte(1e9)},
      tooltip: "Get 1e9 collapse points",
    },
    55: {
      name: "Septa sacrifices",
      done() {return tmp.c.sacAm >= 7 && player.points.gte(1e12)},
      tooltip: "Complete a run with seven or more sacrifices",
    },
    56: {
      name: "Octa sacrifices",
      done() {return tmp.c.sacAm >= 8 && player.points.gte(1e13)},
      tooltip: "Complete a run with eight or more sacrifices",
    },
    57: {
      name: "Pointful yet Pointless",
      done() {return player.points.gte(1e30)},
      tooltip: "Obtain a decillion [1e30] Points",
    },
    61: {
      name: "The start of a new layer!",
      done() {return player.r.points.gte(9)},
      tooltip: "Get your 9th rebirth",
    },
    62: {
      name: "Energetic",
      done() {return player.e.points.gte(1)},
      tooltip: "Obtain an energy point",
    },
    63: {
      name: "Power collector",
      done() {return player.e.total.gte(5)},
      tooltip: "Obtain a total of 5 energy points or more",
    },
    64: {
      name: "Hyperboosts",
      done() {return player.b.points.gte(25)},
      tooltip: "Obtain 25 booster points or more",
    },
    65: {
      name: "Upgradeless twos",
      done() {return player.points.gte(1e22) && player.u.points.eq(0)},
      tooltip: "Obtain 1e22 points or more without any upgrade points",
    },
    66: {
      name: "Boosters are getting useless",
      done() {return player.b.points.gte(35)},
      tooltip: "Obtain 35 booster points or more",
    },
    67: {
      name: "Boosers are getting even more useless",
      done() {return player.b.points.gte(50)},
      tooltip: "Obtain 50 booster points or more",
    },
    71: {
      name: "Energy collector",
      done() {return player.e.points.gte(10000)},
      tooltip: "Get 10,000 energy",
    },
    72: {
      name: "Energy Surge",
      done() {return player.e.points.gte(1e9)},
      tooltip: "Get 1,000,000,000 energy",
    },
    73: {
      name: "How many left?",
      done() {return player.r.points.gte(10)},
      tooltip: "Get 10 rebirth",
    },
    74: {
      name: "Layer Expansion.?",
      done() {return player.m.points.gte(6) && player.r.points.gte(10)}, //this requirement is added just in case v1.5 infinite milestone glitch
      tooltip: "Get 6 milestone points",
    },
    75: {
      name: "A second digit!",
      done() {return player.m.points.gte(10)},
      tooltip: "Get 10 milestone points",
    },
    76: {
      name: "All ten",
      done() {return player.m.points.gte(36)},
      tooltip: "Get 36 milestone points",
    },
    77: {
      name: "Two Energy Surges",
      done() {return player.e.points.gte(1e18)},
      tooltip: "Get 1e18 (sextillion) energy points",
    },
    81: {
      name: "Sacrifice Master",
      done() {return tmp.c.sacAm >= 20 && player.points.gte(1e26)},
      tooltip: "Collapse with 20 collapse sacrifices"
    },
    82: {
      name: "totally rich",
      done() {return player.points.gte(new Decimal("1e6000"))},
      tooltip: "get 1e6,000 points.."
    },
    83: {
      name: "Two of the same digits",
      done() {return player.r.points.gte(11)},
      tooltip: "Get 11 rebirths"
    },
    84: {
      name: "wait, what??",
      done() {return player.mr.points.gte(1)},
      tooltip: "get a mini rebirth point"
    },
    85: {
      name: "too much QoL",
      done() {return player.mr.points.gte(2)},
      tooltip: "get 2 mini rebirth points"
    },
    86: {
      name: "Uh oh",
      done() {return player.mr.points.gte(3)},
      tooltip: "get 3 mini rebirth points"
    },
    87: {
      name: "Anti challenged",
      done() {return player.mr.challenges[11] >= 1},
      tooltip: "beat the first challenge once"
    },
    91: {
      name: "A very mini timewall",
      done() {return player.mr.challenges[12] >= 1},
      tooltip: "beat the second challenge once"
    },
    92: {
      name: "Second upgrade Layer",
      done() {return player.mr.points.gte(4)},
      tooltip: "Get 4 mini rebirths."
    },
    93: {
      name: "Maximum Handicaps",
      done() {return tmp.c.sacAm >= 25 && player.points.gte(1e30)},
      tooltip: "Complete a collapse run with all 25 sacrifices"
    },
    94: {
      name: "Maximum Handicaps +1",
      done() {return tmp.c.sacAm >= 25 && player.points.gte(1e30) && inChallenge("mr",12)},
      tooltip: "Complete a collapse run with all 25 sacrifices inside of Total point breakdown"
    },
    95: {
      name: "New Challenges Await",
      done() {return player.mr.points.gte(5)},
      tooltip: "Get 5 mini rebirths"
    },
    96: {
      name: "I dont need any of those",
      done() {return player.mr.challenges[21] >= 3},
      tooltip: "Beat Feature Disablation three times"
    },
    97: {
      name: "New rebirth!",
      done() {return player.r.points.gte(12)},
      tooltip: "Get to the 12th rebirth"
    },
  },
  achBoost(){return new Decimal(1.065).pow(player.a.achievements.length)},
}) //ACHIEVEMENTS

addLayer("sa", {
  achievementPopups: true,
  achievements: {
    11: {
      name: "What.?",
      done() {return hasUpgrade("p",91)},

      goalTooltip: "Buy a very specific.. secret.. upgrade.",
      doneTooltip: "Unlock upgrade -11 in the prestige layer.",
    },
    12: {
      name: "You did that just for an achievement, right?",
      done() {return false},

      goalTooltip(){return player.mr.points.gte(3) || player.r.points.gte(12) ? "Experience pain in the first minirebirth challenge" : "Experience pain in a challenge"},
      doneTooltip: "Beat 'Eternally Trapped' on the 3rd level without any automation",
    },
    13: {
      name: "You did it! [look in achievements for a new tab]",
      done() {return player.c.points.gte("e1100")},

      goalTooltip(){return "You can get this one with normal progression, don't worry!"},
      doneTooltip: "Beat the game.",
    },
    14: {
      name: "Torn Apart",
      done() {return player.c.points.gte("e1100") && player.timePlayed <= 3600*16},

      goalTooltip(){return (player.timePlayed > 3600*16) ? "Do something ridiciously fast.. is this even possible?<br>This achievement is no longer obtainable because of how long you have spent in the game.<br>Tip: I would not recommend using offline progress with this" : "Do something ridiciously fast.. is this even possible?<br>Tip: I would not recommend using offline progress with this"},
      doneTooltip: "Beat the game in under 16 hours.",
    },
  },
  tabFormat: [
    ["display-text",
        function() {return `These secret achievements don't have any effects, but are cool to get<br>Hovering over them might give a hint on what they are`}],
    "blank",
    "achievements",
  ]
}) //ACHIEVEMENTS