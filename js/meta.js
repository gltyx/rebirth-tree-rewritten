addLayer("r", {
  symbol: "R",
  color: "#8F48E8",
  Gcolor: "repeating-linear-gradient(-45deg, #8F48E8, #8F48E8 20px, #883FE2 20px, #883FE2 40px)",
  displayRow: 25,
  row: 25,
  position: 0,
  tooltip(){
    if(player.r.points.gte(11)) return `<h2>Rebirth</h2><br>Rebirth r${formatWhole(player.r.points)}m${formatWhole(player.mr.points)}<br>${layers.mr.essence()}/${layers.mr.totalEssence()} MR essence`
    return `<h2>Rebirth</h2><br>Rebirth r${formatWhole(player.r.points)}`
  },
  shouldNotify(){return this.canReset()},
  
  startData() { return {
    unlocked: true,
    points: new Decimal(0),
    offline: new Decimal(0),
    speed: 1,
  }},
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;
    layerDataReset(this.layer);
    if(hasMilestone("v",0)) player.r.milestones = player.r.milestones = [2,4,5,7];
  },
  type: "custom",
  requirement(){
    let costs = [0,3,75,50000,25000000,1e10,1e12,1e15,1e24,1e250,"1e1111","1e6666","1e185000","eeeeee9"]
    return new Decimal(costs[player[this.layer].points])
  },
  getNextAt(){
    let costs = [0,3,75,50000,25000000,1e10,1e12,1e15,1e24,1e250,"1e1111","1e6666","1e185000","eeeeee9"]
    if(!hasMilestone("v",0)) return new Decimal(costs[player[this.layer].points])
    for(var i=player.r.points; i<costs.length;i++){
      if(this.baseAmount().lt(costs[i])){
        return new Decimal(costs[i])
      }
    }
  },
  getResetGain(){
    if(!hasMilestone("v",0)) return new Decimal(1)
    let costs = [0,3,75,50000,25000000,1e10,1e12,1e15,1e24,1e250,"1e1111","1e6666","1e185000","eeeeee9"]
    for(var i=player.r.points; i<costs.length;i++){
      if(this.baseAmount().lt(costs[i])){
        return new Decimal(i).sub(player.r.points)
      }
    }
  },
  canReset(){
    if(player.r.points.gte(12) && !hasUpgrade("s",82)) return false
    return getPointGen().gte(this.requirement())
  },
  prestigeButtonText(){
    if(player.r.points.gte(13)) return "You are at the final rebirth!"

    if(player.r.points.gte(12) && !hasUpgrade("s",82))
      return `Lose all previous progress and Rebirth.<br><s>Requires ${format(this.getNextAt(),1)} points per second</s><br>The next rebirth is locked..`
    
    if(player.r.points.eq(0))
      return `Lose all previous progress and Rebirth.`
    if(player.r.points.eq(0) && hasMilestone("v",1))
      return `Lose all previous progress and Rebirth (twice).`

    if(hasMilestone("v",0)) return `Lose all previous progress and Rebirth ${this.getResetGain().max(1)} time(s).<br>${format(this.baseAmount(),1)}/${format(this.getNextAt(),1)} (${format(this.baseAmount().add(1).log(10).div(this.getNextAt().add(1).log(10)).mul(100),1)}%) points per second until next rebirth`
    return `Lose all previous progress and Rebirth.<br>${format(this.baseAmount(),1)}/${format(this.getNextAt(),1)} (${format(this.baseAmount().add(1).log(10).div(this.getNextAt().add(1).log(10)).mul(100),1)}%) points per second`

    //this.baseAmount().add(1).log(10).div(this.getNextAt().add(1).log(10))
  },
  requires(){
    return this.requirement()
  },
  
  milestones: {
    0: {
      requirementDescription: "[1] 5 rebirths",
      effectDescription: "Keep an upgrade point on all resets, permamently.",
      done() { return player.r.points.gte(5)},
      unlocked() {return this.done() || hasMilestone("v",0)}
    },
    1: {
      requirementDescription: "[2] 6 rebirths",
      effectDescription: "Keep three milestone points on all resets, permamently.",
      done() { return player.r.points.gte(6)},
      unlocked() {return this.done() || hasMilestone("v",0)}
    },
    2: {
      requirementDescription: "[3] 7 rebirths",
      effectDescription: "Keep the prestige upgrade automation on all resets, permamently.",
      done() { return player.r.points.gte(7)},
      unlocked() {return this.done() || hasMilestone("v",0)}
    },
    3: {
      requirementDescription: "[4] 8 rebirths",
      effectDescription: "Keep five milestone points on all resets, permamently.",
      done() { return player.r.points.gte(8)},
      unlocked() {return this.done() || hasMilestone("v",0)}
    },
    4: {
      requirementDescription: "[5] 9 rebirths",
      effectDescription: "You can automatically reset for Upgrade Points",
      toggles: [["u","autoUpgrade"]],
      done() { return player.r.points.gte(9)},
      unlocked() {return this.done() || hasMilestone("v",0)}
    },
    5: {
      requirementDescription: "[6] 10 rebirths",
      effectDescription: "You can automatically reset for Boosters",
      toggles: [["b","autoBooster"]],
      done() { return player.r.points.gte(10)},
      unlocked() {return this.done() || hasMilestone("v",0)}
    },
    6: {
      requirementDescription: "[7] 12 rebirths",
      effectDescription: "Keep all chargers/chargers^2 on all persets, permamently.<br>You can buy-max energy upgrades.",
      done() { return player.r.points.gte(12)},
      unlocked() {return this.done() || hasMilestone("v",0)}
    },
    7: {
      requirementDescription: "[8] 13 rebirths",
      effectDescription: "Keep 3 minirebirths on all resets. Both U-upgrade and P-upgrade autobuyers can buy all currently unlocked upgrades.<br>Also, all B-layer and C-layer upgrades are kept.",
      done() { return player.r.points.gte(13)},
      unlocked() {return this.done() || player.r.points.gte(12) || hasMilestone("v",0)}
    },
  },
  
  resource: "rebirth points",
  baseResource: "points per second",
  baseAmount() {
    if(hasMilestone('v',1)) return player.points
    return getPointGen()
  },
  
  tabFormat: {
    "Rebirths": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "blank",
        "milestones",
        "blank",
        "blank",
        "blank",
        "blank",
        ["raw-html",`<a href="https://rebirth-tree-rewritten.glitch.me" target="_self">This button will redirect you an older version if you have lost your save</a>`,
        "blank",]
      ],
    },
    "Mini Rebirths": {
      embedLayer: "mr",
      unlocked(){return player.r.points.gte(11) || hasAchievement("a",112)},
    },
    "Void": {
      embedLayer: "v",
      unlocked(){return hasAchievement("a",112)},
      buttonStyle: {"border-color":"#FD68FF"},
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
    var mrs = player.mr.points;
    layerDataReset(this.layer);
    if(hasMilestone("r",7) && layers[resettingLayer].row <= 25) player.mr.points = new Decimal(3).min(mrs);
    if(hasUpgrade("v",12)) player.mr.points = mrs;
  },
  resource: "mini rebirths",
  baseAmount() {return player.c.total.add(layers.c.getResetGain())},
  baseResource: "collapse points",
  
  type: "custom",
  requires(){
    let costs = [0,"1e30","1e80","1e100","1e120","1e800","eeeeeeee9"];
    if(player.mr.points.gte(5) && player.r.points.lt(12)) return false
    if(player.mr.points.gte(6)) return false
    return new Decimal(costs[player[this.layer].points]);
  },
  canReset(){
    return this.requires() && (hasUpgrade("v",12) || player.r.points.gte(11)) ? this.baseAmount().gte(this.requires()) : false
  },
  prestigeButtonText(){
    if(!this.requires()) return "The next minirebirth is unobtainable"
    //this.baseAmount().log10().div(this.getNextAt().log10())]
    if(!player.r.points.gte(11) && !hasUpgrade("v",12))return `Lose all previous progress and Mini-Rebirth<br>Mechanic locked until Rebirth 11`
    return `Lose all previous progress and Mini-Rebirth<br>${format(this.baseAmount())}/${format(this.getNextAt())} (${format(this.baseAmount().add(1).log10().div(this.getNextAt().add(1).log10()).mul(100),1)}%) collapse points`
  },
  getNextAt(){return this.requires()},
  getResetGain(){return new Decimal(1)},
  totalEssence(){
    var essence = player.mr.points
    if(player.r.points.gte(13)) essence = essence.add(2)

    essence = essence.add(player.mr.challenges[11])
    essence = essence.add(player.mr.challenges[12])
    essence = essence.add(player.mr.challenges[21])
    
    return essence
  },
  essence(){
    var essence = player.mr.points.sub(player.mr.used)
    if(player.r.points.gte(13)) essence = essence.add(2)

    essence = essence.add(player.mr.challenges[11])
    essence = essence.add(player.mr.challenges[12])
    essence = essence.add(player.mr.challenges[21])
    
    return essence
  },
  
  tabFormat: [
    "main-display",
    "prestige-button",
    "blank",
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
      requirementDescription: "[6] 6 Minirebirths / e800 collapse",
      effectDescription: "Unlock a new Collapse Sacrifice and MR challenge.",
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
        if(player.mr.challenges[11] >= 3) {
          if(player.mr.points.gte(6)) sacrifices = "the first five challenges"
          else sacrifices = " every challenge"
        }

        return `<h2>Eternally Trapped [${player.mr.challenges[11]}/3]</h2><br> You are trapped level 2 of ${sacrifices} (until you exit) and reduces Collapse requirement by /10,000<br>Goal: 1e9 collapse points<br>Reward: Boost sacrifice reward by ^+0.2 per level)`},
      onEnter(){
        if(player.mr.challenges[11] == 0) player.c.sacrifices = [2,0,0,2,0]
        if(player.mr.challenges[11] == 1) player.c.sacrifices = [2,0,2,2,0]
        if(player.mr.challenges[11] == 2) player.c.sacrifices = [2,2,2,2,0]
        if(player.mr.challenges[11] == 3) player.c.sacrifices = [2,2,2,2,2]
      },
      canComplete: function() {return player.c.points.gte(1e6)},
      completionLimit: 3,
      unlocked(){return hasMilestone("mr",2)}
    },
    12: {
      fullDisplay(){return `<h2>Total point breakdown [${player.mr.challenges[12]}/3]</h2><br> Nerf or remove almost every upgrade/milestone in the prestige layer.<br>Goal: ${format(this.goal())} points<br>Reward: Strengthens the first collapse upgrade and passive generation`},
      goal(){return new Decimal([75000,1e200,"1e1200","1e1200"][player.mr.challenges[12]])},
      onEnter(){player.c.sacrifices = [this.difficulty(),this.difficulty(),this.difficulty(),this.difficulty(),this.difficulty()]},
      canComplete: function() {return player.points.gte(this.goal())},
      completionLimit: 3,
      unlocked(){return hasMilestone("mr",2)}
    },
    21: {
      fullDisplay(){return `<h2>Feature Disablation [${player.mr.challenges[21]}/3]</h2><br>You are trapped inside of "A powerful power" once, "Inflated Upgrades" six times, "Antiboosters" ten times, and "Uselessness" once<br>Goal: ${formatWhole(new Decimal(1e10).pow(player.mr.challenges[21]).mul(1e10))} points<br>Reward: ^1.1 points per completion`},
      onEnter(){player.c.sacrifices = [1,6,10,1,0]},
      canComplete: function() {return player.points.gte(new Decimal(1e10).pow(player.mr.challenges[21]).mul(1e10))},
      completionLimit: 3,
      unlocked(){return hasMilestone("mr",3)}
    },
    22: {
      fullDisplay(){return `<h2>Unilayer[${player.mr.challenges[22]>=1 ? "Completed" : "Incomplete"}]</h2><br>Disable every layer except Prestige, Rebirths, and Mini-rebirth. <br>Buffs a Prestige Milestone and Modifies some costs for prestige upgrades.<br>Goal: e2025 prestige<br>Reward: Unlock something new`},
      canComplete: function() {return player.p.points.gte("1e1200")},
      completionLimit: 1,
      unlocked(){return hasMilestone("mr",5)}
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
        return true
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
        return "Gain a static 1,000x point multiplier<br>Cost: 1 Minirebirth Essence"
      },
      tooltip: "This ignores <em>all</em> nerfs and buffs, including from minirebirth challenges.",
      
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
        return "<big>^1.1 points</big><br>Cost: 1 Minirebirth essences"
      },
      
      canAfford(){
        return layers.mr.essence().gte(1) && hasUpgrade("mr",21)
      },
      pay(){
        player.mr.used = player.mr.used.add(1)
      },
      branches: [21],
      unlocked(){return hasMilestone("mr",2)},
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
      unlocked(){return hasMilestone("mr",2)},
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
      unlocked(){return hasMilestone("mr",2)},
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
        return "Strengthen the first (top-left) upgrade in collapse<br>Cost: 1 Minirebirth Essences"
      },
      
      canAfford(){
        return layers.mr.essence().gte(1) && hasUpgrade("mr",42)
      },
      pay(){
        player.mr.used = player.mr.used.add(1)
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
}) 
addLayer("v", {
  color: "#FD68FF",
  row: 26,
  
  startData() { return {
    unlocked: false,
    points: new Decimal(0),
    total: new Decimal(0),
  }},
  resource: "void",
  baseAmount() {return player.r.points},
  baseResource: "rebirths",
  
  type: "custom",
  requires: new Decimal(13),
  getNextAt(){return player.r.points.add(1)},
  prestigeButtonText(){
    if(hasAchievement("a",112)) return `Enter void.<br>This requires ${player.r.points.min(13)}/13 rebirths and Void (Space Upgrade)`
    return `Enter void.`
  },
  canReset(){return hasUpgrade("s",83)},
  getResetGain(){return new Decimal(1)},
  milestones: {
    0: {
      requirementDescription: "[1] 1 Void",
      effectDescription: "Keep all automation-related rebirth milestones. Space and all of it's upgrades (including Upgrade Generator) are always unlocked. Cheapens 'Row 2' in Space.<br>You can also bulk-Rebirth now",
      done() { return player.v.points.gte(1)}
    },
    1: {
      requirementDescription: "[2] 2 Void",
      effectDescription: "Rebirth is based on Points instead of Points/s",
      done() { return player.v.total.gte(2)}
    },
  },

  upgrades: {
    11: {
      fullDisplay(){
        return "<big>^3 prestige points</big><br>Cost: 1 Void"
      },
      cost: new Decimal(1),
    },
    12: {
      fullDisplay(){
        return "<big>Minirebirths stay on Rebirth resets, and Minirebirths are always unlocked</big><br>(also end of content)<br>Cost: 1 Void"
      },
      cost: new Decimal(1),
      unlocked(){return hasUpgrade("v",11)}
    },
  },

  layerShown(){return false},
}) 
//83

addLayer("a", {
  tabFormat: {
    "Achievements": {
      content: [
        ["display-text",
        function() {
          let effect = `Achievements are boosting point gain`
          effect += ` by <strong>x${format(layers.a.achBoost())}</strong>`
          if(hasUpgrade("s",81) || hasUpgrade("s",43))
            effect += `<br>They are also boosting`

          if(hasUpgrade("s",81)) effect += ` Milestone 3`
          if(hasUpgrade("s",43) && hasUpgrade("s",81)) effect += " and"
          if(hasUpgrade("s",43)) effect += ` Boosters`

          if(hasUpgrade("s",81) || hasUpgrade("s",43))
            effect += ` by <strong>^${format(layers.a.achBoost().log(2).min(20))}</strong>`

          return effect

        }],
        "blank",
        "blank",
        "achievements"
      ],
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
      name: "Diamond",
      done() {return player.c.upgrades.length >= 4},
      tooltip: "Buy all 4 collapse upgrades",
    },
    35: {
      name: "Buyout",
      done() {return player.c.upgrades.length >= 6},
      tooltip: "Buy 6 collapse upgrades",
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
      done() {return player.c.upgrades.length >= 10},
      tooltip: "Obtain ten collapse upgrades",
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
      name: "Quadrupled sacrifices",
      done() {return tmp.c.sacAm >= 4 && player.points.gte(1e9)},
      tooltip: "Complete a run with four or more sacrifices",
    },
    47: {
      name: "Getting them all",
      done() {return tmp.c.sacAm >= 5 && player.points.gte(1e11)},
      tooltip: "Complete a run with five or more sacrifices",
    },
    51: {
      name: "Collapse Millionare",
      done() {return player.c.points.gte(1e6)},
      tooltip: "Get 1e6 collapse points",
    },
    52: {
      name: "So many Upgrades",
      done() {return player.c.upgrades.length >= 18},
      tooltip: "Obtain 18 collapse upgrades",
    },
    53: {
      name: "Billionare",
      done() {return player.c.points.gte(1e9)},
      tooltip: "Get 1e9 collapse points",
    },
    54: {
      name: "Hexasacrifices",
      done() {return tmp.c.sacAm >= 6 && player.points.gte(1e11)},
      tooltip: "Complete a run with six or more sacrifices",
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
      done() {return player.points.gte(1e22) && player.u.points.lte(1) && player.u.upgrades.length == 0},
      tooltip: "Obtain 1e22 points or more without resetting in the U layer or buying any upgrades in the U layer",
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
      done() {return player.m.points.gte(6) && player.r.points.gte(10)}, //this requirement is added just in case someone has a v1.5 save and used infinite milestones glitch
      tooltip: "Get 6 milestone points",
    },
    75: {
      name: "A second digit!",
      done() {return player.m.points.gte(10) && player.r.points.gte(10)},
      tooltip: "Get 10 milestone points",
    },
    76: {
      name: "All ten",
      done() {return player.m.points.gte(36) && player.r.points.gte(10)},
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
      name: "Googol^10 Points",
      done() {return player.points.gte(new Decimal("1e1000"))},
      tooltip: "get 1e1,000 points"
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
      name: "Maximum Handicaps.. plus one",
      done() {return tmp.c.sacAm >= 25 && player.points.gte(1e30) && inChallenge("mr",12)},
      tooltip: "Complete a collapse run with all 25 sacrifices inside of Total point breakdown"
    },
    95: {
      name: "New Challenges Await",
      done() {return player.mr.points.gte(5)},
      tooltip: "Get 5 mini rebirths"
    },
    96: {
      name: "Featureless",
      done() {return player.mr.challenges[21] >= 3},
      tooltip: "Beat Feature Disablation three times"
    },
    97: {
      name: "New rebirth!",
      done() {return player.r.points.gte(12)},
      tooltip: "Get to the 12th rebirth"
    },
    101: {
      name: "New minirebirth!",
      done() {return player.mr.points.gte(6)},
      tooltip: "Get to the 6th minirebirth"
    },
    102: {
      name: "One layer beats them all",
      done() {return hasChallenge("mr",22)},
      tooltip: "Beat 'Unilayer' once"
    },
    103: {
      name: "New Layer!",
      done() {return player.s.points.gte(1)},
      tooltip: "Enter Space"
    },
    104: {
      name: "More upgrades",
      done() {return player.u.upgrades.length >= 11},
      tooltip: "Have all U-layer upgrades at once"
    },
    105: {
      name: "How many do you even need",
      done() {return player.u.points.gte(53)},
      tooltip: "Have atleast 53 upgrade points at once"
    },
    106: {
      name: "Layer 3 multi-boosts",
      done() {return hasUpgrade("s",21) && hasUpgrade("s",22)},
      tooltip: "Have both layer-3 Space upgrades at once"
    },
    107: {
      name: "Achievements are useful again",
      done() {return hasUpgrade("s",81)},
      tooltip: "Have both layer-3 Space upgrades at once"
    },
    111: {
      name: "I've ran out of rebirth names",
      done() {return player.r.points.gte(13)},
      tooltip: "Have 13 Rebirths"
    },
    112: {
      name: "What's this?",
      done() {return hasUpgrade("s",83)},
      tooltip: "Unlock Void"
    },
    113: {
      name: "Cleansed",
      done() {return player.v.points.gte(1)},
      tooltip: "Enter Void"
    },
    //hasUpgrade("s",81)
    //hasUpgrade("s",21) && hasUpgrade("s",22);
    //player.u.upgrades.length >= 11
  },
  achBoost(){
    if(hasUpgrade("s",91)) return new Decimal(1.15).pow(player.a.achievements.length).max(1)
    return new Decimal(1.05).pow(player.a.achievements.length-1).max(1)
  },
}) //ACHIEVEMENTS