let modInfo = {
	name: "The Rebirth Tree Rewritten",
	author: "brandly123",
	pointsName: "points",
	modFiles: ["layers.js", "meta.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 2,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.10d",
	name: "Enter The Void",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.6 to v${VERSION.num} will be on galaxy</h3><br>
    
	<h3>v1.5 [12/15]</h3><br>
    - Added rebirth 9 content<br>
		- Endgame: Rebirth 9 completed, 50 achievements<br><br>
    
	<h3>v1.4B [12/14]</h3><br>
    - A bunch of bugfixes and balancing and QoL. Also added achievements but no new content<br>
		- Endgame: Rebirth 8 completed, 38 achievements<br><br>
    
	<h3>v1.3B [12/9]</h3><br>
    - Rebirth 8 has content now<br>
		- Endgame: Rebirth 8 completed, 29 achievements<br><br>
    
	<h3>v1.2B [12/4]</h3><br>
    - Took a long break from coding, but its back<br>
    - Rebirth 7 now has content<br>
    - i have no idea what else to put in here<br>
		- Endgame: Rebirth 7 completed, 29 achievements<br><br>
    
	<h3>v1.1B [9/11]</h3><br>
    - btw this was not intended to be posted on 9/11, just happened to finish it here<br>
    - Collapse, new layer.<br>
		- Endgame: Rebirth 6 completed, 22 achievements<br><br>
    
	<h3>v1.0B [9/8]</h3><br>
    - Added Rebirth, Prestige, Upgrades, Booster<br>
		- Endgame: Rebirth 4 completed, 11 achievements<br><br>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return player.r.points.gte(1)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

  //addition
	let gain = new Decimal(0)
  if(hasMilestone("p",0)) gain = gain.add(1)
  if(hasMilestone("p",1) && !hasUpgrade("u",12)) gain = gain.add(milestoneEffect("p",1))
  if(hasMilestone("p",2)) gain = gain.add(milestoneEffect("p",2))
  if(hasMilestone("p",1) && hasUpgrade("u",12)) gain = gain.mul(milestoneEffect("p",1))
  
  //prestige multiplication
  if(!player.c.sacrifices[3] > 0){
    if (hasUpgrade("p",11)) gain = gain.mul(1.5)
    if (hasUpgrade("p",13)) gain = gain.mul(upgradeEffect("p",13))
    if (hasUpgrade("p",14)) gain = gain.mul(upgradeEffect("p",14))
    if (hasUpgrade("p",15)) gain = gain.mul(upgradeEffect("p",15))
  }
  //other pre-collapse multiplication
  if (hasUpgrade("u",42)) gain = gain.mul(6)
  if (hasMilestone("m",5)) gain = gain.mul(milestoneEffect("m",5))
  if (hasUpgrade("b",11)) gain = gain.mul(upgradeEffect("b",11))
  if(player.c.sacrifices[3] > 1) gain = gain.div(10000 ** (player.c.sacrifices[3]-1))
  //collapse multiplication
  if (hasUpgrade("c",11)) gain = gain.mul(upgradeEffect("c",11))
  if (hasUpgrade("c",21)) gain = gain.mul(3)
  if (hasUpgrade("c",53)) gain = gain.mul(4)
  if (hasUpgrade("c",61) && layers.c.sacAm == 0) gain = gain.mul(100)
  //powers
  let pow = new Decimal(1);
  pow = pow.add(new Decimal(player.mr.challenges[21]).mul(0.1))
  if (hasMilestone("m",9)) pow = pow.add(milestoneEffect("m",9))

  if(player.e.buyables[22]) pow = pow.mul(1+(player.e.buyables[22]/10))
  if (hasMilestone("m",7)) pow = pow.mul(1.1)
  if(hasUpgrade("mr",11)) pow = pow.mul(1.1)
  if(hasUpgrade("mr",21)) pow = pow.mul(1.1)
  if(hasUpgrade("mr",31)) pow = pow.mul(1.1)
  
  gain = gain.pow(pow);
  if(player.c.sacrifices[0] > 0) gain = gain.pow(0.75 ** player.c.sacrifices[0])
  
  //misc
  if(!inChallenge("mr",22)){
    if(hasUpgrade("mr",23)) gain = gain.mul(1000)

    gain = gain.mul(layers.a.achBoost())
    gain = gain.mul(new Decimal(50).pow(getBuyableAmount("mr",21)))
    gain = gain.add(new Decimal(100).pow(getBuyableAmount("mr",11)).sub(1))
  }
  
  //if(gain.gte(1e1000)) gain = gain.div(1e1000).log(2).mul(1e1000)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade("v",11)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(7200)
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){

  console.log("old version: " + oldVersion)
}