addLayer("p", {
  symbol: "P",
  color: "#5AECED",
  Gcolor: "repeating-linear-gradient(-45deg, #5AECED, #5AECED 20px, #50E5E6 20px, #50E5E6 40px)",
  row: 0,
  position: 0,
  tooltip(){
    return `<h2>Prestige</h2><br>${formatWhole(player[this.layer].points)} Prestige Points`
  },

  milestonePopups:false,
  passiveGeneration(){
    gain = 0;
    if(hasMilestone("m",2)) gain += 0.1
    if(hasUpgrade("c",41)) gain *= 4
    if(hasMilestone("m",4)) gain *= 5
    if(hasUpgrade("c",52)) gain *= 2
    return gain
  },
  startData() { return {
    unlocked: true,
    points: new Decimal(0),
  }},
  type: "normal",
  requires(){
    if(inChallenge("mr",22)) return new Decimal(10)
    return new Decimal(hasUpgrade("mr",33) ? 1 : 10)
  },
  exponent(){
    let exponent = 0.325;
    if(hasUpgrade("u",32)) exponent+=0.175;
    if(hasUpgrade("p",21)) exponent+=0.5;

    return exponent
  },
  
  resource: "prestige points",
  baseResource: "points",
  baseAmount() {return player.points},
  gainMult() {
    mult = new Decimal(1)
    if (hasUpgrade("p",12)) mult = mult.mul(2)
    if (hasMilestone("p",0) && hasUpgrade("u",11)) mult = mult.mul(6)
    if (hasMilestone("p",4)) mult = mult.mul(10)
    if (hasUpgrade("b",12)) mult = mult.mul(upgradeEffect("b",12))
    if (hasUpgrade("u",41)) mult = mult.mul(4)
                                            
    if (hasUpgrade("c",22)) mult = mult.mul(2)
    if (hasUpgrade("p",22)) mult = mult.mul(upgradeEffect("p",22))

    
    //mult = mult.div(new Decimal(3).pow(player.c.sacrifices[4]))
    return mult
  },
  gainExp() {
    return new Decimal(0.8).pow(player.c.sacrifices[4]).mul(player.e.buyables[22]/10+1).mul(hasUpgrade("v",11)+1)
  },
  
  milestones: {
    0: {
      requirementDescription: "[1] 1 Prestige Point",
      effect(){
        return new Decimal(3)
      },
      effectDescription(){
        if(hasUpgrade("u",11)) return "Start gaining points at +1 points per second<br>Also gain x3 prestige points."
        return "Start gaining points at +1 points per second"
      },
      done() { return player.p.points.gte(1)}
    },
    1: {
      requirementDescription: "[2] 2 Prestige Points",
      effect(){
        let exponentIncrease = 0;
        if(hasUpgrade("p",25)) exponentIncrease += 0.06;

        let effect = player.p.points.pow(0.5 + exponentIncrease); //Base
        if(inChallenge("mr",12)) effect = player.p.points.add(1).log(2).pow(0.8 + exponentIncrease).add(1)

        else if(hasUpgrade("u",12)){
          if(hasUpgrade("c",82)) effect = player.p.points.pow(0.25 + exponentIncrease).add(1)
          else effect = player.p.points.add(1).log(2).pow(1.15 + exponentIncrease).add(2)
        }
        
        if(hasUpgrade("p",23)) effect = effect.pow(upgradeEffect("p",23))
        
        let softcap = 1;
        if(hasUpgrade("p",25)) softcap *= 3;

        //Apply softcaps
        if(effect.gte("1e2500")) effect = effect.div("1e2500").log(1.1).pow(100).mul("1e2500")
        else if(effect.gte("1e20") && !hasUpgrade("u",12) && !inChallenge("mr",22)) effect = effect.div("1e20").pow(0.1*softcap).add(1).mul("1e20")
        else if(effect.gte("1e500")) effect = effect.div("1e500").pow(0.15*softcap).add(1).mul("1e500")

        return effect
      },
      effectDescription(){
        if(hasUpgrade("u",12)) return "Multiply point gain based on prestige points<br>Currently: x" + format(this.effect()) + " point gain"
        return "Increase point gain based on prestige points<br>Currently: +" + format(this.effect()) + " point gain"
      },
      tooltip(){
        let tooltip = "P<sup>0.5</sup>";
        if(inChallenge("mr",12)) tooltip = "1+log<sub>2</sub>(P)<sup>0.8</sup>"
        else if(hasUpgrade("c",82) && hasUpgrade("u",12)) tooltip = "P<sup>0.25</sup>+1";
        else if(hasUpgrade("u",12)) tooltip = "(log<sub>2</sub>(P)<sup>1.15</sup>+2)"

        if(hasUpgrade("p",25)) tooltip += `<br>Exponent increased by 0.202 (Upgrade P25)`
        if(hasUpgrade("p",23)) tooltip += `<br>^${upgradeEffect("p",23)} (Upgrade P23)`

        if(this.effect().gte("1e2500")){
          tooltip += `<br>Softcapped (x => log<sub>1.1</sub>(x)<sup>100</sup>) past 1e2,500`
        }
        else if(this.effect().gte("1e20") && !hasUpgrade("u",12)){
          if(hasUpgrade("p",25)) tooltip += `<br>Softcapped by ^0.3 past 1e20 effect. (strengthened without 'Milestone 2+', weakened by P25)`
          else tooltip += `<br>Softcapped by ^0.1 past 1e20 effect. (strengthened without 'Milestone 2+')`
        }
        else if(this.effect().gte("1e500")){
          if(hasUpgrade("p",25)) tooltip += `<br>Softcapped by ^0.45 past 1e500 effect. (weakened by P25)`
          else tooltip += `<br>Softcapped by ^0.15 past 1e500 effect.`
        }

        return tooltip
      },
      done() { return player.p.points.gte(2)}
    },
    2: {
      requirementDescription: "[3] 4 Prestige Points",
      effect(){
        if(inChallenge("mr",12)) return new Decimal(0)

        if(hasUpgrade("s",81)) return new Decimal(1.3).pow(player.r.points).mul(10).tetrate(2).pow(layers.a.achBoost().log(2).min(20))

        if(hasMilestone("m",11)) return new Decimal(1.3).pow(player.r.points).mul(10).tetrate(2)
        if(hasUpgrade("c",82) && hasUpgrade("u",21)) return new Decimal(1.8).pow(player.r.points).pow(5)
        if(hasUpgrade("u",21) && hasMilestone("m",4)) return new Decimal(1.4).pow(player.r.points).add(player.r.points).sub(2).pow(4)
        if(hasUpgrade("u",21)) return player.r.points.pow(4)
        return player.r.points.pow(2.5)
      },
      tooltip(){
        if(inChallenge("mr",12)) return "Effect is disabled."
        if(hasMilestone("m",11)) return "(10(1.3^RP))^^2"
        if(hasMilestone("c",82) && hasUpgrade("u",21)) return "1.8^5RP"
        if(hasUpgrade("u",21) && hasMilestone("m",4)) return "(1.4<sup>RP</sup>+RP-2)<sup>4</sup>"
        if(hasUpgrade("u",21)) return "RP<sup>4</sup>"

        return "RP<sup>2.5</sup>"
      },
      effectDescription(){
        if(inChallenge("mr",12)) return "<s>Increase point gain based on rebirth points</s><br>Deleted by a Minirebirth Challenge"
        return "Increase point gain based on rebirth points<br>Currently: +" + format(this.effect()) + " point gain"
      },
      done() { return player.p.points.gte(4) && player.r.points.gte(2)},
      unlocked() {return player.r.points.gte(2)}
    },
    3: { 
      requirementDescription(){
        return hasUpgrade("u",22) ? "[4] 100 Prestige Points" : "[4] 20 Prestige Points"
      },
      effect(){
        let upgradeUnlocks = 3;
        if(hasUpgrade("u",22)) upgradeUnlocks+=2;
        if(hasUpgrade("u",51)) upgradeUnlocks+=3;
        if(inChallenge("mr",22)) upgradeUnlocks+=7;
        if(hasUpgrade("mr",12)) upgradeUnlocks-=2;
        if(inChallenge("mr",12)) upgradeUnlocks-=2;
        if(hasMilestone("m",12)) upgradeUnlocks++;
        if(hasMilestone("m",12)) upgradeUnlocks++;

        return hasMilestone("p",3) && this.unlocked() ? upgradeUnlocks : 0
      },
      effectDescription(){
        let upgradeUnlocks = 3;
        if(hasUpgrade("u",22)) upgradeUnlocks+=2;
        if(hasUpgrade("u",51)) upgradeUnlocks+=3;
        if(inChallenge("mr",22)) upgradeUnlocks+=7;
        if(hasUpgrade("mr",12)) upgradeUnlocks-=2;
        if(inChallenge("mr",12)) upgradeUnlocks-=2;
        if(hasMilestone("m",12)) upgradeUnlocks++;
        if(hasMilestone("m",12)) upgradeUnlocks++;

        return `Unlock ${upgradeUnlocks} Upgrades`
      },
      tooltip(){
        let tooltip = "3 (base)";

        if(hasUpgrade("u",22)) tooltip+="<br>+2 (Milestone 4+)";
        if(hasUpgrade("u",51)) tooltip+="<br>+3 (Milestone 4++)";
        if(inChallenge("mr",22)) tooltip+="<br>+7 (Minirebirth Challenge)";
        if(hasMilestone("m",12)) tooltip+="<br>+1 (Milestone 13)";
        if(hasMilestone("m",13)) tooltip+="<br>+1 (Milestone 14)";
        if(hasUpgrade("mr",12)) tooltip+="<br>-2 (Minirebirth Upgrade)";
        if(inChallenge("mr",12)) tooltip+="<br>-2 (Minirebirth challenge)";

        return tooltip
      },
      done() { return player.p.points.gte(hasUpgrade("u",22) ? 100 : 20) && player.r.points.gte(2)},
      unlocked() {return player.r.points.gte(2)}
    },
    4: { 
      requirementDescription: "[5] 250 Prestige points",
      effectDescription: "10x Prestige Point gain",
      done() { return player.p.points.gte(250) && hasUpgrade("u",31)},
      unlocked() {return hasUpgrade("u",31)}
    },
    5: { 
      requirementDescription: "[6] 1,500 Prestige Points",
      effectDescription: "Unlock a new layer. [B] This will be kept in row 2 resets, even without Milestone+",
      done() { return player.p.points.gte(1500) && hasUpgrade("u",31)},
      unlocked() {return hasUpgrade("u",31) || hasMilestone("p",5)}
    },
  },
  upgrades: {
    11: {
      title: "[11] Point Boost",
      description(){
        return player.c.sacrifices[3] ? "<s>x1.5 point gain</s>" : "x1.5 point gain"
      },
      cost: new Decimal(15),
      unlocked(){return milestoneEffect("p",3) >= 1},
    },
    12: {
      title: "[12] Prestige Boost",
      description: "x2 prestige point gain",
      cost: new Decimal(15),
      unlocked(){return milestoneEffect("p",3) >= 2},
    },
    13: {
      title: "[13] Self-Synergy",
      description(){
        return player.c.sacrifices[3] ? "<s>Points will slightly boost themselves.</s>" : "Points will slightly boost themselves."
      },
      cost: new Decimal(30),
      effect(){
        if(player.c.sacrifices[3]) return new Decimal(1);

        var addedEffect = 1;
        if(hasUpgrade("p",24)) addedEffect+=0.2;
        if(hasUpgrade("u",52)) addedEffect+=0.2;
        addedEffect*=1+(player.e.buyables[11]*0.04);

        let effect = player.points.add(1).log(10).pow(addedEffect).add(1);

        if(hasMilestone("m",10)) effect = player.points.add(1).pow(0.05 * addedEffect).add(1)
        else if(hasUpgrade("c",12)) effect = player.points.add(1).log(10).pow(1.25*addedEffect).add(1)

        if(effect.gte("1e500")) effect = effect.div("1e500").log(10).pow(4).mul("1e500")

        return effect;
      },
      effectDisplay(){
        return "x" + format(this.effect());
      },
      tooltip(){
        if(hasMilestone("m",10)) return "(p+1)^0.05+2"
        if(hasUpgrade("c",12)) return "log(p+1)^1.25+1"
        return "log(p+1)+1"
      },
      unlocked(){return milestoneEffect("p",3) >= 3},
    },
    14: {
      title: "[14] Duplication",
      description(){
        return hasUpgrade("p",24) ? "x20 point gain" : "x2 point gain"
      },
      tooltip(){
        if(hasUpgrade("p",24)) return `(increased from x2 => x20 by P24)`
      },
      effect(){
        if(hasUpgrade("u",24)) return 20
        return 2
      },
      cost: new Decimal(55),
      unlocked(){return milestoneEffect("p",3) >= 4},
    },
    15: {
      title: "[15] Scaling boost",
      description(){
        return `Multiplies point gain based on Rebirth Points<br>Currently: x${formatWhole(this.effect())}`
      },
      tooltip(){
        if(hasUpgrade("p",24)) return `3<sup>r</sup>`
        return `2<sup>r-1</sup>`
      },
      effect(){
        if(hasUpgrade("u",24)) return new Decimal(3).pow(player.r.points)
        return new Decimal(2).pow(player.r.points.sub(1))
      },
      cost: new Decimal(250),
      unlocked(){return milestoneEffect("p",3) >= 5},
    },
    21: {
      title: "[21] Skyrocket",
      description: "Increase prestige point gain formula",
      tooltip(){
        if(hasUpgrade("p",24)) return "Adds an exponent of 0.3(+0.2 by P24)<br>(p^0.325 => p^0.825, or p if you have Prestige+)"
        return "Adds an exponent of 0.3<br>(p^0.325 => p^0.625, or p^0.8 if you have Prestige+)"
      },
      effect(){
        if(hasUpgrade("p",24)) return new Decimal(0.5)
        return new Decimal(0.3)
      },
      cost(){return inChallenge("mr",22) ? new Decimal("25000") : new Decimal("1e850")},
      unlocked(){return milestoneEffect("p",3) >= 6},
    },
    22: {
      title: "[22] Prestige Self Synergy",
      description: "Prestige points boost themselves",
      tooltip(){
        let effect = `pp<sup>0.15`
        
        if(hasUpgrade("p",24)) effect += `  +0.05(P24)`
        if(inChallenge("mr",22)) effect += `  +0.2(MR Challenge)`

        if(this.effect().gte("1e700")) return `${effect}</sup>+1<br>Softcapped by ^0.5 past e500`
        return `${effect}</sup>+1`
      },
      effect(){
        let power = 0.15
        if(hasUpgrade("u",24)) power += 0.05
        if(inChallenge("mr",22)) power += 0.2

        let effect = player.p.points.pow(power).add(1)
        if(effect.gte("1e500")) effect = effect.div("1e500").pow(0.5).mul("1e500")
        return effect
      },
      effectDisplay(){return `x${format(this.effect())}`},

      cost(){return inChallenge("mr",22) ? new Decimal("1e12") : new Decimal("1e950")},
      unlocked(){return milestoneEffect("p",3) >= 7},
    },
    23: {
      title: "[23] Boost the second",
      description: "Prestige Milestone 2 is stronger",
      tooltip(){
        if(hasUpgrade("p",24)) return "^1.5  +0.5 (Upgrade P24)"
        return `^1.5`
      },
      effect(){
        if(hasUpgrade("p",24)) return 2
        return 1.5
      },

      cost(){return inChallenge("mr",22) ? new Decimal("1e40") : new Decimal("1e1250")},
      unlocked(){return milestoneEffect("p",3) >= 8},
    },
    24: {
      title: "[24] Superboost",
      description: "Boosts every prestige upgrade except the first two",

      cost(){return inChallenge("mr",22) ? new Decimal("1e500") : new Decimal("1e1650")},
      unlocked(){return milestoneEffect("p",3) >= 9},
    },
    25: {
      title: "[25] Boost the second 2",
      description: "Heavily boost Milestone 2",

      cost(){return inChallenge("mr",22) ? new Decimal("1e1000") : new Decimal("1e2500")},
      unlocked(){return milestoneEffect("p",3) >= 10},
    },
    31: {
      title: "[31]",
      description: "Not implemented yet..",

      cost(){return new Decimal(Infinity)},
      unlocked(){return milestoneEffect("p",3) >= 11},
    },
    32: {
      title: "[32]",
      description: "Not implemented yet..",

      cost(){return new Decimal(Infinity)},
      unlocked(){return milestoneEffect("p",3) >= 12},
    },
    33: {
      title: "[33]",
      description: "Not implemented yet..",

      cost(){return new Decimal(Infinity)},
      unlocked(){return milestoneEffect("p",3) >= 13},
    },
    91: {
      title: "[-11] Corruption",
      description: "Nerf point gain by /1.",
      cost: new Decimal(0),
      unlocked(){return milestoneEffect("p",3) <= -1},
    },
  },
  automate(){
    if(hasUpgrade("c",42)){
      if(!hasUpgrade("p",11) && player.p.points.gte(10) && layers.p.upgrades[11].unlocked()) player.p.upgrades.push(11)
      if(!hasUpgrade("p",12) && player.p.points.gte(20) && layers.p.upgrades[12].unlocked()) player.p.upgrades.push(12)
      if(!hasUpgrade("p",13) && player.p.points.gte(30) && layers.p.upgrades[13].unlocked()) player.p.upgrades.push(13)
      if(!hasUpgrade("p",14) && player.p.points.gte(55) && layers.p.upgrades[14].unlocked()) player.p.upgrades.push(14)
      if(!hasUpgrade("p",15) && player.p.points.gte(250) && layers.p.upgrades[15].unlocked()) player.p.upgrades.push(15)
    }
    if(hasMilestone("r",7)){
      if(!hasUpgrade("p",21) && player.p.points.gte(layers.p.upgrades[21].cost()) && layers.p.upgrades[21].unlocked()) player.p.upgrades.push(21)
      if(!hasUpgrade("p",22) && player.p.points.gte(layers.p.upgrades[22].cost()) && layers.p.upgrades[22].unlocked()) player.p.upgrades.push(22)
      if(!hasUpgrade("p",23) && player.p.points.gte(layers.p.upgrades[23].cost()) && layers.p.upgrades[23].unlocked()) player.p.upgrades.push(23)
      if(!hasUpgrade("p",24) && player.p.points.gte(layers.p.upgrades[24].cost()) && layers.p.upgrades[24].unlocked()) player.p.upgrades.push(24)
      if(!hasUpgrade("p",25) && player.p.points.gte(layers.p.upgrades[25].cost()) && layers.p.upgrades[25].unlocked()) player.p.upgrades.push(25)
    }
  },
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;
    let keptMilestone = [], resistedMilestone = [
      [1,5,"p", 5],
      [1,2,"m", 0],
      [1,3,"m", 1],
    ], keptUpgrade = [], resistedUpgrade = [
      //none
    ], keptChallenge = [], resistedChallenge = [
      //none
    ]

    for(let i = 0; i < resistedMilestone.length; i++)
      if (layers[resettingLayer].row == resistedMilestone[i][0] && hasMilestone(resistedMilestone[i][2],resistedMilestone[i][3]))
        keptMilestone.push(resistedMilestone[i][1]);

    for(let i = 0; i < resistedUpgrade.length; i++)
      if (layers[resettingLayer].row == resistedUpgrade[i][0] && hasMilestone(resistedUpgrade[i][2],resistedUpgrade[i][3]) && hasUpgrade(this.layer,resistedUpgrade[i][1]))
        keptUpgrade.push(resistedUpgrade[i][1]);

    for(let i = 0; i < resistedChallenge.length; i++)
      if (layers[resettingLayer].row == resistedChallenge[i][0] && hasMilestone(resistedChallenge[i][2],resistedChallenge[i][3]) && hasChallenge(this.layer,resistedChallenge[i][1]))
        keptChallenge.push(resistedChallenge[i][1]);

    layerDataReset(this.layer);
    if(hasUpgrade("c",33) && layers[resettingLayer].row <= 2) player.p.milestones.push(5)
    for(let i = 0; i < keptMilestone.length; i++) player[this.layer].milestones.push(keptMilestone[i]);
    for(let i = 0; i < keptUpgrade.length; i++) player[this.layer].upgrades.push(keptUpgrade[i]);
    for(let i = 0; i < keptChallenge.length; i++) player[this.layer].challenges[keptChallenge[i]] = resistedChallenge[i][4];
  },
  
  hotkeys: [
    {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  layerShown(){return player.r.points.gte(1)}
}) //Prestige
addLayer("u", {
  symbol: "U",
  color: "#FFF78E",
  Gcolor: "repeating-linear-gradient(-45deg, #FFF78E, #FFF78E 20px, #F8F085 20px, #F8F085 40px)",
  row: 1,
  position: 0,
  tooltip(){
    return `<h2>Upgrades</h2><br>${format(player[this.layer].points,1)} Upgrade Points`
  },
  
  resetsNothing(){return hasUpgrade("c",111)},
  shouldNotify(){return this.canReset()},
  
  startData() { return {
    unlocked: true,
    used: new Decimal(0),
    points: new Decimal(0),
  }},
  type: "custom",
  
  autoPrestige(){return player.u.autoUpgrade && hasMilestone("r",4) && !inChallenge("mr",22)},
  
  resource: "upgrade points",
  baseResource: "points",
  baseAmount() {return player.points},
  getNextAt(){
    let costs = [500,1500,5000,25000,500000,2500000,1e9,"eeeee9","eeeee9","eeeee9","eeeee9"]
    if(hasUpgrade("mr",42)) costs = [10,150,750,2500,7500,25000,1e7,1e9,1e15,"eeeee9","eeeee9"]

    let c = new Decimal(costs[player[this.layer].points.add(player.c.sacrifices[1]).floor()])
    if(c.eq("eeeee9") || c.eq('0')) return false
    
    if(hasUpgrade("mr",52)) c = c.pow(0.55)
    if(player.c.sacrifices[1] > 0) return c.pow(player.c.sacrifices[1]/2.25+1)
    return c
  },
  getResetGain(){return new Decimal(1)},
  canReset(){return this.getNextAt() && player.points.gte(this.getNextAt())},
  prestigeButtonText(){
    if(!this.getNextAt()) return "You have the maximum amount of Upgrade Points."
    return "Reset previous progress for an upgrade point.<br>Requirement: " + formatWhole(this.getNextAt().ceil()) + " points."
  },
  
  automate(){
    if(player.u.autoUUpgrade && hasMilestone("mr",0) && player.u.points.sub(player.u.used).gte(1)){
      let order = [21,12,32,42,22,41,11]
      if(hasMilestone("r",7)) order = [61,21,12,32,42,51,22,41,11,52,31]
      for(let i = 0; i < order.length; i++){
          if(!hasUpgrade("u",order[i]) && tmp.u.upgrades[order[i]].canAfford) {
            player.u.upgrades.push(order[i]);
            layers.u.upgrades[order[i]].pay()
            break;
          }
      }
    }
  },
  
  clickables: {
    11: {
      display() {return "Respec all upgrades"},
      tooltip(){return player.r.points.gte(12) ? "This will refund all upgrades without restting anything else" : "This will refund all upgrades and force an upgrade reset"},
      onClick() {
        doReset("u",true)
        player.p.milestones = player.p.milestones.filter(item => item != 4);
        player.p.upgrades = [];
        player.u.upgrades = []
        player.u.used = new Decimal(0)
      },
      canClick() {return player.u.used.gte(1)}
    }
  },
  upgrades: {
    11: {
      fullDisplay(){
        return "<h2>Milestone 1+</h2><br>Milestone 1 also boosts prestige gain by 3x<br>Costs 1 upgrade point"
      },
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){return player.u.points.gt(player.u.used)},
      pay(){player.u.used = player.u.used.add(1)},
    },
    12: {
      fullDisplay(){
        return "<h2>Milestone 2+</h2><br>Milestone 2's formula is changed and it multiplies point gain.<br>Costs 1 upgrade point"
      },
      tooltip: "<em>PP^0.4</em> => <em>log1.5(PP+1)^0.8+2</em>",
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){
        if(player.c.sacrifices[3]) return false
        return player.u.points.gt(player.u.used)
      },
      pay(){player.u.used = player.u.used.add(1)},
    },
    21: {
      fullDisplay(){
        return "<h2>Milestone 3+</h2><br>Milestone 3's formula is better<br>Costs 1 upgrade point"
      },
      tooltip: "RP<sup>^2.5</sup> => RP<sup>4</sup>",
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){return player.u.points.gt(player.u.used)},
      pay(){player.u.used = player.u.used.add(1)},
    },
    22: {
      fullDisplay(){
        return "<h2>Milestone 4+</h2><br>Milestone 4 is harder to get but unlocks 2 more upgrades<br>Costs 1 upgrade point"
      },
      tooltip: "requirement 25 => 80",
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){
        if(player.c.sacrifices[3]) return false
        return player.u.points.gt(player.u.used)
      },
      pay(){player.u.used = player.u.used.add(1)},
    },
    31: {
      fullDisplay(){
        return "<h2>Milestone+</h2><br>Unlock 2 new milestones<br>Costs 2 upgrade point"
      },
      tooltip: "They require 250 and 750 prestige points.",
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){return player.u.points.gt(player.u.used.add(1))},
      pay(){player.u.used = player.u.used.add(2)},
      unlocked(){return player.r.points.gte(4)}
    },
    32: {
      fullDisplay(){
        return "<h2>Prestige+</h2><br>Prestige formula is improved<br>Costs 1 upgrade point"
      },
      tooltip: "+0.15 exponent (P<sup>0.35</sup> => P<sup>0.5</sup>)",
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){return player.u.points.gt(player.u.used) && this.unlocked()},
      pay(){player.u.used = player.u.used.add(1)},
      unlocked(){return player.r.points.gte(4)}
    },
    41: {
      fullDisplay(){
        return "<h2>Prestige Boost</h2><br>4x prestige point boost<br>Costs 1 upgrade point"
      },
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){
        return player.u.points.gt(player.u.used) && this.unlocked()
      },
      pay(){player.u.used = player.u.used.add(1)},
      unlocked(){return hasMilestone("m", 3)}
    },
    42: {
      fullDisplay(){
        return "<h2>Point Boost</h2><br>6x point boost<br>Costs 1 upgrade point"
      },
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){
        if(player.c.sacrifices[3]) return false
        return player.u.points.gt(player.u.used) && this.unlocked()
      },
      pay(){player.u.used = player.u.used.add(1)},
      unlocked(){return hasMilestone("m", 3)}
    },
    51: {
      fullDisplay(){
        return "<h2>Milestone 4++</h2><br>Milestone 4 unlocks 3 new upgrades<br>Costs 4 upgrade points"
      },
      tooltip: "This stacks onto Milestone 4+.",

      style:{"width":"220px","border-radius":"8px"},
      canAfford(){
        return player.u.points.gt(player.u.used.add(3))
      },
      pay(){player.u.used = player.u.used.add(4)},
      unlocked(){return player.r.points.gte(12)}
    },
    52: {
      fullDisplay(){
        return "<h2>Self Synergy+</h2><br>'Self Synergy' is significantly stronger<br>Costs 4 upgrade points"
      },
      tooltip: "~^3 stronger",
      
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){
        return player.u.points.gt(player.u.used.add(3))
      },
      pay(){player.u.used = player.u.used.add(4)},
      unlocked(){return player.r.points.gte(12)}
    },
    61: {
      fullDisplay(){
        return "<h2>Row 3+</h2><br>'Row 3 Booster' (B layer) is significantly stronger<br>Costs 4 upgrade points"
      },
      
      style:{"width":"220px","border-radius":"8px"},
      canAfford(){
        return player.u.points.gt(player.u.used.add(3))
      },
      pay(){player.u.used = player.u.used.add(4)},
      unlocked(){return player.r.points.gte(12)}
    },
  },

  update(diff){
    if(player.s.buyables[11].eq(0)) return;
    let gain = layers.s.buyables[11].effect().mul(diff);

    player.u.points = player.u.points.add(gain)
  },
  
  hotkeys: [
    {key: "u", description: "U: Reset for upgrade points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  layerShown(){return player.r.points.gte(3) && !inChallenge("mr",22)},
  branches:["p"],
  deactivated(){return inChallenge("mr",22)},
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;

    layerDataReset(this.layer);
    let value2 = player.u.upgrades
    player.p.upgrades = player.p.upgrades.filter(value2 => value2 !== 14 && value2 !== 15)

    if(hasMilestone("r",0)) player.u.points = new Decimal(1);
  },
}) //Upgrades
addLayer("b", {
  symbol: "B",
  color: "#5A7AED",
  Gcolor: "repeating-linear-gradient(-45deg, #5A7AED, #5A7AED 20px, #5675E9 20px, #5675E9 40px)",
  row: 1,
  position: 2,
  tooltip(){
    return `<h2>Boosters</h2><br>${formatWhole(player[this.layer].points)} Boosters`
  },
  
  resetsNothing(){return hasUpgrade("c",112)},
  autoPrestige(){return player.b.autoBooster && hasMilestone("r",5) && !inChallenge("mr",22) && layers.b.layerShown == true},
  
  shouldNotify(){return false},
  startData() { return {
    unlocked: true,
    points: new Decimal(0),
  }},
  type: "static",
  requires(){
    return hasUpgrade("c",51) ? 300 : 750 
  },
  exponent(){
    var exponent = 1.45
    if(hasUpgrade("c",51)) exponent -= 0.15
    if(hasMilestone("m",8)) exponent -= 0.06

    exponent -= player.e.buyables[32]/35
    if(hasUpgrade("s",53)) exponent = (exponent-1)/10+1

    return exponent
  },
  base(){
    return hasUpgrade("c",51) ? 2.5 : 4
  },
  softcap: new Decimal(1e5),
  softcapPower: new Decimal(0.15),
  canBuyMax(){return hasUpgrade("c",121)},
  
  resource: "booster points",
  baseResource: "prestige points",
  baseAmount() {return player.p.points},
  gainMult() {
    mult = new Decimal(1)
    return mult
  },
  gainExp() {
    if(hasUpgrade("s",43)) return layers.a.achBoost().log(2).min(20)
    return new Decimal(1)
  },
  
  upgrades: {
    11: {
      effect(){
        let points = player.b.points.pow(1.2);
        if(hasMilestone("m",8)) points = points.mul(1.125)
        if(hasUpgrade("c",132)) points = points.mul(1.125)
        
        if(hasUpgrade("c",71)) points = points.mul(1.5)
        if(player.c.sacrifices[2] > 0) points = points.div(3 ** player.c.sacrifices[2])
        if(player.b.points.gte(1)) points = points.add(0.5)
        
        let power = new Decimal(1.5).add(player.b.points.add(1).log(100).div(20))
        if(hasUpgrade("s",53)) power = player.b.points.pow(0.5).add(1)
        else if(hasUpgrade("c",132)) power = new Decimal(3).add(player.b.points.add(1).log(1.5)).pow(1.05)
        else if(hasUpgrade("c",71)) power = new Decimal(2.5).add(player.b.points.add(1).log(50))

        return points.pow(power).add(1)
      },
      tooltip(){
        var pointsMul = 1

        if(hasMilestone("m",8)) pointsMul *= 1.125
        if(hasUpgrade("c",132)) pointsMul *= 1.125
        
        if(hasUpgrade("c",71)) pointsMul *= 1.5
        if(player.c.sacrifices[2] > 0) pointsMul /= (3 ** player.c.sacrifices[2])

        if(hasUpgrade("s",53)) return `${format(pointsMul,1)}b<sup>1.2b<sup>0.5</sup></sup>+0.5`
        var points = `${format(pointsMul,1)}b<sup>1.2</sup>+0.5`

        var power = "";
        power = "2+(log100(B+1))"
        if(hasUpgrade("c",132)) power = "(3+log1.5(B+1))<sup>1.05</sup>"
        else if(hasUpgrade("c",71)) power = "2.5+log50(B+1)"

        return `${points}<br>Raised to the power of<br>${power}`
      },
      fullDisplay(){return "<strong>Point Booster<strong><br>" + format(this.effect()) + "x point gain<br> Toggle with '1'"},
      onPurchase(){if(!hasUpgrade("c",122)) player.b.upgrades = [11]},
      unlocked(){return player.b.points.gte(1)},
    },
    12: {
      effect(){
        let points = player.b.points.div(1.3).pow(1.2);
        if(hasMilestone("m",8)) points = points.mul(1.125)
        if(hasUpgrade("c",132)) points = points.mul(1.125)
        if(hasUpgrade("s",53)) points = points.mul(4)
        
        if(hasUpgrade("c",71)) points = points.mul(1.5)
        if(player.c.sacrifices[2] > 0) points = points.div(3 ** player.c.sacrifices[2])
        if(player.b.points.gt(0)) points = points.add(0.55)
        
        let power = new Decimal(2).add(player.b.points.add(1).log(2).div(20))
        if(hasUpgrade("s",53)) power = player.b.points.pow(0.4)
        else if(hasUpgrade("c",132)) power = new Decimal(3).add(player.b.points.add(1).log(2).div(10)).pow(1.05)
        else if(hasUpgrade("c",71)) power = new Decimal(2.4).add(player.b.points.add(1).log(2).div(10))
        return points.pow(power).add(1)
      },
      tooltip(){
        var pointsMul = 1/1.3
  
        if(hasMilestone("m",8)) pointsMul *= 1.125
        if(hasUpgrade("c",132)) pointsMul *= 1.125
        
        if(hasUpgrade("c",71)) pointsMul *= 1.5
        if(hasUpgrade("s",53)) pointsMul *= 4
        if(player.c.sacrifices[2] > 0) pointsMul /= (3 ** player.c.sacrifices[2])
  
        if(hasUpgrade("s",53)) return `${format(pointsMul,1)}b<sup>1.2b<sup>0.55</sup></sup>+0.5`
        var points = `${format(pointsMul,1)}b<sup>1.2</sup>+0.5`
  
        var power = "2+(log2(B+1)/20)"
        if(hasUpgrade("c",132)) power = "(3+(log2(B+1)/10))<sup>1.05</sup>"
        else if(hasUpgrade("c",71)) power = "2.4+(log2(B+1)/10)"
  
        return `${points}<br>Raised to the power of<br>${power}.`
      },
      fullDisplay(){return "<strong>Prestige Booster<strong><br>" + format(this.effect()) + "x prestige gain<br> Toggle with '2'"},
      onPurchase(){if(!hasUpgrade("c",122)) player.b.upgrades = [12]},
      unlocked(){return player.b.points.gte(1)},
    },
    13: {
      effect(){
        if(player.b.points.lte(0)) return new Decimal(1)

        let points = player.b.points.pow(1.2);
        if(hasUpgrade("u",61)) points = points.pow(3)
        if(player.b.points.gte(1)) points = points.add(1)
        if(player.c.sacrifices[2] > 0) points = points.div(1.5 ** player.c.sacrifices[2])
        if(points.isNan()) points = new Decimal(1)

        let power = player.b.points.add(1).log(100).add(1).mul(2)
        if(hasUpgrade("c",132)) power = power.pow(1.25)
        if(hasUpgrade("u",61)) power = power.mul(6)
        if(power.isNan()) power = new Decimal(1)

        if(points.log(2).pow(power).add(1).max(1).isNan()) return new Decimal(1)
        return points.log(2).pow(power).add(1).max(1)
      },
      tooltip(){
        var pointsMul = 1
        if(hasMilestone("m",8)) pointsMul *= 1.125
        if(hasUpgrade("c",142)) pointsMul *= 1.125
        
        if(hasUpgrade("c",71)) pointsMul *= 1.5
        if(player.c.sacrifices[2] > 0) pointsMul /= (2 ** player.c.sacrifices[2])
  
        var power = 1.3
        if(hasUpgrade("u",61)) power *= 3;

        var points = `1+${format(pointsMul)}(b<sup>${format(power,1)}</sup>)`
        
        var mult = 2
        if(hasUpgrade("u",61)) mult *= 6;
        var power = mult += "(log<sub>100</sub>(B+1)/20)"
        if(hasUpgrade("c",132)) power += "<sup>1.25</sup>"
  
        return `log<sub>2</sub>(${points})<br>Raised to the power of<br>${power}.`
      },
      fullDisplay(){return "<strong>Row 3 Booster<strong><br>" + format(this.effect()) + "x more of all row 3 currencies<br> Toggle with '3'"},
      onPurchase(){if(!hasUpgrade("c",122)) player.b.upgrades = [13]},
      unlocked(){return player.r.points.gte(12)},
    },
  },
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;
    let upg = player.b.upgrades
    
    layerDataReset("b")
    if(hasUpgrade("c",33) && layers[resettingLayer].row <= 2) player.p.milestones.push(5)
    if(layers[resettingLayer].row <= 2 || hasMilestone("r",7)) player.b.upgrades = upg
  },
  
  hotkeys: [
    {key: "b", description: "B: Get a booster point", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    {key: "1", onPress(){if(layers.b.upgrades[11].unlocked()){player.b.upgrades.push("11");layers.b.upgrades[11].onPurchase()}}},
    {key: "2", onPress(){if(layers.b.upgrades[12].unlocked()){player.b.upgrades.push("12");layers.b.upgrades[12].onPurchase()}}},
    {key: "3", onPress(){if(layers.b.upgrades[13].unlocked()){player.b.upgrades.push("13");layers.b.upgrades[13].onPurchase()}}},
  ],
  
  deactivated(){return inChallenge("mr",22)},
  layerShown(){
    if(hasMilestone("p",5) && !inChallenge("mr",22)) return true
    return player.r.points.gte(6) ? "ghost" : false
  },
  branches: ["p"],

  tabFormat: {
    "Boosters": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        ["upgrades",[1]]
      ],
    },
  },
}) //Boosters
addLayer("m", {
  symbol: "M",
  color: "#A65AED",
  Gcolor: "repeating-linear-gradient(-45deg, #A65AED, #A65AED 20px, #A054E7 20px, #A054E7 40px)",
  row: 1,
  position: 1,
  tooltip(){
    return `<h2>Milestones</h2><br>${formatWhole(player[this.layer].points)} Milestones`
  },

  milestonePopups: false,
  resetsNothing(){return hasUpgrade("c",141)},
  shouldNotify(){return this.canReset()},
  
  startData() { return {
    unlocked: true,
    points: new Decimal(0),
  }},
  autoPrestige(){return player.m.autoReset && hasMilestone("mr",1) && !inChallenge("mr",22)},
  type: "custom",
  
  resource: "milestone points",
  baseResource: "points",
  baseAmount() {return player.points},
  getNextAt(){
    if(player[this.layer].points.gte(5)) {
      if(player.r.points.gte(10)){
        let req;
        if(player.m.points.gte(150)) req = new Decimal(3).add(player.m.points.div(8).pow(player.m.points.div(150).sub(0.93))).pow(player.m.points.mul(player.m.points.add(1)).div(4))
        else req = new Decimal(3).add(player.m.points.div(15)).pow(player.m.points.mul(player.m.points.add(1)).div(3.5)).mul(10)
        //else req = new Decimal(3).pow(player.m.points.mul(player.m.points.add(1)).div(3.5)).mul(10)

        if(hasUpgrade("mr",33)) req = req.pow(0.5)
        if(hasUpgrade("s",52)) req = req.pow(0.2)
        if(player.c.sacrifices[5]) req = req.pow(new Decimal(2).pow(player.c.sacrifices[5]))

        return req
      }
      return false
    }
    let costs = [5,1000000,25000000,250000000,1e10,"eeeee9"]
    let c = new Decimal(costs[player[this.layer].points])
    if(player.c.sacrifices[5]) c = c.pow(new Decimal(2).pow(player.c.sacrifices[5]))
    return c
  },
  getResetGain(){return new Decimal(1)},
  canReset(){return this.getNextAt() && player.points.gte(this.getNextAt())},
  prestigeButtonText(){
    if(!this.getNextAt()) return "You have the maximum amount of milestone points"
    return "Reset previous progress for a milestone point<br>Requirement: " + format(this.getNextAt()) + " points"
  },
  
  milestones: {
    0: {
      requirementDescription: "[1] 1 Milestone Point",
      effectDescription: "Start all row 2 runs with the 3rd prestige milestone.",
      done() { return player.m.points.gte(1)}
    },
    1: {
      requirementDescription: "[2] 2 Milestone Points",
      effectDescription: "Start all row 2 runs with the 4th prestige milestone.",
      done() { return player.m.points.gte(2)}
    },
    2: {
      requirementDescription: "[3] 3 Milestone Points",
      effectDescription: "Gain +10% of Prestige Points gain every second.",
      done() { return player.m.points.gte(3)}
    },
    3: {
      requirementDescription: "[4] 4 Milestone Points",
      effectDescription: "Unlock 2 new U upgrades.",
      done() { return player.m.points.gte(4)}
    },
    4: {
      requirementDescription: "[5] 5 Milestone Points",
      effectDescription: "The third M-layer milestone is 4x stronger and Milestone 3+ (U) is stronger.",
      done() { return player.m.points.gte(5)}
    },
    5: {
      requirementDescription: "[6] 6 Milestone Points",
      effectDescription(){
        return `Triple points for every future milestone points.<br>Currently: x${formatWhole(this.effect())} points`
      },
      
      effect() {return new Decimal(3).pow(player.m.points.sub(5))},
      done() {return player.m.points.gte(6)},
      unlocked() {return hasAchievement("a",73)},
    },
    6: {
      requirementDescription: "[7] 7 Milestone Points",
      effectDescription(){
        return `Get 1.25x (additive) energy and collapse points for every future milestone points.<br>Currently: x${format(this.effect(),1)} energy and collapse points`
      },
      
      effect() {return new Decimal(0.25).mul(player.m.points.sub(6)).add(1)},
      
      done() {return player.m.points.gte(7)},
      unlocked() {return hasAchievement("a",73)},
    },
    7: {
      requirementDescription: "[8] 11 Milestone Points",
      effectDescription(){
        return `Get ^1.1 points.`
      },
      
      done() {return player.m.points.gte(11)},
      unlocked() {return hasAchievement("a",73)},
    },
    8: {
      requirementDescription: "[9] 20 Milestone Points",
      effectDescription(){
        return `Cheapen boosters and slightly strengthen them.`
      },
      
      done() {return player.m.points.gte(20)},
      unlocked() {return hasAchievement("a",73)},
    },
    9: {
      requirementDescription: "[10] 35 Milestone Points",
      effectDescription(){
        return `Power-up point gain based on milestone points<br>Currently: ^${format(this.effect().add(1))} points`
      },
      tooltip: "log225(mp-30)",
      
      effect() {return player.m.points.max(35).sub(30).log(225)},
      
      done() {return player.m.points.gte(35)},
      unlocked() {return hasAchievement("a",73)},
    },
    10: {
      requirementDescription: "[11] 55 Milestone Points",
      effectDescription(){
        return `Self synergy will be stronger`
      },
      tooltip: "this switches the logarithm of 1.08 to a power of 0.05.",
      
      done() {return player.m.points.gte(55) && this.unlocked()},
      unlocked() {return hasUpgrade("mr",23)},
    },
    11: {
      requirementDescription: "[12] 90 Milestone Points",
      effectDescription(){
        return `The 6 prestige point milestone will be stronger.`
      },
      
      done() {return player.m.points.gte(90) && this.unlocked()},
      unlocked() {return hasUpgrade("mr",23)},
    },
    12: {
      requirementDescription: "[13] 250 Milestone Points",
      effectDescription(){
        return `Strengthen Prestige Milestone 4 by +1.`
      },
      
      done() {return player.m.points.gte(250) && this.unlocked()},
      unlocked() {return hasUpgrade("s",42)},
    },
    13: {
      requirementDescription: "[14] 300 Milestone Points",
      effectDescription(){
        return `Strengthen Prestige Milestone 4 by +1.`
      },
      
      done() {return player.m.points.gte(300) && this.unlocked()},
      unlocked() {return hasUpgrade("s",42)},
    },
    14: {
      requirementDescription: "[15] 500 Milestone Points",
      effectDescription(){
        return `Get +^0.5 prestige points.`
      },
      
      done() {return player.m.points.gte(500) && this.unlocked()},
      unlocked() {return hasUpgrade("s",42)},
    },
  },//player.m.points.gte(6) && player.r.points.gte(10)
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;
    layerDataReset(this.layer);
    if(hasMilestone("r",1)) player.m.points = new Decimal(3);
    if(hasMilestone("r",3)) player.m.points = new Decimal(5);
  },
  hotkeys: [
    {key: "m", description: "M: Get a milestone point", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  deactivated(){return inChallenge("mr",22)},
  layerShown(){return player.r.points.gte(5) && !inChallenge("mr",22)},
  branches: ["p"],
}) //Milestones
addLayer("c", {
  symbol: "C",
  color: "#F0476C",
  Gcolor: "repeating-linear-gradient(-45deg, #F0476C, #F0476C 20px, #E94166 20px, #E94166 40px)",
  row: 2,
  position: 0,
  tooltip(){
    return `<h2>Collapse</h2><br>${formatWhole(player[this.layer].points)} Collapse Points`
  },
  
  passiveGeneration(){
    if(!this.canReset() || this.getResetGain().isNan() || inChallenge("mr",22)) return 0
    gain = 0;
    if(hasMilestone("mr",1)) gain += 0.05
    
    gain *= (challengeCompletions("mr",11)*0.5)+1
    return gain
  },
  autoUpgrade(){return player.c.autoUpgrade && hasMilestone("mr",0)},
  
  startData() { return {
    unlocked: true,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
    sacrifices: [0,0,0,0,0,0],
    max: 0,
  }},
  prestigeButtonText(){
    let gain = formatWhole(Decimal.max(this.getResetGain(),this.gainMult()).max(0)) //Decimal.max(this.getResetGain(),this.gainMult())
    let nextAt = Decimal.max(this.getNextAt(),this.requires())

    if(hasUpgrade("mr",51) || player.c.points.gte("1e75")) return `+<strong>${gain}</strong> collapse points`
    if(this.sacAm() > 4) return `+<strong>${gain}</strong> collapse points<br><br>Next collapse point: ${format(nextAt)} (increased because of the amount of sacrifices)`
    return `+<strong>${gain}</strong> collapse points<br><br>Next collapse point: ${format(nextAt)}`
  },
  sacAm(){return player.c.sacrifices.reduce((bef, cur) => bef + cur, 0)},
  type: "custom",
  requires(){
    var req = new Decimal(1e9)
    if(inChallenge("mr",11)) req = req.div(10000)
    if(inChallenge("mr",21)) return req
    else if(this.sacAm() > 4) req = req.mul(new Decimal(10).pow(this.sacAm()-4)).floor()
    return req
  },
  canReset(){
    return player.points.gte(this.requires())
  },
  getNextAt(){
    return new Decimal(10).pow(this.getResetGain().add(1).div(this.gainMult())).mul(this.requires()).div(10).max(0)
  },
  getResetGain(){
    if(hasUpgrade("mr",51)) return player.points.div(this.requires()).log(2).pow(5).add(1).mul(this.gainMult()).floor().max(0)
    return player.points.div(this.requires()).log(10).add(1).mul(this.gainMult()).floor().max(0)
  },
  
  resource: "collapse points",
  baseResource: "points",
  baseAmount() {return player.points},
  tabFormat: {
    "Upgrade Tree": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        "upgrades"
      ],
    },
    "Sacrifices": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text",
          function() { return 'Your sacrifices are giving x' + format(tmp.c.boost) + ' collapse points' }],
        "clickables"
      ],
      unlocked(){return hasUpgrade("c",31) && !inChallenge("mr",21)}
    },
  },
  boost(){
    if(inChallenge("mr",21)) return new Decimal(1)
    mult = new Decimal(1)

    if(hasUpgrade("s",61)){
      mult = mult.mul(layers.c.clickables[11].boost().pow(player.c.max))
      mult = mult.mul(layers.c.clickables[12].boost().pow(player.c.max))
      mult = mult.mul(layers.c.clickables[21].boost().pow(player.c.max))
      mult = mult.mul(layers.c.clickables[22].boost().pow(player.c.max))
      mult = mult.mul(layers.c.clickables[23].boost().pow(player.c.max))

      mult = mult.pow(new Decimal(0.25).mul(player.c.max).add(1))
    } else {
      mult = mult.mul(layers.c.clickables[11].boost().pow(player.c.sacrifices[0]))
      mult = mult.mul(layers.c.clickables[12].boost().pow(player.c.sacrifices[1]))
      mult = mult.mul(layers.c.clickables[21].boost().pow(player.c.sacrifices[2]))
      mult = mult.mul(layers.c.clickables[22].boost().pow(player.c.sacrifices[3]))
      mult = mult.mul(layers.c.clickables[23].boost().pow(player.c.sacrifices[4]))

      mult = mult.pow(new Decimal(0.25).mul(player.c.sacrifices[5]).add(1))
    }

    if(hasChallenge("mr",11)) mult = mult.pow(new Decimal(challengeCompletions("mr",11)).mul(0.5).add(1))
    
    return Decimal.max(mult,1)
  },
  gainMult() {
    mult = this.boost()
    if(player.e.buyables[31]) mult = mult.mul(new Decimal(10).pow(player.e.buyables[31]))
    if(hasMilestone("m",6)) mult = mult.mul(milestoneEffect("m",6))
    
    if(hasUpgrade("c",132)) mult = mult.mul(upgradeEffect("c",132))

    if (hasUpgrade("b",13)) mult = mult.mul(upgradeEffect("b",13))
    if(hasUpgrade("c",92)) mult = mult.mul(500)
    return mult.max(1)
  },
  
  upgrades: {
    11: {
      title: "A new layer",
      description: "Boost point gain based on total C points",
      effect(){
        let pow = 0.5
        if(hasUpgrade("c",81)) pow += 0.25
        if(hasChallenge("mr",11)) pow += (challengeCompletions("mr",11)*0.3)+0.05
        if(hasUpgrade("mr",53)) pow += 2
        
        if(player.c.total.isNan()) return new Decimal(1)
        return player.c.total.pow(pow).mul(3).add(2)
      },
      tooltip(){
        let pow = 0.5
        if(hasUpgrade("c",81)) pow += 0.25
        if(hasChallenge("mr",11)) pow += (challengeCompletions("mr",11)*0.3)+0.05
        if(hasUpgrade("mr",53)) pow += 2

        return `2+3(C<sup>${pow}</sup>)`
      },
      effectDisplay(){return "x" + format(this.effect())},
      cost: new Decimal(1),
      canAfford(){return player.c.points.gte(this.cost)},
      unlocked(){return true},
    },
    12: {
      title: "More self synergy",
      description: "Strengthen U13 self synergy",
      cost: new Decimal(2),
      canAfford(){return player.c.points.gte(this.cost)},
      unlocked(){return player.r.points.gte(8)},
    },
    21: {
      title: "Three times faster",
      description: "x3 point gain",
      cost: new Decimal(1),
      canAfford(){return  player.c.points.gte(this.cost)},
      branches: [22],
    },
    22: {
      title: "Double Prestige",
      description: "x2 prestige gain",
      cost: new Decimal(1),
      canAfford(){return hasUpgrade("c",11) && player.c.points.gte(this.cost)},
      branches: [11],
    },
    31: {
      title: "Sacrifice",
      description: "Unlock something that gives you more collapse",
      cost: new Decimal(1),
      canAfford(){return hasUpgrade("c",21) && player.c.points.gte(this.cost)},
      branches: [21],
    },
    33: {
      title: "Preserved Booster",
      description: "Keep Boosters layer on collapse resets",
      cost: new Decimal(2),
      canAfford(){return hasUpgrade("c",22) && player.c.points.gte(this.cost)},
      unlocked(){return player.r.points.gte(8)},
      branches: [22],
    },
    41: {
      title: "I need more prestige",
      description: "Milestone 3 is 4x more powerful",
      cost: new Decimal(3),
      canAfford(){return hasUpgrade("c",31)},
      unlocked(){return hasUpgrade("c",31) || player.r.points.gte(7)},
      branches: [31],
    },
    42: {
      title: "Finally",
      description: "Automate buying the first 5 P upgrades, no charge",
      cost: new Decimal(1),
      canAfford(){return hasUpgrade("c",31) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",31) || player.r.points.gte(7)},
      branches: [31],
    },
    51: {
      title: "A boosted paycheck",
      description: "Boosters are cheaper.",
      cost: new Decimal(6),
      canAfford(){return hasUpgrade("c",41) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",31) && player.r.points.gte(7)},
      branches: [41],
    },
    52: {
      title: "More!",
      description: "Double Milestone 3's effect",
      cost: new Decimal(8),
      canAfford(){return hasUpgrade("c",41) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",31) && player.r.points.gte(7)},
      branches: [41],
    },
    53: {
      title: "Four times faster",
      description: "4x points",
      cost: new Decimal(4),
      canAfford(){return hasUpgrade("c",42) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",31) && player.r.points.gte(7)},
      branches: [42],
    },
    61: {
      title: "The end of the tree?",
      description: "100x points if you are not in a challenge",
      cost: new Decimal(15),
      canAfford(){return hasUpgrade("c",52) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",52) && player.r.points.gte(7)},
      branches: [52],
    },
    71: {
      title: "Boosters Boost",
      description: "Strengthens boosters",
      cost: new Decimal(55),
      canAfford(){return hasUpgrade("c",61) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",52) && player.r.points.gte(8)},
      branches: [61],
    },
    72: {
      title: "A stronger Power",
      description: "'A powerful power' will boost Collapse Point gain more, based on bought collapse point upgrades.",
      tooltip(){return `3x => ${this.effect().add(3)}x<br>round([c-2]<sup>0.55</sup>)`},
      effect(){return new Decimal(player.c.upgrades.length).sub(2).pow(0.55).round()},
      cost: new Decimal(55),
      canAfford(){return hasUpgrade("c",61) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",52) && player.r.points.gte(8)},
      branches: [61],
    },
    81: {
      title: "Back to the beginning",
      description: "Strengthen the very collapse first upgrade (top-left)",
      cost: new Decimal(250),
      canAfford(){return hasUpgrade("c",71) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",52) && player.r.points.gte(8)},
      branches: [71],
    },
    82: {
      title: "Yet another prestige milestone boost",
      description: "The second and third prestige milestones are stronger",
      cost: new Decimal(750),
      canAfford(){return hasUpgrade("c",71) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",52) && player.r.points.gte(9)},
      branches: [72],
    },
    91: {
      title: "Increased Collapse I",
      description: "You can put sacrifices twice.",
      onPurchase(){player.c.max+=1},
      cost: new Decimal(650),
      canAfford(){return hasUpgrade("c",81) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",81) && player.r.points.gte(8)},
      branches: [81],
    },
    92: {
      title: "Increased Collapse II",
      description: "Get 500x collapse points.",
      cost: new Decimal(1000),
      canAfford(){return hasUpgrade("c",81) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",81) && player.r.points.gte(8)},
      branches: [81],
    },
    93: {
      title: "Increased Collapse III",
      description: "All Collapse Sacrifices gain +1x multiplier.",
      cost: new Decimal(1000),
      canAfford(){return hasUpgrade("c",82) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",82) && player.r.points.gte(9)},
      branches: [82],
    },
    111: {
      title: "A small reset without the reset",
      description: "Upgrade Points do not reset anything",
      onPurchase(){},
      cost: new Decimal(1000000),
      canAfford(){return hasUpgrade("c",91) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",91) && player.r.points.gte(8)},
      branches: [91],
    },
    112: {
      title: "Another small reset without the reset",
      description: "Booster Points do not reset anything",
      cost: new Decimal(80000000),
      canAfford(){return hasUpgrade("c",92) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",92) && player.r.points.gte(9)},
      branches: [92],
    },
    121: {
      title: "Bulk Boosters",
      description: "Booster Points can now be bought in bulk.",
      cost: new Decimal(1e12),
      canAfford(){return hasUpgrade("c",112) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",92) && player.r.points.gte(9)},
      branches: [112],
    },
    122: {
      title: "Best of both sides",
      description: "You can enable both booster effects.",
      cost: new Decimal(1e18),
      canAfford(){return hasUpgrade("c",112) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",92) && player.r.points.gte(9)},
      branches: [112],
    },
    131: {
      title: "Collapse to energy",
      description: "Collapse boosts energy gain",
      effect(){
        if(player.c.points.isNan()) return new Decimal(1)
        if(hasUpgrade("s",72)) return player.c.points.max(1).log(1.2).pow(100).max(1)
        return player.c.points.max(1).log(1.2).pow(2).max(1)
      },
      tooltip(){
        return hasUpgrade("s",72) ? "log<sub>1.2</sub>(c)<sup>100</sup>" : "log<sub>1.2</sub>(c)<sup>2</sup>"
      },
      effectDisplay(){return `x${format(this.effect())} energy`},
      cost: new Decimal(1e24),
      canAfford(){return hasUpgrade("c",121) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",121) && player.r.points.gte(9)},
      branches: [121],
    },
    132: {
      title: "Energy to collapse",
      description: "Energy boosts collapse gain",
      effect(){
        if(player.e.points.isNan()) return new Decimal(1)
        if(hasUpgrade("s",62)) return player.e.points.max(1).log(1.2).pow(100).max(1)
        return player.e.points.max(1).log(1.2).pow(2).max(1)
      },
      tooltip(){
        return hasUpgrade("s",62) ? "log<sub>1.2</sub>(c)<sup>100</sup>" : "log<sub>1.2</sub>(c)<sup>2</sup>"
      },
      effectDisplay(){return `x${format(this.effect())} energy`},
      cost: new Decimal(1e60),
      canAfford(){return hasUpgrade("c",122) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",122) && player.r.points.gte(9)},
      branches: [122],
    },
    141: {
      title: "Another small reset without the reset",
      description: "Milestone Points do not reset anything",
      cost: new Decimal(1e45),
      canAfford(){return hasUpgrade("c",131) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",131) && player.r.points.gte(10)},
      branches: [131],
    },
    142: {
      title: "Booster+",
      description: "Boosters are significantly stronger",
      cost: new Decimal(1e70),
      canAfford(){return hasUpgrade("c",132) && player.c.points.gte(this.cost)},
      unlocked(){return hasUpgrade("c",132) && player.r.points.gte(10)},
      branches: [132],
    },
  },
  clickables: {
    11: {
      display() {
        return `<h2>A powerful power [1x${player.c.sacrifices[0]}]</h2><br>^0.75 point gain per level<br>${formatWhole(this.boost())}x collapse points per level`
      },
      boost() {
        let boost = new Decimal(4);
        if(hasUpgrade("c",72)) boost = boost.add(upgradeEffect("c",72))
        if(hasUpgrade("c",93)) boost = boost.add(1)

        return boost
      },
      unlocked() {return true},
      canClick() {return true && !inChallenge("mr",11) && !inChallenge("mr",21)},
      onClick() {
        doReset("c",true)
        if (player.c.sacrifices[0] <= player.c.max) player.c.sacrifices[0]++;
        else player.c.sacrifices[0] = 0;
      },
      style(){
        if(player.c.sacrifices[0] > 0)
          return {"background-image":"repeating-linear-gradient(-45deg, #8CCC76, #8CCC76 20px, #85C86E 20px, #85C86E 40px)","height":"160px","width":"180px"}
        else 
          return {"background-image":"repeating-linear-gradient(-45deg, #E98E62, #E98E62 20px, #E5895D 20px, #E5895D 40px)","height":"160px","width":"180px"}
      }
    },
    12: {
      display() {
        if(player.c.upgrades.length < 5) `<h2>Inflated Upgrades [2]</h2><br>Unlocked at 5 collapse upgrades (currently: ${player.c.upgrades.length})`
        return `<h2>Inflated Upgrades [2x${player.c.sacrifices[1]}]</h2><br>Upgrades are more expensive per level<br>${formatWhole(this.boost())}x collapse points per level`
      },
      boost() {
        let boost = new Decimal(3);

        if(hasUpgrade("c",93)) boost = boost.add(1)

        return boost
      },
      unlocked() {return true},
      canClick() {return player.c.upgrades.length >= 5 && !inChallenge("mr",11) && !inChallenge("mr",21)},
      onClick() {
        doReset("c",true)
        if (player.c.sacrifices[1] <= player.c.max && player.c.sacrifices[1] < 7) player.c.sacrifices[1]++;
        else player.c.sacrifices[1] = 0;
      },
      style(){
        if(player.c.upgrades.length < 5) return {"background-image":"repeating-linear-gradient(-45deg, #A38484, #A38484 20px, #A18282 20px, #A18282 40px)","height":"160px","width":"180px"}
        if(player.c.sacrifices[1] > 0)
          return {"background-image":"repeating-linear-gradient(-45deg, #8CCC76, #8CCC76 20px, #85C86E 20px, #85C86E 40px)","height":"160px","width":"180px"}
        else 
          return {"background-image":"repeating-linear-gradient(-45deg, #E98E62, #E98E62 20px, #E5895D 20px, #E5895D 40px)","height":"160px","width":"180px"}
      }
    },
    21: {
      display() {
        if(player.c.upgrades.length < 8) return `<h2>Anti-Boosters [3]</h2><br>Unlocked at 8 collapse upgrades (currently: ${player.c.upgrades.length})`
        return `<h2>Anti-Boosters [3x${player.c.sacrifices[2]}]</h2><br>Boosters are significantly weaker<br>${formatWhole(this.boost())}x collapse points per level`
      },
      boost() {
        let boost = new Decimal(2);

        if(hasUpgrade("c",93)) boost = boost.add(1)

        return boost
      },
      unlocked() {return true},
      canClick() {return player.c.upgrades.length >= 8 && !inChallenge("mr",11) && !inChallenge("mr",21)},
      onClick() {
        doReset("c",true)
        if (player.c.sacrifices[2] <= player.c.max) player.c.sacrifices[2]++;
        else player.c.sacrifices[2] = 0;
      },
      style(){
        if(player.c.upgrades.length < 8) return {"background-image":"repeating-linear-gradient(-45deg, #A38484, #A38484 20px, #A18282 20px, #A18282 40px)","height":"160px","width":"180px"}
        if(player.c.sacrifices[2] > 0) return {"background-image":"repeating-linear-gradient(-45deg, #8CCC76, #8CCC76 20px, #85C86E 20px, #85C86E 40px)","height":"160px","width":"180px"}
        else  return {"background-image":"repeating-linear-gradient(-45deg, #E98E62, #E98E62 20px, #E5895D 20px, #E5895D 40px)","height":"160px","width":"180px"}
      }
    },
    22: {
      display() {
        if(player.c.upgrades.length < 12)
          return `<h2>Uselessness [4]</h2><br>Unlocked at 12 collapse upgrades (currently: ${player.c.upgrades.length}/12)`
        if(player.c.max > 0)
          return `<h2>Uselessness [4x${player.c.sacrifices[3]}]</h2><br>All P-layer point multipliers will do nothing.<br> Past level 1, this divides your point gain by /10,000 per level.<br>${formatWhole(this.boost())}x collapse points per level`
        return `<h2>Uselessness [4x${player.c.sacrifices[3]}]</h2><br>All P-layer point multipliers will do nothing. (/~5,000 points)<br>${formatWhole(this.boost())}x collapse points per level`
      },
      boost() {
        let boost = new Decimal(4);
        
        if(hasUpgrade("c",93)) boost = boost.add(1)

        return boost
      },
      unlocked() {return true},
      canClick() {return player.c.upgrades.length >= 12 && !inChallenge("mr",11) && !inChallenge("mr",21)},
      onClick() {
        doReset("c",true)
        if (player.c.sacrifices[3] <= player.c.max) player.c.sacrifices[3]++;
        else player.c.sacrifices[3] = 0;
      },
      style(){
        if(player.c.upgrades.length < 12) return {"background-image":"repeating-linear-gradient(-45deg, #A38484, #A38484 20px, #A18282 20px, #A18282 40px)","height":"160px","width":"180px"}
        if(player.c.sacrifices[3] > 0)
          return {"background-image":"repeating-linear-gradient(-45deg, #8CCC76, #8CCC76 20px, #85C86E 20px, #85C86E 40px)","height":"160px","width":"180px"}
        else 
          return {"background-image":"repeating-linear-gradient(-45deg, #E98E62, #E98E62 20px, #E5895D 20px, #E5895D 40px)","height":"160px","width":"180px"}
      }
    },
    23: {
      display() {
        if(player.c.upgrades.length < 15) return `<h2>Extremely powerful [5x${player.c.sacrifices[4]}]</h2><br>Unlocked at 15 collapse upgrades (currently: ${player.c.upgrades.length})`
        return `<h2>Extremely powerful [5x${player.c.sacrifices[4]}]</h2><br>^0.8 prestige points per level<br>${formatWhole(this.boost())}x collapse points per level`
      },
      boost() {
        let boost = new Decimal(3);
        
        if(hasUpgrade("c",93)) boost = boost.add(1)

        return boost
      },
      unlocked() {return true},
      canClick() {return player.c.upgrades.length >= 15 && !inChallenge("mr",11) && !inChallenge("mr",21)},
      onClick() {
        doReset("c",true)
        if (player.c.sacrifices[4] <= player.c.max) player.c.sacrifices[4]++;
        else player.c.sacrifices[4] = 0;
      },
      style(){
        if(player.c.upgrades.length < 15) return {"background-image":"repeating-linear-gradient(-45deg, #A38484, #A38484 20px, #A18282 20px, #A18282 40px)","height":"160px","width":"180px"}
        if(player.c.sacrifices[4] > 0)
          return {"background-image":"repeating-linear-gradient(-45deg, #8CCC76, #8CCC76 20px, #85C86E 20px, #85C86E 40px)","height":"160px","width":"180px"}
        else 
          return {"background-image":"repeating-linear-gradient(-45deg, #E98E62, #E98E62 20px, #E5895D 20px, #E5895D 40px)","height":"160px","width":"180px"}
      }
    },
    31: {
      display() {
        return `<h2>Milestone Inflation [6x${player.c.sacrifices[5]}]</h2><br>^2 times more expensive milestones.<br>+^0.5 the effect of sacrifices per level`
      },
      unlocked() {return player.mr.points.gte(6)},
      canClick() {return true},
      onClick() {
        doReset("c",true)
        if (player.c.sacrifices[5] <= player.c.max) player.c.sacrifices[5]++;
        else player.c.sacrifices[5] = 0;
      },
      style(){
        if(player.c.upgrades.length < 15) return {"background-image":"repeating-linear-gradient(-45deg, #A38484, #A38484 20px, #A18282 20px, #A18282 40px)","height":"160px","width":"180px"}
        if(player.c.sacrifices[5] > 0)
          return {"background-image":"repeating-linear-gradient(-45deg, #8CCC76, #8CCC76 20px, #85C86E 20px, #85C86E 40px)","height":"160px","width":"180px"}
        else 
          return {"background-image":"repeating-linear-gradient(-45deg, #E98E62, #E98E62 20px, #E5895D 20px, #E5895D 40px)","height":"160px","width":"180px"}
      }
    },
  },
  
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;
    let upg = player.c.upgrades;
    layerDataReset(this.layer);
    if(hasMilestone("mr",4) && layers[resettingLayer].row < 25) player.c.points = new Decimal(1)
    if(hasMilestone("r",7)) player.c.upgrades = upg;
    else if(hasMilestone("r",2)) player.c.upgrades.push(42);
  },
  
  hotkeys: [
    {key: "c", description: "C: Get a collapse point", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  deactivated(){return inChallenge("mr",22)},
  layerShown(){return player.r.points.gte(6) && !inChallenge("mr",22)},
  branches: ["u","m"],
}) //Collapse
addLayer("e", {
  symbol: "E",
  color: "#FFBE56",
  Gcolor: "repeating-linear-gradient(-45deg, #FFBE56, #FFBE56 20px, #F4B34B 20px, #F4B34B 40px)",
  row: 2,
  position: 2,
  tooltip(){
    return `<h2>Energy</h2><br>${formatWhole(player[this.layer].points)} Energy Points`
  },
  
  startData() { return {
    unlocked: false,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
  }},
  requires: new Decimal(1e25),
  
  resource: "energy",
  baseResource: "points",
  baseAmount() {return player.points},
  passiveGeneration(){
    gain = 0;

    gain += (player.e.buyables[41]/20)
    gain *= 1+(player.e.buyables[42]/10)
    if(this.canReset() && this.getResetGain().gte(1)) return gain
  },
  
  gainMult() {
    mult = new Decimal(1)
    if(player.e.buyables[61]) mult = mult.add(tmp.c.sacAm*player.e.buyables[61])
    if(hasMilestone("m",6)) mult = mult.mul(milestoneEffect("m",6))
    if(hasUpgrade("c",131)) mult = mult.mul(upgradeEffect("c",131))
    
    if (hasUpgrade("b",13)) mult = mult.mul(upgradeEffect("b",13))

    if(mult.isNan()) return new Decimal(1)
    return mult
  },
  
  prestigeButtonText(){
    let gain = formatWhole(this.getResetGain().floor()) //Decimal.max(this.getResetGain(),this.gainMult())
    let nextAt = Decimal.max(this.getNextAt(),this.requires)
    
    if(player.r.points.gte(11)) return `+<strong>${gain}</strong> energy points`
    return `+<strong>${gain}</strong> energy points<br><br>Next energy point: ${format(nextAt)}`
  },
  sacAm(){return player.c.sacrifices.reduce((bef, cur) => bef + cur, 0)},
  type: "custom",
  canReset(){
    return player.points.gte(this.requires) && this.getResetGain().gte(1)
  },
  getNextAt(){
    return new Decimal(2).pow(this.getResetGain().add(3).pow(1/1.2).div(this.gainMult())).mul(1e25).add(1)
  },
  getResetGain(){
    let gain = player.points.max(1).div(1e25).log(2).mul(this.gainMult()).pow(1.2).add(1).floor()
    if(gain.isNan()) return new Decimal(0)
    
    return gain.max(1)
  },
  
  buyables: {
    11: {
      cost(x) { return new Decimal(4).pow(x) },
      effect(x) {return new Decimal(1+(player.e.buyables[11]*0.04))},
      max(x) { return new Decimal(x).log(4).ceil()},
      display() {
        return `<h2>Increased Synergy ${getBuyableAmount(this.layer, this.id)}/${this.purchaseLimit()}</h2>
          U13 Self synergy is stronger<br>Currently: ^${format(this.effect())} (+0.04 per level)
          Cost: ${formatWhole(this.cost())} energy
        `},
      tooltip: `Decrease the base for the Self Synergy by 0.115 (upgrade starts at 1.6)`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        if(hasMilestone("r",6) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id)))
          setBuyableAmount(this.layer, this.id, Decimal.min(this.purchaseLimit(),this.max(player.e.points)))
      },
      purchaseLimit(){return hasUpgrade("s",71) ? 10 : 5},
      style:{"height":"100px","height":"160px"},
    },
    21: {
      cost(x) {
        if(x.gte(3))  return new Decimal(6).pow(x).mul(2)
        return new Decimal(4).pow(x).mul(2)
      },
      max(x) { return new Decimal(x).div(2).log(6).ceil()},
      display() { return `<h2>Prestige Boost ${getBuyableAmount(this.layer, this.id)}/${this.purchaseLimit()}</h2><br>Get more prestige points<br>Currently: +^${format(new Decimal(getBuyableAmount(this.layer, this.id)*0.1))} Prestige points<br>Cost: ${formatWhole(this.cost())} energy`},
      tooltip: `Get ^+0.1 prestige points`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        if(hasMilestone("r",6) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, Decimal.min(this.purchaseLimit(),this.max(player.e.points)))
      },
      purchaseLimit(){return hasUpgrade("s",71) ? 10 : 5},
      style:{"height":"100px","height":"160px"},
    },
    22: {
      cost(x) {
        if(x.gte(3)) return new Decimal(6).pow(x).mul(2)
        return new Decimal(4).pow(x).mul(3)
      },
      max(x) { return new Decimal(x).div(2).log(6).ceil()},
      display() { return `<h2>Point Boost ${getBuyableAmount(this.layer, this.id)}/${this.purchaseLimit()}</h2><br>Get more points<br>Currently: +^${format(new Decimal(getBuyableAmount(this.layer, this.id)*0.1))} Points<br>Cost: ${formatWhole(this.cost())} energy`},
      tooltip: `Get +^0.1 points per level`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        if(hasMilestone("r",6) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, Decimal.min(this.purchaseLimit(),this.max(player.e.points)))
      },
      purchaseLimit(){return hasUpgrade("s",71) ? 10 : 5},
      style:{"height":"100px","height":"160px"},
    },
    31: {
      cost(x) {
        return new Decimal(1.6).pow(x).mul(5)
      },
      max(x) {
        let max = new Decimal(x).div(5).log(1.6).ceil()
        
        return max
      },
      display() { return `<h2>Collapse Boost ${getBuyableAmount(this.layer, this.id)}/${this.purchaseLimit()}</h2><br>Get more collapse points<br>Currently: x${format(new Decimal(10).pow(getBuyableAmount(this.layer, this.id)))} collapse points<br>Cost: ${formatWhole(this.cost())} energy`},
      tooltip: `Get x10 collapse points per level`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        if(hasMilestone("r",6) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, Decimal.min(this.purchaseLimit(),this.max(player.e.points)))
      },
      purchaseLimit(){
        if(hasUpgrade("mr",61) || hasUpgrade("s",71)) return 9001
        return 100
      },
      style:{"height":"100px","height":"160px"},
    },
    32: {
      cost(x) { return new Decimal(6).pow(x).mul(20) },
      max(x) { return new Decimal(x).div(20).log(6).ceil()},
      display() { return `<h2>Boost Discounts ${getBuyableAmount(this.layer, this.id)}/${this.purchaseLimit()}</h2><br>Boosters are cheaper<br>Cost: ${formatWhole(this.cost())} energy`},
      tooltip: `Cheapen boosters`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        if(hasMilestone("r",6) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, Decimal.min(this.purchaseLimit(),this.max(player.e.points)))
      },
      purchaseLimit(){return hasUpgrade("s",71) ? 8 : 5},
      style:{"height":"100px","height":"160px"},
    },
    41: {
      cost(x) {
        return new Decimal(1.125).pow(x).mul(5)
      },
      max(x) { return new Decimal(x).div(5).log(1.125).ceil()},
      display() { return `<h2>Charger ${getBuyableAmount(this.layer, this.id)}/${this.purchaseLimit()}</h2><br>Automatically gain energy points<br>Currently: ${format(new Decimal(getBuyableAmount(this.layer, this.id)*5))}% per second<br>Cost: ${formatWhole(this.cost())} energy`},
      tooltip: `Get +5% of energy points per second`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        if(hasMilestone("r",6) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, Decimal.min(this.purchaseLimit(),this.max(player.e.points)))
      },
      purchaseLimit(){return hasUpgrade("s",71) ? 10000 : 300},
      style:{"height":"100px","height":"160px"},
    },
    42: {
      cost(x) {
        return new Decimal(1.28).pow(x).mul(10000)
      },
      max(x) { return new Decimal(x).div(10000).log(1.3).ceil()},
      display() { return `<h2>Charger^2 ${getBuyableAmount(this.layer, this.id)}/${this.purchaseLimit()}</h2><br>Boost chargers<br>Currently: ${format(new Decimal(getBuyableAmount(this.layer, this.id)*0.1+1))}x boost<br>Cost: ${formatWhole(this.cost())} energy`},
      tooltip: `+x0.1 energy points per second.`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        if(hasMilestone("r",6) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, Decimal.min(this.purchaseLimit(),this.max(player.e.points)))
      },
      purchaseLimit(){return hasUpgrade("s",71) ? 1000 : 135},
      style:{"height":"100px","height":"160px"},
    },
    51: {
      cost(x) {
        return new Decimal(500).pow(x).mul(3000000)
      },
      max(x) { return new Decimal(x).div(3000000).log(500).ceil()},
      display() { return `<h2>Collapse Boost III ${getBuyableAmount(this.layer, this.id)}/${this.purchaseLimit()}</h2><br>Increase the collapse sacrifice limit by 1<br>Currently: +${getBuyableAmount(this.layer, this.id)}<br>Cost: ${formatWhole(this.cost())} energy`},
      tooltip: `Increase the collapse sacrifice limit by 1`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player.c.max+=1
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        /*if(hasMilestone("r",5) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id))) {
          let buys = Decimal.min(this.purchaseLimit(),this.max(player.e.points))
          setBuyableAmount(this.layer, this.id, buys)
          player.c.max += buys.sub(getBuyableAmount(this.layer, this.id).add(1))
        }*/
      },
      purchaseLimit(){
        limit = player.r.points.gte(11) ? 3 : 2
        if(hasUpgrade("s",71)) limit+=2;
        if(hasUpgrade("s",61)) limit+=10;
        return limit
      },
      style:{"height":"100px","height":"160px"},
    },
    61: {
      cost(x) {
        return new Decimal(5.5).pow(x).mul(100000)
      },
      max(x) { return new Decimal(x).div(100000).log(5.5).ceil()},
      display() { return `<h2>Energy Boost ${getBuyableAmount(this.layer, this.id)}/20</h2><br>Collapse Sacrifices affect energy at a heavily reduced rate<br>Currently: ${parseInt(getBuyableAmount(this.layer, this.id))+1}x boost per collapse sacrifice<br>Cost: ${formatWhole(this.cost())} energy`},
      tooltip: `+x1 per collapse sacrifice per level`,
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player[this.layer].points = player[this.layer].points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        if(hasMilestone("r",6) && this.max(player.e.points).gte(getBuyableAmount(this.layer, this.id))) setBuyableAmount(this.layer, this.id, Decimal.min(this.purchaseLimit,this.max(player.e.points)))
      },
      purchaseLimit: 20,
      style:{"height":"100px","height":"160px"},
    },
  },
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;

    let chargers = getBuyableAmount("e",41)
    let chargers2 = getBuyableAmount("e",42)

    layerDataReset(this.layer);

    if(hasMilestone("r",7)){
      setBuyableAmount("e",41,chargers)
      setBuyableAmount("e",42,chargers2)
    }
  },
  
  hotkeys: [
    {key: "e", description: "E: Reset for an energy point", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  deactivated(){return inChallenge("mr",22)},
  layerShown(){return (player.r.points.gte(9) && !inChallenge("mr",22)) ? true : "ghost"},
  branches(){
    if(layers.b.layerShown() === true) return ["m","b"]
    return ["m"]
  },
}) //Energy
addLayer("s", {
  symbol: "S",
  color: "#FFFFFF",
  Gcolor: "repeating-linear-gradient(-45deg, #FFBE56, #FFBE56 20px, #F4B34B 20px, #F4B34B 40px)",
  row: 3,
  position: 1,
  tooltip(){
    return `<h2>Space</h2><br>${formatWhole(player[this.layer].points)} Space`
  },
  
  startData() { return {
    unlocked: false,
    points: new Decimal(0),
    best: new Decimal(0),
    total: new Decimal(0),
  }},
  requires: new Decimal("1e33000"),
  
  resource: "space",
  baseResource: "points",
  baseAmount() {return player.points},
  
  gainMult() {
    mult = new Decimal(1)

    if(mult.isNan()) return new Decimal(1)
    return mult.max(1)
  },
  
  prestigeButtonText(){
    let gain = formatWhole(Decimal.max(this.getResetGain(),this.gainMult()).floor()) //Decimal.max(this.getResetGain(),this.gainMult())
    let nextAt = Decimal.max(this.getNextAt(),this.requires)
    
    return `Enter space for <strong>${gain}</strong> space.<br><br>Next space at ${format(nextAt)}`
  },
  sacAm(){return player.c.sacrifices.reduce((bef, cur) => bef + cur, 0)},
  type: "custom",
  canReset(){
    return player.points.gte(this.requires)
  },
  getNextAt(){
    return new Decimal(16).pow(this.getResetGain().add(1).pow(1/0.5).div(this.gainMult())).mul("1e34000").add(1)
  },
  getResetGain(){
    if(player.points.lt("1e34000")) return new Decimal(1)

    let gain = player.points.max(1).div("1e34000").log(16).mul(this.gainMult()).add(1).pow(0.5).floor()
    return gain
  },

  
  upgrades: {
    //MAIN
    11: {
      fullDisplay(){return "<h2>Layer 2.</h2><br>1 space"},
      cost(){return hasMilestone("v",0) ? new Decimal(0) : new Decimal(1)},
      branches: [21,22],

      unlocked(){return true},
    },
    21: {
      fullDisplay(){return `<h2>Collapse.</h2><br>${formatWhole(this.cost())} space`},
      cost(){
        return hasUpgrade("s",22) ? new Decimal(30) : new Decimal(10)
      },

      unlocked(){return true},
    },
    22: {
      fullDisplay(){return `<h2>Energy.</h2><br>${formatWhole(this.cost())} space`},
      cost(){
        return hasUpgrade("s",21) ? new Decimal(30) : new Decimal(10)
      },

      unlocked(){return true},
    },
    31: {
      fullDisplay(){return "<h2>Rebirth.</h2><br>300 space"},
      cost: new Decimal(300),
      branches: [21,22],

      unlocked(){return true},
    },

    //LAYER 2
    41: {
      fullDisplay(){return "<h3>[U1] Unlimited</h3><br>Unlock a buyable in Space related to Upgrades<br>Cost: Free"},
      cost: new Decimal(0),

      unlocked(){return true},
    },
    51: {
      fullDisplay(){return `<h3>[U2] Strength</h3><br>The buyable unlocked from U1 is significantly stronger<br>Cost: ${this.cost} space`},
      cost: new Decimal(4),

      unlocked(){return true},
    },
    42: {
      fullDisplay(){return `<h3>[M1] Minimilestone</h3><br>Unlock new M-layer milestones.<br>Cost: ${this.cost} Space`},
      cost: new Decimal(1),

      unlocked(){return true},
    },
    52: {
      fullDisplay(){return `<h3>[M2] More!!</h3><br>Reduce milestone point requirement by ^0.2<br>Cost: ${this.cost} space`},
      cost: new Decimal(4),

      unlocked(){return true},
    },
    43: {
      fullDisplay(){return `<h3>[B1] Achievement Boosters</h3><br>Achievements boost Booster gain<br>Cost: ${this.cost} Space`},
      cost: new Decimal(30),

      unlocked(){return player.r.points.gte(13)},
    },
    53: {
      fullDisplay(){return `<h3>[B2] Boosters Boosters</h3><br>Gain more boosters and make them better<br>Cost: ${this.cost} Space`},
      cost: new Decimal(70),

      unlocked(){return player.r.points.gte(13)},
    },

    //LAYER 3
    61: {
      fullDisplay(){return `<h3>[C1] Unpowered Sacrifices</h3><br>Sacrifices always boost collapse gain, even if they are not triggered. Add 10 max purchases to 'Collapse Boost III'<br>Cost: Free`},
      cost: new Decimal(0),

      unlocked(){return hasUpgrade("s",21)},
    },
    62: {
      fullDisplay(){return `<h3>[C2] Collapse Synergy</h3><br>'Energy To Collapse' (Collapse Upgrade) is ^50 stronger<br>Cost: ${this.cost} space`},
      cost: new Decimal(25),

      unlocked(){return hasUpgrade("s",21)},
    },
    71: {
      fullDisplay(){return `<h3>[E1] Capacity Markup</h3><br>Increase the max buys of many of the energy upgrades<br>Cost: Free`},
      cost: new Decimal(0),

      unlocked(){return hasUpgrade("s",22)},
    },
    72: {
      fullDisplay(){return `<h3>[E2] Energy Synergy</h3><br>'Collapse To Energy' (Collapse upgrade) is ^50 stronger<br>Cost: ${this.cost} space`},
      cost: new Decimal(25),

      unlocked(){return hasUpgrade("s",22)},
    },

    //REBIRTH
    81: {
      fullDisplay(){return `<h3>[R1] Milestone 3++</h3><br>Buff milestone 3+ and add Achievement Multiplier to the effect.<br>Cost: Free`},
      cost: new Decimal(0),

      unlocked(){return true},
    },
    82: {
      fullDisplay(){return `<h3>[R2] Rebirth+</h3><br>Unlock the next rebirth.<br>Cost: ${this.cost}`},
      cost: new Decimal(350),

      unlocked(){return true},
    },
    83: {
      fullDisplay(){return `<h3>[R3] Void</h3><br>Unlock a new tab in rebirths.<br>Cost: ${this.cost}`},
      cost: new Decimal(2000),

      unlocked(){return player.r.points.gte(13)},
    },
    91: {
      fullDisplay(){return `<h3>[A1] Achievement+</h3><br>Achievement multiplier is boosted.<br>Cost: ${this.cost} space`},
      cost: new Decimal(250),

      unlocked(){return true},
    },
    /*
    101: {
      fullDisplay(){
        return `<h3>[V1] Void</h3><br>Create Void.<br>Cost: ${this.cost} space`
      },
      cost: new Decimal(2500),

      unlocked(){return player.r.points.gte(13)},
    },*/
  },
  buyables: {
    11: {
      effect(x) {
        if(hasUpgrade("s",51)) return new Decimal(0.3).mul(new Decimal(x).pow(0.8))
        return new Decimal(0.2).mul(new Decimal(x).pow(0.7))
      },
      cost(x) { return new Decimal(1.15).pow(x.sub(1)).add(x).floor()},
      display() {
        return `<h2>${getBuyableAmount(this.layer, this.id)} Upgrade Generators</h2><br>Generates Upgrades at the rate of +${format(this.effect())}/s<br>Cost: ${formatWhole(this.cost())} space`
      },
      canAfford() { return player[this.layer].points.gte(this.cost()) },
      buy() {
        player.s.points = player.s.points.sub(this.cost())
        setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
      },
      unlocked() {return hasUpgrade("s",41)},
      purchaseLimit: 100,
    },
  },
  
  tabFormat: {
    "Main": {
      content: [
        "main-display",
        "prestige-button",
        "blank",
        ["upgrades",[1,2,3]]
      ],
    },
    "Layer 2": {
      content: [
        "clickables",
        ["upgrades",[4,5]],
        ["buyables",[1]]
      ],
      unlocked(){return hasUpgrade("s",11)}
    },
    "Layer 3": {
      content: [
        "clickables",
        ["upgrades",[6,7]],
      ],
      unlocked(){return hasUpgrade("s",22) || hasUpgrade("s",21)}
    },
    "Rebirth": {
      content: [
        "clickables",
        ["upgrades",[8,9,10]],
      ],
      unlocked(){return hasUpgrade("s",31)}
    },
  },
  doReset(resettingLayer) {
    if (layers[resettingLayer].row <= this.row) return;

    let upgs = player.s.upgrades

    layerDataReset(this.layer);

    if(hasMilestone("v",0)){
      player.s.upgrades = upgs
    }
  },
  hotkeys: [
    {key: "s", description: "S: Enter space", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
  layerShown(){return hasChallenge("mr",22) || hasMilestone("v",0)},
  branches(){
    let branch = [];
    if(hasUpgrade("s",11) && player.r.points.gte(13)) branch.push("m")
    if(hasUpgrade("s",21)) branch.push("c")
    if(hasUpgrade("s",22)) branch.push("e")
    if(hasUpgrade("s",31)) branch.push("r")
    return branch
  },
}) //Energy