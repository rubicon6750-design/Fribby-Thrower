let fribbies = 0n
let megaFribbies = 0n
let ascensionCount = 0
let purchasedSkills = new Set()
let repeatableEchoes = 0
const ASCENSION_THRESHOLD = 1000000n
const MAX_REPEATABLE_ECHOES = 1000
// Keep the original skill IDs so existing saves remain compatible. The 49th
// node (path-12) is now the single repeatable endgame upgrade.
const skillBranches = [
  { id: "auto", name: "Automation", description: "More throws, faster cycles, and machinery that feeds itself.", count: 10 },
  { id: "cheap", name: "Cheaper Upgrades", description: "Lower regular-upgrade costs and keep each run efficient.", count: 12 },
  { id: "strong", name: "Stronger Upgrades", description: "Improve the strength and scaling of your regular upgrades.", count: 12 },
  { id: "path", name: "Ascension Path", description: "The central path opens deeper branches of the web.", count: 12 },
  { id: "click", name: "Clicking Power", description: "Sharper throws, critical hits, and powerful manual clicks.", count: 12 },
  { id: "mega", name: "Mega Fribbies", description: "Get more from each ascension and previous runs.", count: 12 },
  { id: "mini", name: "Minigame Lore", description: "Improve minigame rewards and make challenges pay off.", count: 10 }
]
const skillNames = {
  path: ["First Spark", "Pocketed Pouch", "Lucky Compass", "Branching Fate", "Runner's Rhythm", "Discount Glyph", "Minigame Lore", "Starbound Route", "Astral Focus", "Frugal Passage", "Ancient Knowledge", "Ascendant Heart", "Eternal Echo"],
  strong: ["Reinforced Grip", "Automation Manual", "Budget Blueprint", "Spare Gear", "Compound Crew", "Double Shift", "Cannon Lathing", "Idle Logistics", "Minigame Playbook", "Torque Calibration", "Factory Foreman", "Grand Foundry"],
  click: ["Quick Tap", "Steady Aim", "Split-Second", "Heavy Disc", "Double Grip", "Charged Toss", "Cannon Synergy", "Bullseye", "Muscle Memory", "Meteor Arm", "Quick Release", "Cosmic Launch"],
  mega: ["Packed Satchel", "Lucky Star", "Deep Reserve", "Overflowing Core", "Past Lives", "Golden Harvest", "Early Ascender", "Relic Pockets", "Singular Offering", "Echo Chamber", "Infinite Bounty", "Mega Mastery"],
  cheap: ["Bulk Order", "Coupon Cache", "Lean Workshop", "Second-Hand Tools", "Supplier Pact", "Careful Spending", "Guild Discount", "Bargain Engine", "Frugal Foundry", "Wholesale Network", "Perfect Ledger", "Cost Collapse"],
  auto: ["Clockwork Wrist", "Oiled Bearings", "Double Pendulum", "Overtime Circuit", "Self-Feeding Line", "Rapid Relay", "Unattended Shift", "Assembly Swarm", "Chrono Engine", "Infinite Conveyor"],
  mini: ["Practice Round", "Prize Pouch", "Pattern Sense", "Lucky Streak", "Sweep Expert", "Bonus Round", "Arcade Scholar", "Risk Assessment", "Master Player", "Grand Champion"]
}
const skillEffects = {
  path: [
    "+1 base Fribby per click", "Start each new run with 100 Fribbies", "+10% minigame payouts", "Opens the next depth of the web", "+1 auto throw per second", "Regular upgrade costs -5%", "+15% minigame payouts", "+15% auto-throw payout", "+15% click payout", "Minigame unlocks cost -20%", "+1 base Fribby per auto throw", "+10% to click and auto gains", "+5% click and automatic gains per level; repeatable"
  ],
  strong: [
    "+15% power to regular upgrades", "+20% auto-throw payout", "Regular upgrade costs -10%", "+1 auto throw per second", "Auto payout grows by +2% per Auto Thrower", "+20% auto-throw payout", "Mega Cannon gives 50% extra click power", "+2 auto throws per second", "+20% minigame payouts", "+20% click payout", "+30% auto-throw payout", "+20% to all produced Fribbies"
  ],
  click: [
    "+1 base Fribby per click", "+15% click payout", "5% chance for a triple-value throw", "+5 base Fribbies per click", "Each Extra Hand adds another click Fribby", "+25% click payout", "Each Fribby Cannon adds +2 click Fribbies", "10% chance for a triple-value throw", "Up to +100% click power from Extra Hands", "+50 base Fribbies per click", "+30% click payout", "+50% click payout"
  ],
  mega: [
    "+1 Mega Fribby on every ascension", "+10% ascension reward", "+1 Mega Fribby per 5 million Fribbies converted", "+1 Mega Fribby near the next million", "+2% reward per previous ascension", "+15% ascension reward", "+1 Mega Fribby per 5 previous ascensions", "+2 Mega Fribbies on every ascension", "+25% reward for large ascensions", "+5% reward per other Mega Fribby skill", "+3 Mega Fribbies on every ascension", "+30% ascension reward"
  ],
  cheap: ["Regular upgrade costs -4%", "Regular upgrade costs -5%", "Regular upgrade costs -6%", "Regular upgrade costs -7%", "Regular upgrade costs -8%", "Regular upgrade costs -9%", "Regular upgrade costs -10%", "Regular upgrade costs -11%", "Regular upgrade costs -12%", "Regular upgrade costs -13%", "Regular upgrade costs -14%", "Regular upgrade costs -15%"],
  auto: ["+1 auto throw per second", "+10% auto-throw payout", "+2 auto throws per second", "Auto throwers gain +5% payout each", "+15% auto-throw payout", "Auto Throwers add +1 Fribby to each automatic throw", "+2 auto throws per second", "Each Turbo Thrower adds +2 Fribbies to automatic throws", "+25% auto-throw payout", "+40% auto payout, +5 base Fribbies, and +5 throws/sec"],
  mini: ["Minigame rewards +10%", "Minigame unlock costs -10%", "+5% minigame rewards per unlocked game", "Minigame rewards +15%", "Minigame rewards +25%", "Minigame rewards +20%", "Ascension reward +2% per unlocked minigame", "Minigame rewards +25%", "Minigame rewards +30%", "All minigame rewards +40%"]
}
const skillBranchOrder = ["auto", "cheap", "strong", "path", "click", "mega", "mini"]
const skillNodeIcons = { path: "✦", strong: "⚒", click: "➤", mega: "✧", cheap: "¤", auto: "⚙", mini: "✹" }
const skillNodeIconSets = {
  path: ["✦", "✧", "⟡", "✥", "⌁", "✶", "⟁", "☼", "✺", "◇", "✴", "❖", "✴"],
  strong: ["⚒", "⚙", "▦", "⬢", "⌘", "♜", "⛭", "▣", "⚑", "⚗", "◈", "✹"],
  click: ["➤", "➶", "⌖", "◉", "≫", "⚡", "✸", "◎", "➳", "✹", "➷", "✴"],
  mega: ["✧", "◇", "◈", "✥", "☼", "✴", "⟡", "❖", "✹", "⬡", "✺", "✦"],
  cheap: ["¤", "↓", "◉", "⌗", "▱", "⊖", "⌁", "⌘", "▣", "◌", "⟐", "✧"],
  auto: ["⚙", "⟳", "≫", "⌛", "⤳", "⇢", "⏩", "♻", "⌬", "✴"],
  mini: ["✹", "▣", "⌘", "♧", "▦", "✷", "🎮", "♜", "✴", "🏆"]
}

let u0Amount = 0
let u0Cost = 10n
let u1Amount = 0
let u1Cost = 50n
let u2Amount = 0
let u2Cost = 200n
let u3Amount = 0
let u3Cost = 500n
let u4Amount = 0
let u4Cost = 1000n
let u5Amount = 0
let u5Cost = 2500n
let u6Amount = 0
let u6Cost = 5000n
let u7Amount = 0
let u7Cost = 10000n
let u8Amount = 0
let u8Cost = 25000n

let autoThrowTimer

function updateFribby() {
  document.getElementById("fribbyAmount").innerText = "Fribbies: " + formatFribbies(fribbies)
  updateAscensionUI()
  updateTabVisibility()
  saveGame()
}
function hasSkill(id) { return purchasedSkills.has(id) }
function countSkills(branch) {
  return [...purchasedSkills].filter(id => id.startsWith(branch + "-") && id !== "path-12").length
}
function pathSkillCount() {
  return [...purchasedSkills].filter(id => /^path-(?:[0-9]|1[01])$/.test(id)).length
}
function getRegularUpgradeCost(cost) {
  const cheapDiscounts = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  let discount = (hasSkill("path-5") ? 5 : 0) + (hasSkill("strong-2") ? 10 : 0)
  cheapDiscounts.forEach((amount, index) => { if (hasSkill(`cheap-${index}`)) discount += amount })
  discount = Math.min(80, discount)
  const price = BigInt(100 - discount) * cost / 100n
  return price > 0n ? price : 1n
}
function getMinigameUnlockPrice() {
  let discount = hasSkill("path-9") ? 20 : 0
  if (hasSkill("mini-1")) discount += 10
  return (minigameUnlockCost * BigInt(100 - discount) / 100n) || 1n
}
function getMinigameRewardMultiplierPercent() {
  let bonus = (hasSkill("path-2") ? 10 : 0) + (hasSkill("path-6") ? 15 : 0) + (hasSkill("strong-8") ? 20 : 0)
  const miniBonuses = [10, 0, 0, 15, 25, 20, 0, 25, 30, 40]
  miniBonuses.forEach((amount, index) => { if (hasSkill(`mini-${index}`)) bonus += amount })
  if (hasSkill("mini-2")) bonus += unlockedMinigames * 5
  return 100 + bonus
}
function getMinigamePayout(baseReward) {
  return BigInt(baseReward) * BigInt(getFribbiesPerClick()) * BigInt(getMinigameRewardMultiplierPercent()) / 100n
}
function getAutoThrowsPerSecond() {
  return u1Amount + u7Amount * 5 + (hasSkill("path-4") ? 1 : 0) + (hasSkill("strong-3") ? 1 : 0) + (hasSkill("strong-7") ? 2 : 0)
    + (hasSkill("auto-0") ? 1 : 0) + (hasSkill("auto-2") ? 2 : 0) + (hasSkill("auto-6") ? 2 : 0) + (hasSkill("auto-9") ? 5 : 0)
}
function getClickBonusPercent() {
  return 100
    + (hasSkill("strong-0") ? 15 : 0)
    + (hasSkill("strong-9") ? 20 : 0)
    + (hasSkill("strong-11") ? 20 : 0)
    + (hasSkill("click-1") ? 15 : 0)
    + (hasSkill("click-5") ? 25 : 0)
    + (hasSkill("click-10") ? 30 : 0)
    + (hasSkill("click-11") ? 50 : 0)
    + (hasSkill("click-8") ? Math.min(100, u0Amount) : 0)
    + (hasSkill("path-8") ? 15 : 0)
    + (hasSkill("path-11") ? 10 : 0)
    + (repeatableEchoes * 5)
}
function getAutoBonusPercent() {
  return 100
    + (hasSkill("strong-0") ? 15 : 0)
    + (hasSkill("strong-1") ? 20 : 0)
    + (hasSkill("strong-5") ? 20 : 0)
    + (hasSkill("strong-10") ? 30 : 0)
    + (hasSkill("strong-11") ? 20 : 0)
    + (hasSkill("path-7") ? 15 : 0)
    + (hasSkill("path-11") ? 10 : 0)
    + (hasSkill("strong-4") ? Math.min(50, u1Amount * 2) : 0)
    + (hasSkill("auto-1") ? 10 : 0)
    + (hasSkill("auto-3") ? Math.min(50, u1Amount * 5) : 0)
    + (hasSkill("auto-4") ? 15 : 0)
    + (hasSkill("auto-8") ? 25 : 0)
    + (hasSkill("auto-9") ? 40 : 0)
    + (repeatableEchoes * 5)
}
function refreshUpgradeLabels() {
  const labels = [
    `Extra Hand (${u0Amount}, +1 Fribby per click) - ${getRegularUpgradeCost(u0Cost)} Fribbies`,
    `Auto Thrower (${u1Amount}, +1 auto throw/sec) - ${getRegularUpgradeCost(u1Cost)} Fribbies`,
    `Intern (${u2Amount}, +1 Fribby per auto throw) - ${getRegularUpgradeCost(u2Cost)} Fribbies`,
    `Fribby Cannon (${u3Amount}, +5 Fribbies per click) - ${getRegularUpgradeCost(u3Cost)} Fribbies`,
    `Supervisor (${u4Amount}, +5 Fribbies per auto throw) - ${getRegularUpgradeCost(u4Cost)} Fribbies`,
    `Power Throw (${u5Amount}, +10 Fribbies per click) - ${getRegularUpgradeCost(u5Cost)} Fribbies`,
    `Fribby Factory (${u6Amount}, +10 Fribbies per auto throw) - ${getRegularUpgradeCost(u6Cost)} Fribbies`,
    `Turbo Thrower (${u7Amount}, +5 auto throws/sec) - ${getRegularUpgradeCost(u7Cost)} Fribbies`,
    `Mega Cannon (${u8Amount}, +${hasSkill("strong-6") ? 150 : 100} Fribbies per click) - ${getRegularUpgradeCost(u8Cost)} Fribbies`
  ]
  labels.forEach((label, index) => {
    const button = document.getElementById(`upgrade${index}`)
    if (button) button.textContent = label
  })
}
function getFribbiesPerClick() {
  let base = u0Amount + 1 + u3Amount * 5 + u5Amount * 10 + u8Amount * (hasSkill("strong-6") ? 150 : 100)
  if (hasSkill("path-0")) base += 1
  if (hasSkill("path-8")) base += 0
  if (hasSkill("click-0")) base += 1
  if (hasSkill("click-3")) base += 5
  if (hasSkill("click-4")) base += u0Amount
  if (hasSkill("click-6")) base += u3Amount * 2
  if (hasSkill("click-9")) base += 50
  return Math.max(1, Math.floor(base * getClickBonusPercent() / 100))
}
function getAutoThrowReward() {
  let base = 1 + u2Amount + u4Amount * 5 + u6Amount * 10
  if (hasSkill("path-1")) base += 1
  if (hasSkill("path-10")) base += 1
  if (hasSkill("auto-5")) base += u1Amount
  if (hasSkill("auto-7")) base += u7Amount * 2
  if (hasSkill("auto-9")) base += 5
  return Math.max(1, Math.floor(base * getAutoBonusPercent() / 100))
}

function throwFribby() {
  playSoundEffect("throwSound")
  let gain = getFribbiesPerClick()
  const criticalChance = (hasSkill("click-2") ? 5 : 0) + (hasSkill("click-7") ? 10 : 0)
  if (criticalChance > 0 && Math.random() * 100 < criticalChance) gain *= 3
  fribbies += BigInt(gain)
  updateFribby()
}

function buy0() {
  const purchaseCost = getRegularUpgradeCost(u0Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   fribbies -= purchaseCost
   u0Amount += 1
   u0Cost = u0Cost * 3n
   updateFribby()
   document.getElementById("upgrade0").innerText =
        "Extra Hand - (" + u0Amount + ", +1 Fribby per click) - " + u0Cost + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy1() {
  const purchaseCost = getRegularUpgradeCost(u1Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   fribbies -= purchaseCost
      u1Amount += 1
   u1Cost = (u1Cost * 3n + 1n) / 2n
   updateFribby()
   document.getElementById("upgrade1").innerText =
        "Auto Thrower (" + u1Amount + ", +1 auto throw/sec) - " + u1Cost + " Fribbies"
   refreshUpgradeLabels()
   updateAutoThrowInterval()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy2() {
  const purchaseCost = getRegularUpgradeCost(u2Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   fribbies -= purchaseCost
      u2Amount += 1
   u2Cost = (u2Cost * 3n + 1n) / 2n
   updateFribby()
   document.getElementById("upgrade2").innerText =
        "Intern (" + u2Amount + ", +1 Fribby per auto throw) - " + u2Cost + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy3() {
  const purchaseCost = getRegularUpgradeCost(u3Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
    fribbies -= purchaseCost
    u3Amount += 1
    u3Cost = (u3Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade3").innerText =
      "Fribby Cannon (" + u3Amount + ", +5 Fribbies per click) - " + u3Cost + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy4() {
  const purchaseCost = getRegularUpgradeCost(u4Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
    fribbies -= purchaseCost
    u4Amount += 1
    u4Cost = (u4Cost * 3n + 1n) / 2n
    updateFribby()
       document.getElementById("upgrade4").innerText =
        "Supervisor (" + u4Amount + ", +5 Fribbies per auto throw) - " + u4Cost + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy5() {
  const purchaseCost = getRegularUpgradeCost(u5Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
    fribbies -= purchaseCost
    u5Amount += 1
    u5Cost = (u5Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade5").innerText =
      "Power Throw (" + u5Amount + ", +10 Fribbies per click) - " + u5Cost + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy6() {
  const purchaseCost = getRegularUpgradeCost(u6Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
    fribbies -= purchaseCost
    u6Amount += 1
    u6Cost = (u6Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade6").innerText =
      "Fribby Factory (" + u6Amount + ", +10 Fribbies per auto throw) - " + u6Cost + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy7() {
  const purchaseCost = getRegularUpgradeCost(u7Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
    fribbies -= purchaseCost
    u7Amount += 1
    u7Cost = (u7Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade7").innerText =
      "Turbo Thrower (" + u7Amount + ", +5 auto throws/sec) - " + u7Cost + " Fribbies"
   refreshUpgradeLabels()
    updateAutoThrowInterval()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy8() {
  const purchaseCost = getRegularUpgradeCost(u8Cost)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
    fribbies -= purchaseCost
    u8Amount += 1
    u8Cost = (u8Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade8").innerText =
      "Mega Cannon (" + u8Amount + ", +100 Fribbies per click) - " + u8Cost + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function updateAutoThrowInterval() {
  clearInterval(autoThrowTimer)
  const autoThrowsPerSecond = getAutoThrowsPerSecond()
  if (autoThrowsPerSecond <= 0) return
  autoThrowTimer = setInterval(function() {
    fribbies += BigInt(getAutoThrowReward())
    updateFribby()
  }, 1000 / autoThrowsPerSecond)
}

function skillIndexToId(index) {
  if (index < 13) return `path-${index}`
  if (index < 25) return `strong-${index - 13}`
  if (index < 37) return `click-${index - 25}`
  if (index < 49) return `mega-${index - 37}`
  if (index < 61) return `cheap-${index - 49}`
  if (index < 71) return `auto-${index - 61}`
  if (index < 81) return `mini-${index - 71}`
  return null
}
function skillIdToIndex(id) {
  const match = /^(path|strong|click|mega|cheap|auto|mini)-(\d+)$/.exec(id)
  if (!match) return -1
  const offset = { path: 0, strong: 13, click: 25, mega: 37, cheap: 49, auto: 61, mini: 71 }[match[1]]
  const number = Number(match[2])
  const limit = { path: 13, strong: 12, click: 12, mega: 12, cheap: 12, auto: 10, mini: 10 }[match[1]]
  return number >= 0 && number < limit ? offset + number : -1
}
function isRepeatableSkillId(id) { return id === "path-12" }
function hasAllCoreSkills() {
  return pathSkillCount() === 12
    && skillBranches.filter(branch => branch.id !== "path").every(branch => countSkills(branch.id) === branch.count)
}
function repeatableEchoCost() {
  return 10n * (3n ** BigInt(repeatableEchoes))
}
function updateAscensionUI() {
  const label = document.getElementById("megaFribbyAmount")
  const button = document.getElementById("ascendButton")
  if (label) label.textContent = `Mega Fribbies: ${formatFribbies(megaFribbies)} · Ascensions: ${ascensionCount}`
  if (button) button.hidden = fribbies < ASCENSION_THRESHOLD
  refreshUpgradeLabels()
  updateSkillTreeButtons()
  updateMinigameUnlockButton()
}
function calculateAscensionReward() {
  const baseReward = fribbies / ASCENSION_THRESHOLD
  let percent = 100
  percent += hasSkill("mega-1") ? 10 : 0
  percent += hasSkill("mega-4") ? ascensionCount * 2 : 0
  percent += hasSkill("mega-5") ? 15 : 0
  percent += hasSkill("mega-8") && baseReward >= 10n ? 25 : 0
  percent += hasSkill("mega-9") ? Math.max(0, countSkills("mega") - 1) * 5 : 0
  percent += hasSkill("mega-11") ? 30 : 0
  let reward = baseReward * BigInt(percent) / 100n
  if (hasSkill("mega-0")) reward += 1n
  if (hasSkill("mega-2")) reward += baseReward / 5n
  if (hasSkill("mega-3") && fribbies % ASCENSION_THRESHOLD >= 750000n) reward += 1n
  if (hasSkill("mega-6")) reward += BigInt(Math.floor(ascensionCount / 5))
  if (hasSkill("mega-7")) reward += 2n
  if (hasSkill("mega-10")) reward += 3n
  return reward > 0n ? reward : 1n
}
function ascend() {
  if (fribbies < ASCENSION_THRESHOLD) return
  const reward = calculateAscensionReward()
  if (!confirm(`Ascend and gain ${formatFribbies(reward)} Mega Fribbies? This resets your Fribbies, regular upgrades, and minigame unlocks.`)) return
  megaFribbies += reward
  ascensionCount++
  fribbies = hasSkill("path-1") ? 100n : 0n
  u0Amount=0; u0Cost=10n; u1Amount=0; u1Cost=50n; u2Amount=0; u2Cost=200n
  u3Amount=0; u3Cost=500n; u4Amount=0; u4Cost=1000n; u5Amount=0; u5Cost=2500n
  u6Amount=0; u6Cost=5000n; u7Amount=0; u7Cost=10000n; u8Amount=0; u8Cost=25000n
  clearInterval(autoThrowTimer)
  unlockedMinigames = 0; minigameUnlockCost = 2500n
  document.querySelectorAll("[data-minigame]").forEach(button => button.hidden = true)
  document.getElementById("minigamesArea").hidden = true
  const defaults = ["Extra Hand (0, +1 Fribby per click) - 10 Fribbies", "Auto Thrower (0, +1 auto throw/sec) - 50 Fribbies", "Intern (0, +1 Fribby per auto throw) - 200 Fribbies", "Fribby Cannon (0, +5 Fribbies per click) - 500 Fribbies", "Supervisor (0, +5 Fribbies per auto throw) - 1000 Fribbies", "Power Throw (0, +10 Fribbies per click) - 2500 Fribbies", "Fribby Factory (0, +10 Fribbies per auto throw) - 5000 Fribbies", "Turbo Thrower (0, +5 auto throws/sec) - 10000 Fribbies", "Mega Cannon (0, +100 per click) - 25000 Fribbies"]
  defaults.forEach((label, i) => document.getElementById(`upgrade${i}`).textContent = label)
  updateMinigameUnlockButton()
  const status = document.getElementById("ascensionStatus")
  if (status) status.textContent = `Ascended! You gained ${formatFribbies(reward)} Mega Fribbies.`
  playSoundEffect("minigameCompleteSound")
  updateFribby()
  if (getAutoThrowsPerSecond() > 0) updateAutoThrowInterval()
  saveGame()
  triggerAscensionEffect(reward, ascensionCount)
}

// Lightweight, DOM-generated celebration effects. No images or external libraries required.
function motionIsReduced() {
  return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
}
function makeElement(tag, className, text) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text !== undefined) element.textContent = text
  return element
}
function triggerAscensionEffect(reward, ascensions) {
  const previous = document.getElementById("ascensionFxOverlay")
  if (previous) previous.remove()
  const reduced = motionIsReduced()
  const overlay = makeElement("div", "ascension-fx-overlay")
  overlay.id = "ascensionFxOverlay"
  overlay.setAttribute("aria-hidden", "true")

  const stars = makeElement("div", "ascension-fx-stars")
  if (!reduced) {
    for (let i = 0; i < 42; i++) {
      const star = makeElement("i", "ascension-fx-star")
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.setProperty("--drift-x", `${Math.round((Math.random() - .5) * 220)}px`)
      star.style.setProperty("--drift-y", `${Math.round((Math.random() - .5) * 220)}px`)
      star.style.setProperty("--delay", `${Math.random() * 420}ms`)
      star.style.setProperty("--size", `${2 + Math.random() * 5}px`)
      stars.appendChild(star)
    }
  }
  const vortex = makeElement("div", "ascension-fx-vortex")
  vortex.append(makeElement("span", "ascension-fx-ring ring-one"), makeElement("span", "ascension-fx-ring ring-two"), makeElement("span", "ascension-fx-ring ring-three"))
  vortex.appendChild(makeElement("div", "ascension-fx-core", "✦"))
  const copy = makeElement("div", "ascension-fx-copy")
  copy.appendChild(makeElement("strong", "ascension-fx-title", "ASCENSION AWAKENED"))
  copy.appendChild(makeElement("span", "ascension-fx-reward", `+${formatFribbies(reward)} MEGA FRIBBIES`))
  copy.appendChild(makeElement("small", "ascension-fx-count", `Ascension ${ascensions} · A new cycle begins`))
  overlay.append(stars, vortex, copy)
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add("is-live"))
  const fadeDelay = reduced ? 500 : 2150
  const removeDelay = reduced ? 950 : 2900
  window.setTimeout(() => overlay.classList.add("is-exiting"), fadeDelay)
  window.setTimeout(() => overlay.remove(), removeDelay)
}
function makeSkillParticles(button, count, hues = [145, 165, 270, 45]) {
  const existing = button.querySelector(".skill-fx-particles")
  if (existing) existing.remove()
  if (motionIsReduced()) return
  const particles = makeElement("span", "skill-fx-particles")
  particles.setAttribute("aria-hidden", "true")
  for (let i = 0; i < count; i++) {
    const particle = makeElement("i", "skill-fx-particle")
    particle.style.setProperty("--angle", `${(360 / count) * i + Math.random() * 14}deg`)
    particle.style.setProperty("--distance", `${28 + Math.random() * 38}px`)
    particle.style.setProperty("--delay", `${Math.random() * 90}ms`)
    particle.style.setProperty("--hue", String(hues[i % hues.length] + Math.round(Math.random() * 16 - 8)))
    particles.appendChild(particle)
  }
  button.appendChild(particles)
  window.setTimeout(() => particles.remove(), 1100)
}
function findSkillNode(id) {
  return [...document.querySelectorAll(".skill-node[data-skill-id]")].find(node => node.dataset.skillId === id) || null
}
function triggerSkillUnlockEffect(id) {
  const button = findSkillNode(id)
  if (!button) return
  button.classList.remove("skill-unlock-flash")
  // Force a reflow so consecutive unlocks can replay the animation.
  void button.offsetWidth
  button.classList.add("skill-unlock-flash")
  makeSkillParticles(button, 12)
  window.setTimeout(() => button.classList.remove("skill-unlock-flash"), motionIsReduced() ? 250 : 950)
}
function triggerRungRevealEffect(button) {
  button.classList.remove("skill-rung-reveal")
  void button.offsetWidth
  button.classList.add("skill-rung-reveal")
  makeSkillParticles(button, 7, [180, 195, 265])
  window.setTimeout(() => button.classList.remove("skill-rung-reveal"), motionIsReduced() ? 250 : 1200)
}
function triggerEternalEchoEffect(level) {
  const button = findSkillNode("path-12")
  if (button) {
    button.classList.remove("eternal-echo-purchase")
    void button.offsetWidth
    button.classList.add("eternal-echo-purchase")
    makeSkillParticles(button, 20, [38, 46, 52, 275, 290])
    window.setTimeout(() => button.classList.remove("eternal-echo-purchase"), motionIsReduced() ? 250 : 1450)
  }
  const toast = makeElement("div", "eternal-echo-toast")
  toast.setAttribute("aria-hidden", "true")
  toast.appendChild(makeElement("strong", "", "ETERNAL ECHO"))
  toast.appendChild(makeElement("span", "", `Mastery level ${level} acquired`))
  document.body.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add("is-live"))
  window.setTimeout(() => toast.remove(), motionIsReduced() ? 600 : 1900)
}
let cachedSkillGraph = null
let cachedSkillGraphById = null
function getSkillGraph() {
  if (cachedSkillGraph) return cachedSkillGraph
  const graph = []
  const coreX = 905
  const rowGap = 112
  const pathY = index => 125 + index * rowGap
  const zig = index => index % 2 ? 28 : -18
  graph.push({ id: "core", x: coreX, y: 42, parents: [], core: true })
  for (let i = 0; i < 12; i++) {
    graph.push({ id: `path-${i}`, branch: "path", index: i, x: coreX + zig(i) * .35, y: pathY(i), parents: [i === 0 ? "core" : `path-${i - 1}`] })
  }
  graph.push({ id: "workshop-hub", hub: true, x: 580, y: 230, parents: ["path-0"] })
  for (let i = 0; i < 12; i++) {
    graph.push({ id: `strong-${i}`, branch: "strong", index: i, x: 690 + zig(i), y: pathY(i) + (i === 0 ? 95 : 32), parents: [ ...(i ? [`path-${i}`, `strong-${i - 1}`] : ["workshop-hub"]) ] })
    graph.push({ id: `click-${i}`, branch: "click", index: i, x: 1120 - zig(i), y: pathY(i) + 38 + (i % 3 === 0 ? 12 : 0), parents: [ `path-${i}`, ...(i ? [`click-${i - 1}`] : []) ] })
    graph.push({ id: `mega-${i}`, branch: "mega", index: i, x: 1335 + zig(i), y: pathY(i) + 52 + (i % 2 ? 20 : 0), parents: [ `path-${i}`, ...(i ? [`mega-${i - 1}`] : []) ] })
    graph.push({ id: `cheap-${i}`, branch: "cheap", index: i, x: 475 - zig(i), y: pathY(i) + 180 + (i % 2 ? 18 : 0), parents: [ ...(i ? [`path-${i}`, `cheap-${i - 1}`, `strong-${Math.min(11, i + 1)}`] : ["workshop-hub"]) ] })
    if (i < 10) {
      graph.push({ id: `auto-${i}`, branch: "auto", index: i, x: 260 + zig(i), y: pathY(i) + 270 + (i % 2 ? 15 : 0), parents: [ `strong-${Math.min(11, i + 2)}`, ...(i ? [`auto-${i - 1}`] : []) ] })
      graph.push({ id: `mini-${i}`, branch: "mini", index: i, x: 1550 - zig(i), y: pathY(i) + 260 + (i % 3 === 0 ? 23 : 0), parents: [ `path-${Math.min(11, i + 2)}`, ...(i ? [`mini-${i - 1}`] : []) ] })
    }
  }
  graph.push({ id: "path-12", branch: "path", index: 12, x: coreX + 20, y: pathY(11) + 380, parents: ["path-11", "strong-11", "click-11", "mega-11", "cheap-11", "auto-9", "mini-9"] })
  cachedSkillGraph = graph
  cachedSkillGraphById = new Map(graph.map(node => [node.id, node]))
  return graph
}
function skillNodeLabel(id) {
  const [branch, rawIndex] = id.split("-")
  const index = Number(rawIndex)
  const name = skillNames[branch]?.[index] || "Unknown skill"
  const effect = skillEffects[branch]?.[index] || ""
  return `${name}. ${effect}.`
}
function createSkillNode(nodeData) {
  const id = typeof nodeData === "string" ? nodeData : nodeData.id
  const [branch, rawIndex] = id.split("-")
  const index = Number(rawIndex)
  const wrapper = document.createElement("div")
  wrapper.className = `skill-node-wrap branch-${branch}`
  wrapper.dataset.skillId = id
  const graphNode = typeof nodeData === "string" ? getSkillGraph().find(node => node.id === id) : nodeData
  if (graphNode) {
    wrapper.style.left = `${graphNode.x - 75}px`
    wrapper.style.top = `${graphNode.y - 34}px`
  }
  const button = document.createElement("button")
  button.type = "button"
  button.className = "skill-node"
  button.dataset.skillId = id
  button.setAttribute("aria-label", skillNodeLabel(id))
  button.onclick = () => buySkill(id)
  const icon = document.createElement("span")
  icon.className = "skill-node-icon"
  icon.setAttribute("aria-hidden", "true")
  icon.textContent = skillNodeIconSets[branch]?.[index] || skillNodeIcons[branch] || "✦"
  const name = document.createElement("span")
  name.className = "skill-node-name"
  name.hidden = true
  const effect = document.createElement("span")
  effect.className = "skill-node-effect"
  effect.hidden = true
  const footer = document.createElement("span")
  footer.className = "skill-node-footer"
  footer.hidden = true
  button.append(icon, name, effect, footer)
  const caption = document.createElement("div")
  caption.className = "skill-node-caption"
  const captionName = document.createElement("strong")
  captionName.className = "skill-node-caption-name"
  const captionCost = document.createElement("span")
  captionCost.className = "skill-node-caption-cost"
  caption.append(captionName, captionCost)
  const tooltip = document.createElement("span")
  tooltip.className = "skill-node-tooltip"
  tooltip.textContent = skillNodeLabel(id)
  caption.appendChild(tooltip)
  wrapper.append(button, caption)
  return wrapper
}
function renderSkillTree() {
  const tree = document.getElementById("skillTree")
  if (!tree) return
  tree.innerHTML = ""
  const graph = getSkillGraph()
  const map = document.createElement("div")
  map.className = "skill-tree-map skill-web-map"
  map.setAttribute("aria-label", "Branching ascension upgrade web")
  const svgNS = "http://www.w3.org/2000/svg"
  const edges = document.createElementNS(svgNS, "svg")
  edges.classList.add("skill-tree-edges")
  edges.setAttribute("viewBox", "0 0 1850 2000")
  edges.setAttribute("preserveAspectRatio", "xMinYMin meet")
  const graphById = new Map(graph.map(node => [node.id, node]))
  graph.forEach(node => {
    node.parents.forEach(parentId => {
      const parent = graphById.get(parentId)
      if (!parent) return
      const path = document.createElementNS(svgNS, "path")
      const startX = parent.x, startY = parent.y + (parent.core ? 22 : parent.hub ? 27 : 34)
      const endX = node.x, endY = node.y - (node.hub ? 27 : 34)
      const midY = (startY + endY) / 2
      path.setAttribute("d", `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`)
      path.setAttribute("class", `skill-edge edge-${node.branch || "core"}`)
      path.dataset.to = node.id
      path.dataset.from = parentId
      edges.appendChild(path)
    })
  })
  map.appendChild(edges)
  const origin = document.createElement("div")
  origin.className = "skill-tree-origin skill-web-origin"
  origin.innerHTML = '<span class="origin-star" aria-hidden="true">✦</span><strong>FRIBBY CORE</strong><span>Start the web</span>'
  origin.style.left = `${graph[0].x}px`
  origin.style.top = `${graph[0].y}px`
  map.appendChild(origin)
  const hub = graph.find(node => node.hub)
  if (hub) {
    const hubEl = document.createElement("div")
    hubEl.className = "skill-web-hub"
    hubEl.style.left = `${hub.x}px`
    hubEl.style.top = `${hub.y}px`
    hubEl.innerHTML = '<span>⚒</span><strong>UPGRADE WORKSHOP</strong><small>Choose a specialization</small>'
    map.appendChild(hubEl)
  }
  graph.filter(node => !node.core && !node.hub).forEach(node => map.appendChild(createSkillNode(node)))
  const legends = document.createElement("div")
  legends.className = "skill-web-legend"
  skillBranches.forEach(branch => {
    const item = document.createElement("span")
    item.className = `web-legend-item branch-${branch.id}`
    item.innerHTML = `<i>${skillNodeIcons[branch.id]}</i><strong>${branch.name}</strong>`
    legends.appendChild(item)
  })
  tree.append(legends, map)
  updateSkillTreeButtons()
}
function isSkillAvailable(id) {
  if (isRepeatableSkillId(id)) return hasAllCoreSkills() && repeatableEchoes < MAX_REPEATABLE_ECHOES
  if (purchasedSkills.has(id)) return false
  getSkillGraph()
  const node = cachedSkillGraphById.get(id)
  if (!node || node.core) return false
  return node.parents.every(parentId => parentId === "core"
    || (parentId === "workshop-hub" ? purchasedSkills.has("path-0") : false)
    || (parentId === "path-12" ? repeatableEchoes > 0 : purchasedSkills.has(parentId)))
}
function skillCost(id) {
  if (isRepeatableSkillId(id)) return repeatableEchoCost()
  const [branch, rawIndex] = id.split("-")
  const index = Number(rawIndex)
  const base = { path: 2n, strong: 3n, click: 3n, mega: 2n, cheap: 4n, auto: 4n, mini: 4n }[branch] || 3n
  // Each node multiplies the next cost; later subdivisions quickly become long-term goals.
  return base ** BigInt(index)
}
function updateSkillTreeButtons() {
  document.querySelectorAll(".skill-node").forEach(button => {
    const id = button.dataset.skillId
    if (!id) return
    const [branch, rawIndex] = id.split("-")
    const index = Number(rawIndex)
    const repeatable = isRepeatableSkillId(id)
    const purchased = repeatable ? repeatableEchoes > 0 : purchasedSkills.has(id)
    const available = isSkillAvailable(id)
    const cost = skillCost(id)
    const name = skillNames[branch][index]
    const effect = skillEffects[branch][index]
    const nameSpan = button.querySelector(".skill-node-name")
    const effectSpan = button.querySelector(".skill-node-effect")
    const footer = button.querySelector(".skill-node-footer")
    if (nameSpan) nameSpan.textContent = name
    if (effectSpan) effectSpan.textContent = effect
    if (footer) footer.textContent = repeatable
      ? `Level ${repeatableEchoes} · ${formatFribbies(cost)} Mega Fribbies`
      : purchased ? "✓ Unlocked" : `${formatFribbies(cost)} Mega Fribbies`
    button.title = `${name}: ${effect}`
    button.setAttribute("aria-label", repeatable
      ? `${name}, level ${repeatableEchoes}. ${effect}. Costs ${formatFribbies(cost)} Mega Fribbies.`
      : `${name}. ${effect}. ${purchased ? "Purchased." : `Costs ${formatFribbies(cost)} Mega Fribbies.`}`)
    button.disabled = repeatable
      ? (!available || megaFribbies < cost)
      : (!purchased && (!available || megaFribbies < cost))
    button.classList.toggle("purchased", purchased && !repeatable)
    button.classList.toggle("repeatable", repeatable)
    button.classList.toggle("locked", !purchased && !available)
    button.classList.toggle("available", !purchased && available)
    const wrapper = button.closest(".skill-node-wrap")
    if (wrapper) {
      const captionName = wrapper.querySelector(".skill-node-caption-name")
      const captionCost = wrapper.querySelector(".skill-node-caption-cost")
      if (captionName) captionName.textContent = name
      if (captionCost) captionCost.textContent = repeatable
        ? `Lv ${repeatableEchoes} · ${formatFribbies(cost)} MF`
        : purchased ? "Purchased" : `${formatFribbies(cost)} MF`
    }
  })
  document.querySelectorAll(".skill-edge[data-to]").forEach(edge => {
    const target = edge.dataset.to
    const bought = target === "path-12" ? repeatableEchoes > 0 : purchasedSkills.has(target)
    edge.classList.toggle("purchased", bought)
    edge.classList.toggle("available", !bought && isSkillAvailable(target))
  })
} 
function buySkill(id) {
  if (isRepeatableSkillId(id)) {
    if (!isSkillAvailable(id)) return
    const cost = repeatableEchoCost()
    if (megaFribbies < cost) { playSoundEffect("upgradeFailSound"); return }
    megaFribbies -= cost
    repeatableEchoes++
    playSoundEffect("upgradeSound")
    updateAscensionUI()
    saveGame()
    triggerEternalEchoEffect(repeatableEchoes)
    return
  }
  if (purchasedSkills.has(id) || !isSkillAvailable(id)) return
  const cost = skillCost(id)
  if (megaFribbies < cost) { playSoundEffect("upgradeFailSound"); return }
  const previouslyAvailable = new Set([...document.querySelectorAll(".skill-node.available")].map(node => node.dataset.skillId))
  megaFribbies -= cost
  purchasedSkills.add(id)
  playSoundEffect("upgradeSound")
  updateAscensionUI()
  triggerSkillUnlockEffect(id)
  // A central-path skill unlocks one matching rung in each outer branch.
  if (id.startsWith("path-") && !isRepeatableSkillId(id)) {
    document.querySelectorAll(".skill-node.available[data-skill-id]").forEach(node => {
      const nodeId = node.dataset.skillId
      if (!nodeId.startsWith("path-") && !previouslyAvailable.has(nodeId)) triggerRungRevealEffect(node)
    })
  }
  if (getAutoThrowsPerSecond() > 0) updateAutoThrowInterval()
  saveGame()
}

const minigameUnlockOrder = [
  "numberGuess",
  "patternRecall",
  "luckySpin",
  "matching",
  "pathFinder",
  "minesweeper"
]
let unlockedMinigames = 0
let minigameUnlockCost = 2500n

function buyMinigameUnlock() {
  const status = document.getElementById("minigameUnlockStatus")
  if (unlockedMinigames >= minigameUnlockOrder.length) return
  const unlockPrice = getMinigameUnlockPrice()
  if (fribbies < unlockPrice) {
    playSoundEffect("upgradeFailSound")
    status.textContent = `You need ${unlockPrice} Fribbies to unlock the next minigame.`
    return
  }

  fribbies -= unlockPrice
  updateFribby()
  document.getElementById("minigamesArea").hidden = false
  const game = minigameUnlockOrder[unlockedMinigames]
  unlockedMinigames++
  document.querySelector(`[data-minigame="${game}"]`).hidden = false
  minigameUnlockCost *= 2n
  status.textContent = `Unlocked ${getMinigameName(game)}!`
  showMinigame(game)
  updateMinigameUnlockButton()
  updateTabVisibility()
  saveGame()
}

function getMinigameName(game) {
  const names = {
    patternRecall: "Pattern Recall",
    luckySpin: "Roulette",
    numberGuess: "Number Guess",
    pathFinder: "Path Finder",
    matching: "Fribby Match",
    minesweeper: "Fribbysweeper"
  }
  return names[game]
}

function updateMinigameUnlockButton() {
  const button = document.getElementById("minigameUpgrade")
  if (unlockedMinigames >= minigameUnlockOrder.length) {
    button.textContent = "All Minigames Unlocked!"
    button.disabled = true
    return
  }
  button.disabled = false
  button.textContent = `Unlock Minigame (${unlockedMinigames}/6) - ${getMinigameUnlockPrice()} Fribbies`
}

function showMinigame(game) {
  if (!minigameUnlockOrder.slice(0, unlockedMinigames).includes(game)) return
  playSoundEffect("minigameStartSound")
  document.getElementById("minigame-minesweeper").hidden = game !== "minesweeper"
  document.getElementById("minigame-numberGuess").hidden = game !== "numberGuess"
  document.getElementById("minigame-matching").hidden = game !== "matching"
  document.getElementById("minigame-pathFinder").hidden = game !== "pathFinder"
  document.getElementById("minigame-patternRecall").hidden = game !== "patternRecall"
  document.getElementById("minigame-luckySpin").hidden = game !== "luckySpin"
}

let numberGuessTarget = 0
let numberGuessActive = false

function startNumberGuess() {
  numberGuessTarget = Math.floor(Math.random() * 20) + 1
  numberGuessActive = true
  document.getElementById("numberGuessInput").value = ""
  document.getElementById("numberGuessStatus").textContent = "A Fribby number is ready. Take a guess!"
}

function checkNumberGuess() {
  const input = document.getElementById("numberGuessInput")
  const guess = Number(input.value)
  const status = document.getElementById("numberGuessStatus")

  if (!numberGuessActive) {
    status.textContent = "Deal a Fribby number first!"
    return
  }
  if (!Number.isInteger(guess) || guess < 1 || guess > 20) {
    status.textContent = "Enter a whole-number Fribby guess from 1 to 20."
    return
  }
  if (guess === numberGuessTarget) {
    numberGuessActive = false
    fribbies += getMinigamePayout(100)
    playSoundEffect("minigameCompleteSound")
    updateFribby()
    status.textContent = "Correct! You earned 100 Fribbies."
  } else {
    status.textContent = guess < numberGuessTarget ? "Too low—try again!" : "Too high—try again!"
  }
}

const matchingSymbols = ["🥏", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚪"]
let matchingCards = []
let matchingFirstCard = null
let matchingLocked = false
let matchingMatches = 0
let matchingHideTimer

function createMatchingGame() {
  clearTimeout(matchingHideTimer)
  matchingCards = [...matchingSymbols, ...matchingSymbols]
  for (let i = matchingCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[matchingCards[i], matchingCards[j]] = [matchingCards[j], matchingCards[i]]
  }

  matchingFirstCard = null
  matchingLocked = false
  matchingMatches = 0
  const board = document.getElementById("matchingBoard")
  board.innerHTML = ""
  matchingCards.forEach((symbol, index) => {
    const card = document.createElement("button")
    card.type = "button"
    card.className = "matching-card"
        card.textContent = "🥏"
    card.setAttribute("aria-label", `Face-down Fribby card ${index + 1}`)
    card.addEventListener("click", () => revealMatchingCard(index))
    board.appendChild(card)
  })
  document.getElementById("matchingStatus").textContent = "Find the matching flying discs!"
}

function revealMatchingCard(index) {
  if (matchingLocked) return
  const card = document.getElementById("matchingBoard").children[index]
  if (card.classList.contains("matched") || card === matchingFirstCard) return

  card.textContent = matchingCards[index]
  card.classList.add("revealed")
  card.setAttribute("aria-label", `Card ${index + 1}: ${matchingCards[index]}`)

  if (!matchingFirstCard) {
    matchingFirstCard = card
    return
  }

  if (matchingFirstCard.textContent === card.textContent) {
    matchingFirstCard.classList.add("matched")
    card.classList.add("matched")
    matchingFirstCard = null
    matchingMatches++
    if (matchingMatches === matchingSymbols.length) {
      fribbies += getMinigamePayout(150)
      playSoundEffect("minigameCompleteSound")
      updateFribby()
      document.getElementById("matchingStatus").textContent = "You found every pair! You earned 150 Fribbies."
    } else {
      document.getElementById("matchingStatus").textContent = `Pairs found: ${matchingMatches} of ${matchingSymbols.length}.`
    }
    return
  }

  matchingLocked = true
  const firstCard = matchingFirstCard
  matchingFirstCard = null
  matchingHideTimer = setTimeout(() => {
        firstCard.textContent = "🥏"
    firstCard.classList.remove("revealed")
    firstCard.setAttribute("aria-label", "Face-down Fribby card")
    card.textContent = "🥏"
    card.classList.remove("revealed")
    card.setAttribute("aria-label", "Face-down Fribby card")
    matchingLocked = false
  }, 800)
}

const minesweeperRows = 8
const minesweeperColumns = 10
let minesweeperGrid = []
let minesweeperGameOver = true

function createMinesweeper() {
  const mineCount = 12 + Math.floor(Math.random() * 4)
  const board = document.getElementById("minesweeperBoard")
  const status = document.getElementById("minesweeperStatus")
  const total = minesweeperRows * minesweeperColumns
  let generated = null

  // Generate boards only when a deterministic Minesweeper solver can finish
  // them from a guaranteed zero tile. This avoids forced guesses.
  for (let attempt = 0; !generated; attempt++) {
    const positions = Array.from({ length: total }, (_, i) => i)
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[positions[i], positions[j]] = [positions[j], positions[i]]
    }
    const grid = Array.from({ length: minesweeperRows }, () =>
      Array.from({ length: minesweeperColumns }, () => ({ mine: false, nearby: 0, revealed: false, flagged: false }))
    )
    for (let i = 0; i < mineCount; i++) {
      const position = positions[i]
      grid[Math.floor(position / minesweeperColumns)][position % minesweeperColumns].mine = true
    }
    for (let r = 0; r < minesweeperRows; r++) {
      for (let c = 0; c < minesweeperColumns; c++) {
        if (!grid[r][c].mine) grid[r][c].nearby = countNearbyMinesInGrid(grid, r, c)
      }
    }
    const zeroes = []
    for (let r = 0; r < minesweeperRows; r++) for (let c = 0; c < minesweeperColumns; c++) {
      if (!grid[r][c].mine && grid[r][c].nearby === 0) zeroes.push({ row: r, column: c })
    }
    // Use a random zero as the starting reveal, so the player never has to
    // guess the opening move either.
    for (let i = zeroes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[zeroes[i], zeroes[j]] = [zeroes[j], zeroes[i]]
    }
    for (const start of zeroes) {
      if (isMinesweeperGridSolvable(grid, start.row, start.column)) {
        generated = { grid, start }
        break
      }
    }
  }

  // Extremely rare fallback: a deliberately structured, logic-solvable board.
  if (!generated) generated = createFallbackNoGuessBoard(mineCount)
  minesweeperGrid = generated.grid
  minesweeperGameOver = false

  board.innerHTML = ""
  for (let row = 0; row < minesweeperRows; row++) {
    for (let column = 0; column < minesweeperColumns; column++) {
      const tile = document.createElement("button")
      tile.type = "button"
      tile.className = "minesweeper-tile"
      tile.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}, hidden`)
      tile.addEventListener("click", () => revealMinesweeperTile(row, column))
      tile.addEventListener("contextmenu", event => {
        event.preventDefault()
        toggleMinesweeperFlag(row, column)
      })
      board.appendChild(tile)
    }
  }
  revealSafeTile(generated.start.row, generated.start.column)
  status.textContent = `${mineCount} rogue Fribbies are hiding! This board is guaranteed solvable without guessing. Reveal every safe tile to win; right-click to flag.`
}

function countNearbyMinesInGrid(grid, row, column) {
  let count = 0
  for (let r = Math.max(0, row - 1); r <= Math.min(minesweeperRows - 1, row + 1); r++) {
    for (let c = Math.max(0, column - 1); c <= Math.min(minesweeperColumns - 1, column + 1); c++) {
      if ((r !== row || c !== column) && grid[r][c].mine) count++
    }
  }
  return count
}

function cloneMinesweeperGrid(grid) {
  return grid.map(row => row.map(tile => ({ ...tile })))
}

function isMinesweeperGridSolvable(sourceGrid, startRow, startColumn) {
  const grid = cloneMinesweeperGrid(sourceGrid)
  const reveal = (row, column) => {
    if (row < 0 || row >= minesweeperRows || column < 0 || column >= minesweeperColumns) return false
    const tile = grid[row][column]
    if (tile.revealed || tile.mine || tile.flagged) return false
    tile.revealed = true
    if (tile.nearby === 0) {
      for (let r = Math.max(0, row - 1); r <= Math.min(minesweeperRows - 1, row + 1); r++) {
        for (let c = Math.max(0, column - 1); c <= Math.min(minesweeperColumns - 1, column + 1); c++) reveal(r, c)
      }
    }
    return true
  }
  reveal(startRow, startColumn)
  let changed = true
  while (changed) {
    changed = false
    const constraints = []
    for (let r = 0; r < minesweeperRows; r++) for (let c = 0; c < minesweeperColumns; c++) {
      const clue = grid[r][c]
      if (!clue.revealed || clue.nearby === 0) continue
      const unknown = []
      let flags = 0
      for (let nr = Math.max(0, r - 1); nr <= Math.min(minesweeperRows - 1, r + 1); nr++) {
        for (let nc = Math.max(0, c - 1); nc <= Math.min(minesweeperColumns - 1, c + 1); nc++) {
          if (nr === r && nc === c) continue
          const neighbor = grid[nr][nc]
          if (neighbor.flagged) flags++
          else if (!neighbor.revealed) unknown.push(nr * minesweeperColumns + nc)
        }
      }
      if (unknown.length) constraints.push({ cells: unknown, mines: clue.nearby - flags })
    }
    const safe = new Set(), mines = new Set()
    for (const constraint of constraints) {
      if (constraint.mines === 0) constraint.cells.forEach(id => safe.add(id))
      if (constraint.mines === constraint.cells.length) constraint.cells.forEach(id => mines.add(id))
    }
    // Subset deduction: if A is a subset of B, B-A has the difference in mines.
    for (let i = 0; i < constraints.length; i++) for (let j = 0; j < constraints.length; j++) {
      if (i === j) continue
      const a = constraints[i], b = constraints[j]
      if (a.cells.length >= b.cells.length) continue
      const bSet = new Set(b.cells)
      if (!a.cells.every(id => bSet.has(id))) continue
      const diff = b.cells.filter(id => !a.cells.includes(id))
      const remaining = b.mines - a.mines
      if (remaining === 0) diff.forEach(id => safe.add(id))
      if (remaining === diff.length) diff.forEach(id => mines.add(id))
    }
    for (const id of mines) {
      const tile = grid[Math.floor(id / minesweeperColumns)][id % minesweeperColumns]
      if (!tile.revealed && !tile.flagged) { tile.flagged = true; changed = true }
    }
    for (const id of safe) {
      const r = Math.floor(id / minesweeperColumns), c = id % minesweeperColumns
      if (reveal(r, c)) changed = true
    }
  }
  return grid.every(row => row.every(tile => tile.mine || tile.revealed))
}

function createFallbackNoGuessBoard(mineCount) {
  const grid = Array.from({ length: minesweeperRows }, () =>
    Array.from({ length: minesweeperColumns }, () => ({ mine: false, nearby: 0, revealed: false, flagged: false }))
  )
  // Place mines in a predictable separated pattern, with a guaranteed zero
  // start and a clue boundary that can be resolved deterministically.
  const positions = []
  for (let r = 0; r < minesweeperRows && positions.length < mineCount; r++) {
    for (let c = 0; c < minesweeperColumns && positions.length < mineCount; c += 2) positions.push([r, c])
  }
  for (const [r, c] of positions) grid[r][c].mine = true
  for (let r = 0; r < minesweeperRows; r++) for (let c = 0; c < minesweeperColumns; c++) {
    if (!grid[r][c].mine) grid[r][c].nearby = countNearbyMinesInGrid(grid, r, c)
  }
  return { grid, start: { row: minesweeperRows - 1, column: minesweeperColumns - 1 } }
}

function getNearbyMines(row, column) {
  let count = 0
  for (let r = Math.max(0, row - 1); r <= Math.min(minesweeperRows - 1, row + 1); r++) {
    for (let c = Math.max(0, column - 1); c <= Math.min(minesweeperColumns - 1, column + 1); c++) {
      if (minesweeperGrid[r][c].mine) count++
    }
  }
  return count
}

function getMinesweeperTileElement(row, column) {
  return document.getElementById("minesweeperBoard").children[row * minesweeperColumns + column]
}

function revealMinesweeperTile(row, column) {
  if (minesweeperGameOver) return
  const tile = minesweeperGrid[row][column]
  if (tile.revealed || tile.flagged) return

  if (tile.mine) {
    playSoundEffect("minesweeperFailSound")
    tile.revealed = true
    getMinesweeperTileElement(row, column).textContent = "🥏"
    getMinesweeperTileElement(row, column).classList.add("revealed", "mine")
    minesweeperGameOver = true
    document.getElementById("minesweeperStatus").textContent = "A rogue Fribby! Your round is over."
    revealAllMines()
    return
  }

  playSoundEffect("minesweeperCorrectSound")
  revealSafeTile(row, column)
  if (hasWonMinesweeper()) {
    minesweeperGameOver = true
    fribbies += getMinigamePayout(1000)
    playSoundEffect("minigameCompleteSound")
    updateFribby()
    document.getElementById("minesweeperStatus").textContent = "Score! You earned 1,000 Fribbies."
  }
}

function revealSafeTile(row, column) {
  const tile = minesweeperGrid[row][column]
  if (tile.revealed || tile.flagged || tile.mine) return

  tile.revealed = true
  const element = getMinesweeperTileElement(row, column)
  element.classList.add("revealed")
  element.textContent = tile.nearby === 0 ? "" : tile.nearby
  element.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}, ${tile.nearby} nearby mines`)

  if (tile.nearby === 0) {
    for (let r = Math.max(0, row - 1); r <= Math.min(minesweeperRows - 1, row + 1); r++) {
      for (let c = Math.max(0, column - 1); c <= Math.min(minesweeperColumns - 1, column + 1); c++) {
        revealSafeTile(r, c)
      }
    }
  }
}

function toggleMinesweeperFlag(row, column) {
  if (minesweeperGameOver) return
  const tile = minesweeperGrid[row][column]
  if (tile.revealed) return

  tile.flagged = !tile.flagged
  const element = getMinesweeperTileElement(row, column)
  element.textContent = tile.flagged ? "🚩" : ""
  element.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}, ${tile.flagged ? "flagged" : "hidden"}`)
}

function hasWonMinesweeper() {
  return minesweeperGrid.every(row => row.every(tile => tile.mine || tile.revealed))
}

function revealAllMines() {
  for (let row = 0; row < minesweeperRows; row++) {
    for (let column = 0; column < minesweeperColumns; column++) {
      if (minesweeperGrid[row][column].mine) {
        const element = getMinesweeperTileElement(row, column)
        element.textContent = "🥏"
        element.classList.add("revealed", "mine")
      }
    }
  }
}


let pathFinderMaze = []
let pathFinderPosition = { row: 0, column: 0 }
let pathFinderGoal = { row: 12, column: 12 }
let pathFinderActive = false

function generatePathFinderMaze() {
  // Build a 13x13 maze from a 7x7 grid of intersections.
  const mazeSize = 13
  const intersectionSize = 7
  const maze = Array.from({ length: mazeSize }, () => Array(mazeSize).fill(1))
  const visited = Array.from({ length: intersectionSize }, () => Array(intersectionSize).fill(false))

  // Carve a randomized maze using depth-first search.
  const stack = [[0, 0]]
  const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]]
  visited[0][0] = true
  maze[0][0] = 0

  while (stack.length > 0) {
    const [row, column] = stack[stack.length - 1]
    const options = directions.filter(([rowChange, columnChange]) => {
      const nextRow = row + rowChange
      const nextColumn = column + columnChange
      return nextRow >= 0 && nextRow < mazeSize &&
        nextColumn >= 0 && nextColumn < mazeSize &&
        !visited[nextRow / 2][nextColumn / 2]
    })

    if (options.length === 0) {
      stack.pop()
      continue
    }

    const [rowChange, columnChange] = options[Math.floor(Math.random() * options.length)]
    const nextRow = row + rowChange
    const nextColumn = column + columnChange
    maze[row + rowChange / 2][column + columnChange / 2] = 0
    maze[nextRow][nextColumn] = 0
    visited[nextRow / 2][nextColumn / 2] = true
    stack.push([nextRow, nextColumn])
  }

  // Choose random dead ends for both the player and target. A dead end has
  // exactly one open neighboring cell, so the target is always at the end
  // of the maze path rather than in the middle of a corridor.
  const deadEnds = []
  for (let row = 0; row < mazeSize; row++) {
    for (let column = 0; column < mazeSize; column++) {
      if (maze[row][column] !== 0) continue
      const openNeighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]].filter(([dr, dc]) => {
        const r = row + dr
        const c = column + dc
        return r >= 0 && r < mazeSize && c >= 0 && c < mazeSize && maze[r][c] === 0
      }).length
      if (openNeighbors === 1) deadEnds.push({ row, column })
    }
  }

  const startIndex = Math.floor(Math.random() * deadEnds.length)
  const start = deadEnds[startIndex]
  const possibleGoals = deadEnds.filter((_, index) => index !== startIndex)
  const goal = possibleGoals[Math.floor(Math.random() * possibleGoals.length)]

  return { maze, start, goal }
}

function createPathFinderGame() {
  const generated = generatePathFinderMaze()

  pathFinderMaze = generated.maze
  pathFinderPosition = generated.start
  pathFinderGoal = generated.goal
  pathFinderActive = true

  renderPathFinderBoard()

  document.getElementById("pathFinderStatus").textContent =
    "Find the Fribby target! Use arrow keys or the direction buttons."
}

function renderPathFinderBoard() {
  const board = document.getElementById("pathFinderBoard")
  board.innerHTML = ""

  pathFinderMaze.forEach((row, rowIndex) => {
    row.forEach((wall, columnIndex) => {
      const cell = document.createElement("div")
      cell.className = "path-cell"

      if (wall) {
        cell.classList.add("wall")
        cell.textContent = ""
        cell.setAttribute("aria-label", "Wall")
      } else if (
        rowIndex === pathFinderPosition.row &&
        columnIndex === pathFinderPosition.column
      ) {
        cell.classList.add("player")
        cell.textContent = "🥏"
        cell.setAttribute("aria-label", "Your flying Fribby")
      } else if (
        rowIndex === pathFinderGoal.row &&
        columnIndex === pathFinderGoal.column
      ) {
        cell.classList.add("goal")
        cell.textContent = "🎯"
        cell.setAttribute("aria-label", "Fribby target")
      } else {
        cell.setAttribute("aria-label", "Path")
      }

      board.appendChild(cell)
    })
  })
}

function movePathFinder(columnChange, rowChange) {
  if (!pathFinderActive) return

  const row = pathFinderPosition.row + rowChange
  const column = pathFinderPosition.column + columnChange

  if (
    row < 0 ||
    row >= pathFinderMaze.length ||
    column < 0 ||
    column >= pathFinderMaze[0].length ||
    pathFinderMaze[row][column]
  ) {
    return
  }

  pathFinderPosition = { row, column }
  renderPathFinderBoard()

  if (
    row === pathFinderGoal.row &&
    column === pathFinderGoal.column
  ) {
    pathFinderActive = false
    fribbies += getMinigamePayout(250)
    playSoundEffect("minigameCompleteSound")
    updateFribby()

    document.getElementById("pathFinderStatus").textContent =
      "Bullseye! You guided the Fribby home and earned 250 Fribbies."
  }
}

document.addEventListener("keydown", event => {
  if (document.getElementById("minigame-pathFinder").hidden || !pathFinderActive) return
  const moves = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0]
  }
  if (moves[event.key]) {
    event.preventDefault()
    movePathFinder(...moves[event.key])
  }
})

const patternRecallLength = 9
let patternRecallSequence = []
let patternRecallInput = 0
let patternRecallActive = false
let patternRecallStreak = 0
let patternRecallTimer

function startPatternRecall() {
  clearTimeout(patternRecallTimer)
  patternRecallStreak = 0
  patternRecallSequence = []
  patternRecallInput = 0
  patternRecallActive = true
  addPatternRecallStep()
  showPatternRecallSequence()
}

function addPatternRecallStep() {
  patternRecallSequence.push(Math.floor(Math.random() * patternRecallLength))
}

function showPatternRecallSequence() {
  const status = document.getElementById("patternRecallStatus")
  const buttons = document.getElementById("patternRecallBoard").children
  patternRecallActive = false
  status.textContent = "Watch the flying Fribbies..."
  Array.from(buttons).forEach(button => button.disabled = true)

  let step = 0
  const showNext = () => {
    if (step >= patternRecallSequence.length) {
      Array.from(buttons).forEach(button => button.disabled = false)
      patternRecallActive = true
      patternRecallInput = 0
      status.textContent = "Your turn! Repeat the Fribby flight path."
      return
    }
    const button = buttons[patternRecallSequence[step]]
    button.classList.add("pattern-active")
    playSoundEffect("patternThrowSound")
    patternRecallTimer = setTimeout(() => {
      button.classList.remove("pattern-active")
      step++
      patternRecallTimer = setTimeout(showNext, 250)
    }, 550)
  }
  patternRecallTimer = setTimeout(showNext, 400)
}

function handlePatternRecallInput(index) {
  if (!patternRecallActive) return
    if (index !== patternRecallSequence[patternRecallInput]) {
    patternRecallActive = false
    patternRecallStreak = 0
    document.getElementById("patternRecallStatus").textContent = "Not quite! Your streak ended. Start a new pattern to try again."
    return
  }

  patternRecallInput++
  if (patternRecallInput < patternRecallSequence.length) return

    patternRecallStreak++
  const reward = patternRecallStreak * 10
  fribbies += getMinigamePayout(reward)
  playSoundEffect("minigameCompleteSound")
  updateFribby()
  document.getElementById("patternRecallStatus").textContent = `Correct! You earned ${reward} Fribbies this round. Next round...`
  patternRecallActive = false
  addPatternRecallStep()
  patternRecallTimer = setTimeout(showPatternRecallSequence, 900)
}

function initializePatternRecallBoard() {
  const board = document.getElementById("patternRecallBoard")
  board.innerHTML = ""
  for (let index = 0; index < patternRecallLength; index++) {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "pattern-tile"
        button.textContent = "🥏"
    button.setAttribute("aria-label", `Fribby launch pad ${index + 1}`)
    button.addEventListener("click", () => handlePatternRecallInput(index))
    board.appendChild(button)
  }
}

document.addEventListener("DOMContentLoaded", initializePatternRecallBoard)

let luckySpinInProgress = false
function spinLuckyWheel() {
  if (luckySpinInProgress) return
  const status = document.getElementById("luckySpinStatus")
  const button = document.getElementById("luckySpinButton")
  const wheel = document.getElementById("luckyWheel")
  if (fribbies < 100n) {
    status.textContent = "You need 100 Fribbies to power the wheel."
    return
  }
  fribbies -= 100n
  updateFribby()
  luckySpinInProgress = true
  button.disabled = true
  wheel.classList.remove("spinning")
  void wheel.offsetWidth
  wheel.classList.add("spinning")
  status.textContent = "The wheel is spinning..."
  window.setTimeout(() => {
    const jackpot = Math.random() < 0.01
    const prizes = [0, 25, 50, 100, 200]
    const prize = jackpot ? 1000 : prizes[Math.floor(Math.random() * prizes.length)]
    fribbies += getMinigamePayout(prize)
    if (prize > 0) playSoundEffect("minigameCompleteSound")
    updateFribby()
    wheel.classList.remove("spinning")
    status.textContent = jackpot
      ? "JACKPOT! The wheel landed on 1,000 Fribbies!"
      : prize === 0
        ? "The Fribby wheel slipped past the prize. Try another spin!"
        : `🥏 The wheel landed on ${prize} Fribbies!`
    button.disabled = false
    luckySpinInProgress = false
  }, 1700)
}

/* -------------------- COOKIE SAVE SYSTEM --------------------
   The save cookie stores progression only (currency, upgrades, and
   unlocked minigames). Active minigame rounds restart when the page reloads.
*/
const GAME_SAVE_COOKIE = "fribbyThrowerSave"
const GAME_SAVE_DAYS = 365

// Keep currency and prices as integers of unlimited size. Strings are used
// at storage boundaries because JSON does not support BigInt values.
function toBigIntAmount(value, fallback = 0n) {
  try {
    if (typeof value === "bigint") return value >= 0n ? value : fallback
    let text = String(value ?? "").trim()
    if (/[eE]/.test(text)) text = expandSaveExponent(text)
    if (!/^\d+$/.test(text)) return fallback
    return BigInt(text)
  } catch (error) {
    return fallback
  }
}

function formatFribbies(value) {
  return toBigIntAmount(value).toString()
}

function setGameCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function getGameCookie(name) {
  const prefix = `${name}=`
  const cookie = document.cookie.split("; ").find(item => item.startsWith(prefix))
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

function getGameSaveData() {
  return {
    version: 4,
    fribbies: fribbies.toString(),
    upgrades: [
      { amount: u0Amount, cost: u0Cost.toString() },
      { amount: u1Amount, cost: u1Cost.toString() },
      { amount: u2Amount, cost: u2Cost.toString() },
      { amount: u3Amount, cost: u3Cost.toString() },
      { amount: u4Amount, cost: u4Cost.toString() },
      { amount: u5Amount, cost: u5Cost.toString() },
      { amount: u6Amount, cost: u6Cost.toString() },
      { amount: u7Amount, cost: u7Cost.toString() },
      { amount: u8Amount, cost: u8Cost.toString() }
    ],
    unlockedMinigames,
    minigameUnlockCost: minigameUnlockCost.toString(),
    megaFribbies: megaFribbies.toString(),
    ascensionCount,
    purchasedSkills: [...purchasedSkills].filter(id => id !== "path-12"),
    repeatableEchoes
  }
}

function saveGame(showMessage = false) {
  if (showMessage) playSoundEffect("saveSound")
  const serialized = JSON.stringify(getGameSaveData())
  let saved = false

  // localStorage works more reliably than cookies when the game is opened
  // directly as a file:// URL. Keep the cookie as a fallback for hosted copies.
  try {
    localStorage.setItem(GAME_SAVE_COOKIE, serialized)
    saved = localStorage.getItem(GAME_SAVE_COOKIE) === serialized
  } catch (error) {
    // Storage may be disabled by browser privacy settings; try cookies below.
  }

  try {
    setGameCookie(GAME_SAVE_COOKIE, serialized, GAME_SAVE_DAYS)
    if (getGameCookie(GAME_SAVE_COOKIE) !== null) saved = true
  } catch (error) {
    // The game can still use localStorage if cookies are unavailable.
  }

  const status = document.getElementById("saveStatus")
  if (status && showMessage) {
    status.textContent = saved
      ? "Game saved on this browser!"
      : "Couldn't save. Browser storage and cookies may be blocked."
  }
  return saved
}

function migrateSaveData(data) {
  if (Number(data.version) === 1) {
    const ratios = [[1n, 5n], [1n, 4n], [2n, 5n], [1n, 2n], [2n, 5n], [1n, 2n], [1n, 2n], [2n, 5n], [1n, 2n]]
    data.upgrades = data.upgrades.map((upgrade, index) => {
      const [numerator, denominator] = ratios[index]
      const oldCost = toBigIntAmount(upgrade.cost, 1n)
      return { ...upgrade, cost: ((oldCost * numerator + denominator / 2n) / denominator).toString() }
    })
    data.minigameUnlockCost = (toBigIntAmount(data.minigameUnlockCost, 5000n) / 2n < 2500n
      ? 2500n
      : toBigIntAmount(data.minigameUnlockCost, 5000n) / 2n).toString()
    data.version = 2
  }
  if (Number(data.version) < 3) {
    data.megaFribbies = "0"
    data.ascensionCount = 0
    data.purchasedSkills = []
    data.version = 3
  }
  if (Number(data.version) < 4) {
    const previousSkills = Array.isArray(data.purchasedSkills) ? data.purchasedSkills : []
    data.repeatableEchoes = Number.isFinite(Number(data.repeatableEchoes))
      ? Math.min(MAX_REPEATABLE_ECHOES, Math.max(0, Math.floor(Number(data.repeatableEchoes))))
      : (previousSkills.includes("path-12") ? 1 : 0)
    data.purchasedSkills = previousSkills.filter(id => id !== "path-12")
    data.version = 4
  }
  return data
}

function loadGame(showMessage = true) {
  if (showMessage) playSoundEffect("saveSound")
  let rawSave = null
  const status = document.getElementById("saveStatus")

  // Prefer localStorage for file:// pages, then fall back to cookies.
  try {
    rawSave = localStorage.getItem(GAME_SAVE_COOKIE)
  } catch (error) {
    // Fall back to cookies if localStorage is unavailable.
  }
  if (!rawSave) {
    try {
      rawSave = getGameCookie(GAME_SAVE_COOKIE)
    } catch (error) {
      // Both storage methods may be blocked by browser settings.
    }
  }
  if (!rawSave) {
    if (status && showMessage) status.textContent = "No cookie save found in this browser yet."
    return false
  }

  try {
    const data = migrateSaveData(JSON.parse(rawSave))
    if (![1, 2, 3, 4].includes(data.version) || !Array.isArray(data.upgrades) || data.upgrades.length !== 9) {
      throw new Error("Unsupported save format")
    }

    fribbies = toBigIntAmount(data.fribbies)
    u0Amount = Math.max(0, Number(data.upgrades[0].amount) || 0); u0Cost = toBigIntAmount(data.upgrades[0].cost, 10n) || 10n
    u1Amount = Math.max(0, Number(data.upgrades[1].amount) || 0); u1Cost = toBigIntAmount(data.upgrades[1].cost, 50n) || 50n
    u2Amount = Math.max(0, Number(data.upgrades[2].amount) || 0); u2Cost = toBigIntAmount(data.upgrades[2].cost, 200n) || 200n
    u3Amount = Math.max(0, Number(data.upgrades[3].amount) || 0); u3Cost = toBigIntAmount(data.upgrades[3].cost, 500n) || 500n
    u4Amount = Math.max(0, Number(data.upgrades[4].amount) || 0); u4Cost = toBigIntAmount(data.upgrades[4].cost, 1000n) || 1000n
    u5Amount = Math.max(0, Number(data.upgrades[5].amount) || 0); u5Cost = toBigIntAmount(data.upgrades[5].cost, 2500n) || 2500n
    u6Amount = Math.max(0, Number(data.upgrades[6].amount) || 0); u6Cost = toBigIntAmount(data.upgrades[6].cost, 5000n) || 5000n
    u7Amount = Math.max(0, Number(data.upgrades[7].amount) || 0); u7Cost = toBigIntAmount(data.upgrades[7].cost, 10000n) || 10000n
    u8Amount = Math.max(0, Number(data.upgrades[8].amount) || 0); u8Cost = toBigIntAmount(data.upgrades[8].cost, 25000n) || 25000n

    unlockedMinigames = Math.max(0, Math.min(minigameUnlockOrder.length, Number(data.unlockedMinigames) || 0))
    minigameUnlockCost = toBigIntAmount(data.minigameUnlockCost, 2500n) < 2500n ? 2500n : toBigIntAmount(data.minigameUnlockCost, 2500n)
    megaFribbies = toBigIntAmount(data.megaFribbies)
    ascensionCount = Math.max(0, Number(data.ascensionCount) || 0)
    repeatableEchoes = Math.min(MAX_REPEATABLE_ECHOES, Math.max(0, Math.floor(Number(data.repeatableEchoes) || 0)))
    purchasedSkills = new Set(Array.isArray(data.purchasedSkills) ? data.purchasedSkills.filter(id => skillIdToIndex(id) >= 0 && id !== "path-12") : [])

    updateFribby()
    renderSkillTree()
    const labels = [
      `Extra Hand - (${u0Amount}, +1 Fribby per click) - ${u0Cost} Fribbies`,
      `Auto Thrower (${u1Amount}, +1 auto throw/sec) - ${u1Cost} Fribbies`,
      `Intern (${u2Amount}, +1 Fribby per auto throw) - ${u2Cost} Fribbies`,
      `Fribby Cannon (${u3Amount}, +5 Fribbies per click) - ${u3Cost} Fribbies`,
      `Supervisor (${u4Amount}, +5 Fribbies per auto throw) - ${u4Cost} Fribbies`,
      `Power Throw (${u5Amount}, +10 Fribbies per click) - ${u5Cost} Fribbies`,
      `Fribby Factory (${u6Amount}, +10 Fribbies per auto throw) - ${u6Cost} Fribbies`,
      `Turbo Thrower (${u7Amount}, +5 auto throws/sec) - ${u7Cost} Fribbies`,
      `Mega Cannon (${u8Amount}, +100 Fribbies per click) - ${u8Cost} Fribbies`
    ]
    labels.forEach((label, index) => {
      document.getElementById(`upgrade${index}`).textContent = label
    })
    refreshUpgradeLabels()

    document.getElementById("minigamesArea").hidden = unlockedMinigames === 0
    minigameUnlockOrder.forEach((game, index) => {
      const selector = document.querySelector(`[data-minigame="${game}"]`)
      if (selector) selector.hidden = index >= unlockedMinigames
    })
    updateMinigameUnlockButton()
    if (getAutoThrowsPerSecond() > 0) updateAutoThrowInterval()
    if (status && showMessage) status.textContent = "Save loaded successfully!"
    return true
  } catch (error) {
    if (status && showMessage) status.textContent = "The saved cookie was invalid, so it wasn't loaded."
    return false
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loaded = loadGame(false)
  renderSkillTree()
  updateAscensionUI()
  const status = document.getElementById("saveStatus")
  if (status) status.textContent = loaded ? "Save loaded automatically." : "Autosave is ready. Progress will be stored in this browser."
  // Keep the cookie's expiration fresh while the game is open.
  window.setInterval(() => saveGame(false), 5000)
  window.addEventListener("beforeunload", () => saveGame(false))
})

const SUPABASE_URL = "https://soofisuqqwszdhqxiqzw.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_r68LSwAd5IFOdsI9sm31Gg_cx2-DmSe"
const LEADERBOARD_TABLE = "fribby_leaderboard"
let leaderboardClient = null
let leaderboardAdminClient = null
let leaderboardUserId = null
let leaderboardIsAdmin = false

function isLeaderboardConfigured() {
  return window.supabase &&
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("PASTE_YOUR_") &&
    SUPABASE_PUBLISHABLE_KEY &&
    !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_YOUR_")
}

async function initializeLeaderboard() {
  const status = document.getElementById("leaderboardStatus")
  const nameInput = document.getElementById("leaderboardName")
  if (!isLeaderboardConfigured()) {
    if (status) status.textContent = "Not connected yet. Follow README-LEADERBOARD.txt to connect your Supabase project."
    return
  }

  try {
    leaderboardClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    leaderboardAdminClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { storageKey: "fribby-leaderboard-admin-auth", persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    })
    const savedName = localStorage.getItem("fribbyLeaderboardName") || ""
    const colorInput = document.getElementById("leaderboardNameColor")
    const savedColor = localStorage.getItem("fribbyLeaderboardNameColor") || "#8b5cf6"
    if (nameInput) nameInput.value = savedName
    if (colorInput) colorInput.value = /^#[0-9a-fA-F]{6}$/.test(savedColor) ? savedColor : "#8b5cf6"

    let { data: sessionData, error: sessionError } = await leaderboardClient.auth.getSession()
    if (sessionError) throw sessionError
    if (!sessionData.session) {
      const { data, error } = await leaderboardClient.auth.signInAnonymously()
      if (error) throw error
      sessionData = { session: data.session }
    }
    leaderboardUserId = sessionData.session?.user?.id || (await leaderboardClient.auth.getUser()).data.user?.id
    if (!leaderboardUserId) throw new Error("Could not create a player session.")

    if (status) status.textContent = "Connected! Choose a player name and submit your score."
    await checkLeaderboardAdmin()
    await refreshLeaderboard()
  } catch (error) {
    if (status) status.textContent = "Couldn't connect to the leaderboard. Check Supabase settings and anonymous sign-ins."
    console.error("Leaderboard initialization failed:", error)
  }
}

function safeLeaderboardName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 20)
}

async function submitLeaderboardScore() {
  const status = document.getElementById("leaderboardStatus")
  if (!leaderboardClient || !leaderboardUserId) {
    if (status) status.textContent = "Leaderboard isn't connected yet. Configure Supabase first."
    return
  }

  const nameInput = document.getElementById("leaderboardName")
  const playerName = safeLeaderboardName(nameInput?.value)
  const colorInput = document.getElementById("leaderboardNameColor")
  const nameColor = /^#[0-9a-fA-F]{6}$/.test(colorInput?.value || "") ? colorInput.value : "#8b5cf6"
  if (playerName.length < 2) {
    if (status) status.textContent = "Please enter a player name with at least 2 characters."
    nameInput?.focus()
    return
  }

  try {
    localStorage.setItem("fribbyLeaderboardName", playerName)
    localStorage.setItem("fribbyLeaderboardNameColor", nameColor)
    const { error } = await leaderboardClient
      .from(LEADERBOARD_TABLE)
      .upsert({
        user_id: leaderboardUserId,
        player_name: playerName,
        name_color: nameColor,
        score: fribbies > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : Number(fribbies),
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" })
    if (error) throw error
    if (status) status.textContent = "Score submitted! Your ranking is updated."
    await refreshLeaderboard()
  } catch (error) {
    if (status) status.textContent = "Score submission failed. Check the SQL setup and Supabase permissions."
    console.error("Leaderboard submission failed:", error)
  }
}

function formatLeaderboardScore(value) {
  const amount = toBigIntAmount(value)
  return amount.toLocaleString("en-US")
}

async function refreshLeaderboard() {
  const status = document.getElementById("leaderboardStatus")
  const list = document.getElementById("leaderboardList")
  if (!leaderboardClient) {
    if (status) status.textContent = "Leaderboard isn't connected yet. Configure Supabase first."
    return
  }

  try {
    const { data, error } = await leaderboardClient
      .from(LEADERBOARD_TABLE)
      .select("user_id, player_name, name_color, score, updated_at, is_crowned")
      .order("score", { ascending: false })
      .order("updated_at", { ascending: true })
      .limit(100)
    if (error) throw error

    list.replaceChildren()
    if (!data || data.length === 0) {
      const item = document.createElement("li")
      item.textContent = "No scores yet. Be the first to submit one!"
      list.appendChild(item)
    } else {
      data.forEach((entry, index) => {
        const item = document.createElement("li")
        const player = document.createElement("span")
        player.className = "leaderboard-player"
        const name = document.createElement("span")
        name.className = "leaderboard-player-name"
        name.textContent = safeLeaderboardName(entry.player_name) || "Anonymous Fribby"
        const entryColor = /^#[0-9a-fA-F]{6}$/.test(entry.name_color || "") ? entry.name_color : "#8b5cf6"
        name.style.color = entryColor
        if (entry.is_crowned) {
          const crown = document.createElement("span")
          crown.className = "leaderboard-crown"
          crown.textContent = "👑"
          crown.title = "Crowned player"
          crown.setAttribute("aria-label", "Crowned player")
          player.appendChild(crown)
        }
        player.appendChild(name)
        const score = document.createElement("strong")
        score.textContent = `${formatLeaderboardScore(entry.score)} Fribbies`
        item.append(player, score)
        if (leaderboardIsAdmin) {
          const actions = document.createElement("span")
          actions.className = "leaderboard-admin-actions"
          const crownButton = document.createElement("button")
          crownButton.type = "button"
          crownButton.className = "leaderboard-admin-button"
          crownButton.textContent = entry.is_crowned ? "Remove crown" : "Crown"
          crownButton.setAttribute("aria-label", `${entry.is_crowned ? "Remove crown from" : "Crown"} ${safeLeaderboardName(entry.player_name)}`)
          crownButton.addEventListener("click", () => setLeaderboardCrown(entry.user_id, !entry.is_crowned, safeLeaderboardName(entry.player_name)))
          const removeButton = document.createElement("button")
          removeButton.type = "button"
          removeButton.className = "leaderboard-admin-button danger"
          removeButton.textContent = "Remove"
          removeButton.setAttribute("aria-label", `Remove ${safeLeaderboardName(entry.player_name)} from leaderboard`)
          removeButton.addEventListener("click", () => removeLeaderboardPlayer(entry.user_id, safeLeaderboardName(entry.player_name)))
          actions.append(crownButton, removeButton)
          item.appendChild(actions)
        }
        item.setAttribute("aria-label", `Rank ${index + 1}: ${name.textContent}, ${score.textContent}`)
        list.appendChild(item)
      })
    }
    if (status && data?.length) status.textContent = `Showing the top ${data.length} players worldwide.`
    else if (status) status.textContent = "Leaderboard refreshed."
  } catch (error) {
    if (status) status.textContent = "Couldn't load rankings. Check that the SQL setup has been completed."
    console.error("Leaderboard refresh failed:", error)
  }
}

async function checkLeaderboardAdmin() {
  const adminStatus = document.getElementById("leaderboardAdminStatus")
  const signOut = document.getElementById("leaderboardAdminSignOut")
  if (!leaderboardAdminClient) return
  try {
    const { data: sessionData } = await leaderboardAdminClient.auth.getSession()
    if (!sessionData.session) {
      leaderboardIsAdmin = false
      if (adminStatus) adminStatus.textContent = "Admin controls are hidden until an authorized account signs in."
      if (signOut) signOut.hidden = true
      return
    }
    const { data, error } = await leaderboardAdminClient.rpc("is_fribby_leaderboard_admin")
    if (error) throw error
    leaderboardIsAdmin = data === true
    if (adminStatus) adminStatus.textContent = leaderboardIsAdmin
      ? "Administrator verified. Crown and remove controls are enabled globally."
      : "Signed-in account is not an administrator."
    if (signOut) signOut.hidden = !leaderboardIsAdmin
  } catch (error) {
    leaderboardIsAdmin = false
    if (adminStatus) adminStatus.textContent = "Admin verification is not configured. Apply leaderboard-admin.sql in Supabase."
    if (signOut) signOut.hidden = true
    console.error("Leaderboard admin verification failed:", error)
  }
}

async function signInLeaderboardAdmin() {
  const email = document.getElementById("leaderboardAdminEmail")?.value.trim()
  const password = document.getElementById("leaderboardAdminPassword")?.value
  const output = document.getElementById("leaderboardAdminStatus")
  if (!leaderboardAdminClient || !email || !password) {
    if (output) output.textContent = "Enter the administrator email and password."
    return
  }
  try {
    const { error } = await leaderboardAdminClient.auth.signInWithPassword({ email, password })
    if (error) throw error
    await checkLeaderboardAdmin()
    await refreshLeaderboard()
    if (!leaderboardIsAdmin && output) output.textContent = "This account is not on the administrator allowlist."
  } catch (error) {
    if (output) output.textContent = "Admin sign-in failed. Check the account and password."
    console.error("Leaderboard admin sign-in failed:", error)
  }
}

async function signOutLeaderboardAdmin() {
  if (!leaderboardAdminClient) return
  try {
    await leaderboardAdminClient.auth.signOut()
    leaderboardIsAdmin = false
    await refreshLeaderboard()
  } catch (error) {
    const output = document.getElementById("leaderboardAdminStatus")
    if (output) output.textContent = "Sign out failed. Please try again."
  }
}

async function setLeaderboardCrown(userId, crowned, playerName) {
  if (!leaderboardIsAdmin) return
  const status = document.getElementById("leaderboardStatus")
  try {
    const { error } = await leaderboardAdminClient.rpc("set_fribby_leaderboard_crown", {
      target_user_id: userId,
      should_crown: crowned
    })
    if (error) throw error
    if (status) status.textContent = crowned ? `${playerName} has been crowned for everyone.` : `${playerName}'s crown was removed.`
    await refreshLeaderboard()
  } catch (error) {
    if (status) status.textContent = "Couldn't change the crown. Check the admin SQL setup and permissions."
    console.error("Crown update failed:", error)
  }
}

async function removeLeaderboardPlayer(userId, playerName) {
  if (!leaderboardIsAdmin) return
  if (!window.confirm(`Remove ${playerName} from the global leaderboard? This cannot be undone.`)) return
  const status = document.getElementById("leaderboardStatus")
  try {
    const { error } = await leaderboardAdminClient.rpc("remove_fribby_leaderboard_player", { target_user_id: userId })
    if (error) throw error
    if (status) status.textContent = `${playerName} was removed from the global leaderboard.`
    await refreshLeaderboard()
  } catch (error) {
    if (status) status.textContent = "Couldn't remove this player. Check the admin SQL setup and permissions."
    console.error("Leaderboard removal failed:", error)
  }
}

document.addEventListener("DOMContentLoaded", initializeLeaderboard)

/* -------------------- SAVE FILE EXPORT / IMPORT --------------------
   Export creates a redundant base-36 backup. Older JSON and numeric saves
   remain importable for backwards compatibility.
*/

// New save files store base-36 values in three copies. When importing, each
// field is recovered by majority vote, so one damaged copy can be corrected.
// Older decimal save files and JSON exports remain supported.
const SAVE_BASE36_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz"
const SAVE_TRIPLE_PREFIX = "FT3|"

function saveDataToFields(data) {
  const values = [data.fribbies]
  data.upgrades.forEach(upgrade => values.push(upgrade.amount, upgrade.cost))
  values.push(data.unlockedMinigames, data.minigameUnlockCost, data.megaFribbies || "0", data.ascensionCount || 0)
  let skillMask = 0n
  ;(data.purchasedSkills || []).forEach(id => { const index = skillIdToIndex(id); if (index >= 0) skillMask |= (1n << BigInt(index)) })
  if (Number(data.repeatableEchoes) > 0) skillMask |= (1n << 12n)
  values.push(skillMask.toString(), data.repeatableEchoes || 0)

  return values.map(value => {
    // Convert directly from decimal strings so huge values never pass through
    // Number and lose precision.
    const integer = toBigIntAmount(value, null)
    if (integer === null) throw new Error("Invalid number in save")
    return integer.toString(36)
  })
}

function expandSaveExponent(value) {
  if (!/[eE]/.test(value)) return value
  const [mantissa, exponentText] = value.toLowerCase().split("e")
  const exponent = Number(exponentText)
  const negative = mantissa.startsWith("-")
  const unsigned = negative ? mantissa.slice(1) : mantissa
  const dot = unsigned.indexOf(".")
  const digits = unsigned.replace(".", "")
  const position = (dot < 0 ? unsigned.length : dot) + exponent
  let expanded
  if (position <= 0) expanded = "0." + "0".repeat(-position) + digits
  else if (position >= digits.length) expanded = digits + "0".repeat(position - digits.length)
  else expanded = digits.slice(0, position) + "." + digits.slice(position)
  // Save values are integers, but keep this helper safe for decimal input too.
  if (expanded.includes(".")) expanded = expanded.replace(/0+$/, "").replace(/\.$/, "")
  return (negative ? "-" : "") + expanded
}

function encryptSaveFields(fields) {
  const payload = fields.join("/")
  return SAVE_TRIPLE_PREFIX + [payload, payload, payload].join("|")
}

function decryptSaveFields(ciphertext) {
  const text = String(ciphertext).trim()
  let fields

  if (text.startsWith(SAVE_TRIPLE_PREFIX)) {
    const copies = text.slice(SAVE_TRIPLE_PREFIX.length).split("|")
    if (copies.length !== 3) throw new Error("Invalid redundant save")
    const parsedCopies = copies.map(copy => copy.split("/"))
    if (parsedCopies.some(copy => ![21, 24, 25].includes(copy.length)) || parsedCopies.some(copy => copy.length !== parsedCopies[0].length)) throw new Error("Invalid save field count")

    fields = parsedCopies[0].map((_, index) => {
      const values = parsedCopies.map(copy => copy[index])
      if (values[0] === values[1] || values[0] === values[2]) return values[0]
      if (values[1] === values[2]) return values[1]
      throw new Error("No majority value for save field")
    })
    if (fields.some(field => !/^[0-9a-z]+$/i.test(field))) throw new Error("Invalid base-36 save")

    const decoded = fields.map(field => parseBase36BigInt(field).toString())
    return fieldsToSaveData(decoded)
  }

  // Legacy format: chained decimal digit cipher.
  const legacyFields = text.split("/")
  if (!([21, 24, 25].includes(legacyFields.length)) || legacyFields.some(field => !/^\d+$/.test(field))) {
    throw new Error("Invalid encrypted save")
  }
  let key = 6
  const decoded = legacyFields.map(field => {
    let plain = ""
    for (const char of field) {
      const encrypted = Number(char)
      plain += (encrypted - key + 10) % 10
      key = encrypted
    }
    return Number(plain)
  })
  return fieldsToSaveData(decoded.map(String))
}

function parseBase36BigInt(value) {
  let result = 0n
  for (const char of value.toLowerCase()) {
    const digit = SAVE_BASE36_ALPHABET.indexOf(char)
    if (digit < 0) throw new Error("Invalid base-36 digit")
    result = result * 36n + BigInt(digit)
  }
  return result
}

function fieldsToSaveData(decoded) {
  const upgrades = []
  for (let i = 0; i < 9; i++) {
    upgrades.push({ amount: Number(decoded[1 + i * 2]), cost: String(decoded[2 + i * 2]) })
  }
  const mask = decoded.length >= 24 ? toBigIntAmount(decoded[23]) : 0n
  const skillIds = decoded.length >= 24
    ? Array.from({ length: 81 }, (_, index) => (mask & (1n << BigInt(index))) ? skillIndexToId(index) : null).filter(Boolean)
    : []
  const legacyEchoLevel = skillIds.includes("path-12") ? 1 : 0
  return {
    version: decoded.length >= 25 ? 4 : (decoded.length >= 24 ? 3 : 2),
    fribbies: String(decoded[0]), upgrades,
    unlockedMinigames: Number(decoded[19]), minigameUnlockCost: String(decoded[20]),
    megaFribbies: decoded.length >= 24 ? String(decoded[21]) : "0",
    ascensionCount: decoded.length >= 24 ? Number(decoded[22]) : 0,
    purchasedSkills: skillIds.filter(id => id !== "path-12"),
    repeatableEchoes: decoded.length >= 25 ? Number(decoded[24]) : legacyEchoLevel
  }
}

function parseSaveFileText(text) {
  const trimmed = String(text).trim()
  if (trimmed.startsWith("{")) return JSON.parse(trimmed) // older exported JSON saves remain importable
  return decryptSaveFields(trimmed)
}

function exportSave() {
  playSoundEffect("saveSound")
  try {
    const saveText = encryptSaveFields(saveDataToFields(getGameSaveData()))
    const blob = new Blob([saveText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "fribby-thrower-save.txt"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)

    const status = document.getElementById("saveStatus")
    if (status) status.textContent = "Save file exported! Keep it somewhere safe."
  } catch (error) {
    const status = document.getElementById("saveStatus")
    if (status) status.textContent = "Couldn't export the save file."
  }
}

async function importSaveFile(event) {
  const input = event.target
  const file = input.files && input.files[0]
  if (!file) return

  const status = document.getElementById("saveStatus")
  playSoundEffect("saveSound")
  try {
    const text = await file.text()
    const data = migrateSaveData(parseSaveFileText(text))

    // Validate the structure before touching the current save.
    if (
      ![1, 2, 3, 4].includes(Number(data.version)) ||
      !/^\d+$/.test(String(data.fribbies)) ||
      !Array.isArray(data.upgrades) ||
      data.upgrades.length !== 9 ||
      !data.upgrades.every(item =>
        item &&
        Number.isFinite(Number(item.amount)) &&
        /^\d+$/.test(String(item.cost))
      ) ||
      !Number.isFinite(Number(data.unlockedMinigames)) ||
      !/^\d+$/.test(String(data.minigameUnlockCost))
    ) {
      throw new Error("Invalid save format")
    }

    const serialized = JSON.stringify(data)
    let stored = false
    try {
      localStorage.setItem(GAME_SAVE_COOKIE, serialized)
      stored = localStorage.getItem(GAME_SAVE_COOKIE) === serialized
    } catch (error) {
      // Try the cookie fallback below.
    }
    try {
      setGameCookie(GAME_SAVE_COOKIE, serialized, GAME_SAVE_DAYS)
      if (getGameCookie(GAME_SAVE_COOKIE) !== null) stored = true
    } catch (error) {
      // If storage is blocked, load directly from the imported data below.
    }

    if (stored) {
      loadGame(false)
    } else {
      // Support the current session even if persistent storage is blocked.
      applyImportedSaveData(data)
    }

    if (status) status.textContent = "Save file imported successfully!"
  } catch (error) {
    if (status) status.textContent = "That save file is invalid or unreadable. Your current save was not replaced."
  } finally {
    input.value = ""
  }
}

// Used only when browser storage is blocked, so imported data can still be
// loaded into the current game session.
function applyImportedSaveData(data) {
  data = migrateSaveData(data)
  fribbies = toBigIntAmount(data.fribbies)
  u0Amount = Math.max(0, Number(data.upgrades[0].amount) || 0); u0Cost = toBigIntAmount(data.upgrades[0].cost, 10n) || 10n
  u1Amount = Math.max(0, Number(data.upgrades[1].amount) || 0); u1Cost = toBigIntAmount(data.upgrades[1].cost, 50n) || 50n
  u2Amount = Math.max(0, Number(data.upgrades[2].amount) || 0); u2Cost = toBigIntAmount(data.upgrades[2].cost, 200n) || 200n
  u3Amount = Math.max(0, Number(data.upgrades[3].amount) || 0); u3Cost = toBigIntAmount(data.upgrades[3].cost, 500n) || 500n
  u4Amount = Math.max(0, Number(data.upgrades[4].amount) || 0); u4Cost = toBigIntAmount(data.upgrades[4].cost, 1000n) || 1000n
  u5Amount = Math.max(0, Number(data.upgrades[5].amount) || 0); u5Cost = toBigIntAmount(data.upgrades[5].cost, 2500n) || 2500n
  u6Amount = Math.max(0, Number(data.upgrades[6].amount) || 0); u6Cost = toBigIntAmount(data.upgrades[6].cost, 5000n) || 5000n
  u7Amount = Math.max(0, Number(data.upgrades[7].amount) || 0); u7Cost = toBigIntAmount(data.upgrades[7].cost, 10000n) || 10000n
  u8Amount = Math.max(0, Number(data.upgrades[8].amount) || 0); u8Cost = toBigIntAmount(data.upgrades[8].cost, 25000n) || 25000n
  unlockedMinigames = Math.max(0, Math.min(minigameUnlockOrder.length, Number(data.unlockedMinigames) || 0))
  minigameUnlockCost = toBigIntAmount(data.minigameUnlockCost, 2500n) < 2500n ? 2500n : toBigIntAmount(data.minigameUnlockCost, 2500n)
  megaFribbies = toBigIntAmount(data.megaFribbies)
  ascensionCount = Math.max(0, Number(data.ascensionCount) || 0)
  repeatableEchoes = Math.min(MAX_REPEATABLE_ECHOES, Math.max(0, Math.floor(Number(data.repeatableEchoes) || 0)))
  purchasedSkills = new Set(Array.isArray(data.purchasedSkills) ? data.purchasedSkills.filter(id => skillIdToIndex(id) >= 0 && id !== "path-12") : [])

  updateFribby()
  renderSkillTree()
  const labels = [
    `Extra Hand - (${u0Amount}, +1 Fribby per click) - ${u0Cost} Fribbies`,
    `Auto Thrower (${u1Amount}, +1 auto throw/sec) - ${u1Cost} Fribbies`,
    `Intern (${u2Amount}, +1 Fribby per auto throw) - ${u2Cost} Fribbies`,
    `Fribby Cannon (${u3Amount}, +5 Fribbies per click) - ${u3Cost} Fribbies`,
    `Supervisor (${u4Amount}, +5 Fribbies per auto throw) - ${u4Cost} Fribbies`,
    `Power Throw (${u5Amount}, +10 Fribbies per click) - ${u5Cost} Fribbies`,
    `Fribby Factory (${u6Amount}, +10 Fribbies per auto throw) - ${u6Cost} Fribbies`,
    `Turbo Thrower (${u7Amount}, +5 auto throws/sec) - ${u7Cost} Fribbies`,
    `Mega Cannon (${u8Amount}, +100 Fribbies per click) - ${u8Cost} Fribbies`
  ]
  labels.forEach((label, index) => {
    document.getElementById(`upgrade${index}`).textContent = label
  })
  refreshUpgradeLabels()
  document.getElementById("minigamesArea").hidden = unlockedMinigames === 0
  minigameUnlockOrder.forEach((game, index) => {
    const selector = document.querySelector(`[data-minigame="${game}"]`)
    if (selector) selector.hidden = index >= unlockedMinigames
  })
  updateMinigameUnlockButton()
  updateTabVisibility()
  if (getAutoThrowsPerSecond() > 0) updateAutoThrowInterval()
  saveGame(false)
}


/* Sound effects are separate from the background music mute setting. */
let sfxMuted = false
function toggleSfxMute() {
  sfxMuted = !sfxMuted
  const button = document.getElementById("sfxToggle")
  button.textContent = sfxMuted ? "🔇 Unmute SFX" : "🔊 Mute SFX"
  button.setAttribute("aria-pressed", String(sfxMuted))
  try { localStorage.setItem("fribbySfxMuted", String(sfxMuted)) } catch (error) {}
}

document.addEventListener("DOMContentLoaded", () => {
  try { sfxMuted = localStorage.getItem("fribbySfxMuted") === "true" } catch (error) {}
  const button = document.getElementById("sfxToggle")
  if (button) { button.textContent = sfxMuted ? "🔇 Unmute SFX" : "🔊 Mute SFX"; button.setAttribute("aria-pressed", String(sfxMuted)) }
  restoreUploadedMusic()
})

function playSoundEffect(elementId) {
  if (sfxMuted) return
  const sound = document.getElementById(elementId)
  if (!sound) return
  sound.currentTime = 0
  sound.play().catch(() => {
    // Playback may be blocked until the player interacts with the page.
  })
}

/* Background music: loops automatically when allowed by the browser. */
function updateMusicButton() {
  const audio = document.getElementById("backgroundMusic")
  const button = document.getElementById("musicToggle")
  if (!audio || !button) return

  if (audio.paused) {
    button.textContent = "▶ Play Music"
    button.setAttribute("aria-label", "Play background music")
    button.setAttribute("aria-pressed", "false")
  } else if (audio.muted) {
    button.textContent = "🔇 Unmute Music"
    button.setAttribute("aria-label", "Unmute background music")
    button.setAttribute("aria-pressed", "true")
  } else {
    button.textContent = "🔊 Mute Music"
    button.setAttribute("aria-label", "Mute background music")
    button.setAttribute("aria-pressed", "false")
  }
}

async function toggleMusic() {
  playSoundEffect("musicToggleSound")
  const audio = document.getElementById("backgroundMusic")
  if (!audio) return

  if (audio.paused) {
    audio.muted = false
    try {
      await audio.play()
    } catch (error) {
      // The browser may block playback until a user gesture; this button is one.
    }
  } else if (audio.muted) {
    audio.muted = false
  } else {
    audio.muted = true
  }
  updateMusicButton()
}

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("backgroundMusic")
  if (!audio) return
  audio.addEventListener("play", updateMusicButton)
  audio.addEventListener("pause", updateMusicButton)
  audio.addEventListener("volumechange", updateMusicButton)
  audio.play().then(updateMusicButton).catch(updateMusicButton)
  updateMusicButton()
})


/* Settings drawer and color theme */
function toggleSettings() {
  const dock = document.getElementById("settingsDock")
  const toggle = document.getElementById("settingsToggle")
  const panel = document.getElementById("settingsPanel")
  if (!dock || !toggle || !panel) return
  const open = !dock.classList.contains("settings-open")
  dock.classList.toggle("settings-open", open)
  toggle.classList.toggle("spinning", open)
  toggle.setAttribute("aria-expanded", String(open))
  toggle.setAttribute("aria-label", open ? "Close settings" : "Open settings")
  panel.setAttribute("aria-hidden", String(!open))
}

function toggleTheme() {
  const dark = !document.body.classList.contains("dark-mode")
  document.body.classList.toggle("dark-mode", dark)
  const button = document.getElementById("themeToggle")
  if (button) {
    button.textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode"
    button.setAttribute("aria-pressed", String(dark))
  }
  try { localStorage.setItem("fribbyTheme", dark ? "dark" : "light") } catch (error) {}
}

document.addEventListener("DOMContentLoaded", () => {
  let savedTheme = "light"
  try { savedTheme = localStorage.getItem("fribbyTheme") || "light" } catch (error) {}
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode")
    const button = document.getElementById("themeToggle")
    if (button) { button.textContent = "☀️ Light Mode"; button.setAttribute("aria-pressed", "true") }
  }
})


/* Persistent custom soundtrack storage (IndexedDB supports larger files than localStorage). */
const MUSIC_DB = "fribbyCustomMusicDB"
function openMusicDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error("IndexedDB unavailable"))
    const request = indexedDB.open(MUSIC_DB, 1)
    request.onupgradeneeded = () => request.result.createObjectStore("music")
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
async function uploadBackgroundMusic(event) {
  const file = event.target.files && event.target.files[0]
  if (!file) return
  const allowed = /\.(mp3|wav|ogg|m4a)$/i.test(file.name)
  if (!allowed) { alert("Choose an MP3, WAV, OGG, or M4A audio file."); event.target.value = ""; return }
  try {
    const db = await openMusicDB()
    await new Promise((resolve, reject) => {
      const tx = db.transaction("music", "readwrite")
      tx.objectStore("music").put(file, "customTrack")
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error)
    })
    db.close()
    const audio = document.getElementById("backgroundMusic")
    audio.src = URL.createObjectURL(file)
    audio.dataset.customTrack = "true"
    audio.play().catch(() => {})
    const status = document.getElementById("saveStatus")
    if (status) status.textContent = `Custom music saved for future sessions: ${file.name}`
  } catch (error) {
    alert("This browser couldn't store the music file. Try a smaller file or enable site storage.")
  }
  event.target.value = ""
}
async function restoreUploadedMusic() {
  try {
    const db = await openMusicDB()
    const file = await new Promise((resolve, reject) => {
      const request = db.transaction("music", "readonly").objectStore("music").get("customTrack")
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error)
    })
    db.close()
    if (file) {
      const audio = document.getElementById("backgroundMusic")
      audio.src = URL.createObjectURL(file)
      audio.dataset.customTrack = "true"
      audio.play().catch(() => {})
    }
  } catch (error) { /* Built-in soundtrack remains available. */ }
}
function wipeSave() {
  if (!confirm("Wipe all Fribby Thrower progress from this browser? This cannot be undone unless you exported a save.")) return
  try { localStorage.removeItem(GAME_SAVE_COOKIE) } catch (error) {}
  try { document.cookie = `${GAME_SAVE_COOKIE}=; Max-Age=0; path=/; SameSite=Lax` } catch (error) {}
  fribbies = 0n
  u0Amount=0; u0Cost=10n; u1Amount=0; u1Cost=50n; u2Amount=0; u2Cost=200n
  u3Amount=0; u3Cost=500n; u4Amount=0; u4Cost=1000n; u5Amount=0; u5Cost=2500n
  u6Amount=0; u6Cost=5000n; u7Amount=0; u7Cost=10000n; u8Amount=0; u8Cost=25000n
  clearInterval(autoThrowTimer)
  unlockedMinigames = 0; minigameUnlockCost = 2500n
  megaFribbies = 0n; ascensionCount = 0; repeatableEchoes = 0; purchasedSkills = new Set()
  document.querySelectorAll("[data-minigame]").forEach(button => button.hidden = true)
  document.getElementById("minigamesArea").hidden = true
  const defaults = ["Extra Hand (0, +1 Fribby per click) - 10 Fribbies","Auto Thrower (0, +1 auto throw/sec) - 50 Fribbies","Intern (0, +1 Fribby per auto throw) - 200 Fribbies","Fribby Cannon (0, +5 Fribbies per click) - 500 Fribbies","Supervisor (0, +5 Fribbies per auto throw) - 1000 Fribbies","Power Throw (0, +10 Fribbies per click) - 2500 Fribbies","Fribby Factory (0, +10 Fribbies per auto throw) - 5000 Fribbies","Foreman (0, +5 auto throws/sec) - 10000 Fribbies","Mega Cannon (0, +100 Fribbies per click) - 25000 Fribbies"]
  defaults.forEach((label,i) => { const button=document.getElementById(`upgrade${i}`); if(button) button.textContent=label })
  updateMinigameUnlockButton(); updateFribby(); renderSkillTree(); updateAscensionUI()
  const status = document.getElementById("saveStatus"); if(status) status.textContent = "Save wiped. A fresh game has started."
}


function updateTabVisibility() {
  const ascensionButton = document.querySelector('#topTabs [data-tab="ascension"]')
  const minigamesButton = document.querySelector('#topTabs [data-tab="minigames"]')
  const canAscend = fribbies >= ASCENSION_THRESHOLD || ascensionCount > 0 || megaFribbies > 0n
  if (ascensionButton) ascensionButton.hidden = !canAscend
  if (minigamesButton) minigamesButton.hidden = unlockedMinigames <= 0

  const activeButton = document.querySelector('#topTabs [data-tab].active')
  if (activeButton?.hidden) switchTab('game')
}

function switchTab(tab) {
  document.querySelectorAll("#tabPanels .tab-page").forEach(page => {
    page.hidden = page.dataset.page !== tab
  })
  document.querySelectorAll("#topTabs [data-tab]").forEach(button => {
    const active = button.dataset.tab === tab
    button.classList.toggle("active", active)
    button.setAttribute("aria-current", active ? "page" : "false")
  })
  if (tab === "ascension") {
    updateAscensionUI()
    renderSkillTree()
  }
}
function setupGameTabs() {
  const panels = document.getElementById("tabPanels")
  if (!panels) return
  const makePage = (id, title) => {
    const page = document.createElement("section")
    page.className = "tab-page"
    page.dataset.page = id
    page.setAttribute("aria-label", title)
    panels.appendChild(page)
    return page
  }
  const game = makePage("game", "Main Game")
  const ascension = makePage("ascension", "Ascension")
  const minigames = makePage("minigames", "Minigames")
  const leaderboard = makePage("leaderboard", "Leaderboard")
  const settings = makePage("settings", "Settings")
  const clicker = document.querySelector(".clicker-area")
  const ascensionPanel = document.getElementById("ascensionPanel")
  const skillTree = document.getElementById("skillTreePanel")
  const mini = document.getElementById("minigamesArea")
  const board = document.getElementById("leaderboardArea")
  const dock = document.getElementById("settingsDock")
  if (ascensionPanel) ascensionPanel.remove()
  if (clicker) game.appendChild(clicker)
  if (ascensionPanel) ascension.appendChild(ascensionPanel)
  if (skillTree) ascension.appendChild(skillTree)
  if (mini) minigames.appendChild(mini)
  if (board) leaderboard.appendChild(board)
  if (dock) settings.appendChild(dock)
  // Make settings immediately usable in its dedicated tab.
  const panel = document.getElementById("settingsPanel")
  if (panel) {
    panel.classList.add("settings-tab-open")
    panel.setAttribute("aria-hidden", "false")
  }
  switchTab("game")
  updateTabVisibility()
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupGameTabs)
else setupGameTabs()
