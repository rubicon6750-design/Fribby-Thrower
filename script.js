let fribbies = 0n
let megaFribbies = 0n
let ascensionCount = 0
let purchasedSkills = new Set()
let repeatableEchoes = 0
const ASCENSION_THRESHOLD = 1000000n
const MAX_REPEATABLE_ECHOES = 1000
// Preserve existing skill IDs for save compatibility; Eternal Echo remains the repeatable endgame upgrade.
const skillBranches = [
  { id: "auto", name: "Automation", description: "More throws, faster cycles, and machinery that feeds itself.", count: 12 },
  { id: "cheap", name: "Cheaper Upgrades", description: "Lower regular-upgrade costs and keep each run efficient.", count: 12 },
  { id: "strong", name: "Stronger Upgrades", description: "Improve the strength and scaling of your regular upgrades.", count: 12 },
  { id: "path", name: "Ascension Path", description: "The central path opens deeper branches of the web.", count: 12 },
  { id: "click", name: "Clicking Power", description: "Sharper throws, critical hits, and powerful manual clicks.", count: 12 },
  { id: "mega", name: "Mega Fribbies", description: "Get more from each ascension and previous runs.", count: 12 },
  { id: "mini", name: "Minigame Lore", description: "Improve minigame rewards and make challenges pay off.", count: 12 },
  // Keep the legacy internal ID so existing saves retain their purchased nodes, but replace the minigame-focused branch with a different mechanic.
  { id: "arcade", name: "Synergy Matrix", description: "Link click and automation upgrades so balanced builds, paired families, and cross-effects become stronger.", count: 12 },
  { id: "collection", name: "Minigame Collection", description: "Unlock new challenges and build a bigger arcade, one discovery at a time.", count: 12 },
  { id: "engineering", name: "Engineering", description: "Build Scratch-like block scripts to throw, buy upgrades, and ascend.", count: 12 }
]
const skillNames = {
  path: ["First Spark", "Pocketed Pouch", "Lucky Compass", "Branching Fate", "Runner's Rhythm", "Discount Glyph", "Minigame Lore", "Starbound Route", "Astral Focus", "Frugal Passage", "Ancient Knowledge", "Ascendant Heart", "Eternal Echo: Transcendence"],
  strong: ["Reinforced Grip", "Automation Manual", "Budget Blueprint", "Spare Gear", "Compound Crew", "Double Shift", "Cannon Lathing", "Idle Logistics", "Minigame Playbook", "Torque Calibration", "Factory Foreman", "Grand Foundry", "Eternal Echo: Grand Foundry"],
  click: ["Lucky Reflex", "Steady Aim", "Split-Second", "Heavy Disc", "Double Grip", "Charged Toss", "Cannon Synergy", "Bullseye", "Muscle Memory", "Meteor Arm", "Quick Release", "Cosmic Launch", "Eternal Echo: Cosmic Launch"],
  mega: ["Packed Satchel", "Lucky Star", "Deep Reserve", "Overflowing Core", "Past Lives", "Golden Harvest", "Early Ascender", "Relic Pockets", "Singular Offering", "Echo Chamber", "Infinite Bounty", "Mega Mastery", "Eternal Echo: Mega Mastery"],
  cheap: ["Bulk Order", "Click Coupon", "Machine Rebate", "Arcade Voucher", "Supplier Pact", "Heavy Parts Deal", "Stockpile Savings", "Automation Contract", "Precision Coupon", "Wholesale Network", "Clearance Ledger", "Cost Collapse", "Eternal Echo: Cost Collapse"],
  auto: ["Clockwork Wrist", "Oiled Bearings", "Double Pendulum", "Overtime Circuit", "Self-Feeding Line", "Turbo Thrower", "Unattended Shift", "Assembly Swarm", "Chrono Engine", "Infinite Conveyor", "Feedback Reactor", "Singularity Engine", "Eternal Echo: Singularity Engine"],
  mini: ["Practice Round", "Prize Pouch", "Pattern Sense", "Lucky Streak", "Sweep Expert", "Bonus Round", "Arcade Scholar", "Risk Assessment", "Master Player", "Grand Champion", "Hidden Cabinet", "Perfect Run", "Eternal Echo: Perfect Run"],
  arcade: ["Coupled Grip", "Shared Motion", "Cannon-Furnace Link", "Balance Window", "Turbo Resonance", "Dual-Fuel Engine", "Matched Output", "Counterweight", "Feedback Dividend", "Family Resonance", "Synthesis Refund", "Matrix Singularity", "Eternal Echo: Perfect Harmony"],
  collection: ["Number Scout", "Prize Practice", "Odd-One Spotter", "Sharp Eyes", "Memory Keeper", "Steady Hands", "Odds Caller", "Risk Reader", "Target Trainer", "Fast Fingers", "Word Scrambler", "Grand Arcade", "Eternal Echo: Grand Arcade"],
  engineering: ["Block Basics", "Throw Loop", "Upgrade Routine", "Smart Shopper", "Repeat Until Rich", "Ascension Protocol", "Branch Logic", "Cost Scanner", "Click Circuit", "Idle Engineer", "Macro Workshop", "Autonomous Fribby", "Eternal Echo: Infinite Program"]
}
const skillEffects = {
  path: [
    "Click power gains +10 Fribbies per throw", "Start each ascension run with 1,000 Fribbies", "+10% minigame rewards", "Opens the next rung across every branch", "+5 automatic throws per second", "Regular upgrade prices -5%", "+15% minigame rewards", "+15% automatic payout", "+15% click payout", "Minigame unlock prices -20%", "+10 Fribbies per automatic throw", "+10% click and automatic payout", "+5% click and automatic payout per level; repeatable"
  ],
  strong: [
    "Click and automatic payout +15%", "Automatic throws pay +20%", "Regular upgrade prices -10%", "Every 5 regular upgrade levels adds +10% click and automatic payout, up to +50%", "Every 5 Auto Throwers adds +20% automatic payout, up to +80%", "Automatic payout +100% once you reach 10 throws per second", "Mega Cannon gains +50% click power", "Each Turbo Thrower adds +10% automatic payout, up to +100%", "+20% minigame rewards", "Click payout +20%", "Automatic payout +30%", "Click and automatic payout +20%"
  , "All regular upgrades are 25% stronger."],
  click: [
    "Critical-hit chance +10 percentage points", "Click payout +25%", "5% chance to triple click payout", "+50 Fribbies per click", "Each Extra Hand adds +5 additional Fribbies per click", "Critical hits deal 5× normal click payout", "Each Fribby Cannon adds +20 Fribbies per click", "10% chance to triple click payout", "Extra Hand grant up to +100% click payout", "+250 Fribbies per click", "Click payout +30%", "Click payout +50%"
  , "Clicking power is increased by 50%."],
  mega: [
    "+5 Mega Fribbies on every ascension", "Ascension reward +20%", "Gain an extra 20% of the base reward", "+25 Mega Fribbies when within 250,000 Fribbies of the threshold", "Ascension reward +2% per previous ascension", "Ascension reward +15%", "+1 Mega Fribby per 2 previous ascensions", "+10 Mega Fribbies when all fourteen minigames are unlocked", "+25% on ascensions worth 10+ Mega Fribbies", "+5% reward per other Mega Fribby upgrade", "+15 Mega Fribbies when ascending from 5,000,000+ Fribbies", "Ascension reward +30%"
  , "Gain 25% more Mega Fribbies from every ascension."],
  cheap: ["All regular upgrade prices -8%", "Click-focused upgrade prices -10%", "Automation upgrade prices -12%", "Minigame unlock price -20%", "All regular upgrade prices -10%", "Fribby Cannon and Mega Cannon prices -20%", "All regular upgrade prices -12%", "Auto Thrower and Turbo Thrower prices -25%", "Click-focused upgrade prices -20%", "All regular upgrade prices -14%", "All regular upgrade prices -16%", "All regular upgrade prices -20%", "All regular upgrade prices are reduced by 20%."],
  auto: ["+5 automatic throws per second", "Automatic payout +25%", "Each Auto Thrower adds an extra +1 throw/sec, up to +20", "Each Auto Thrower adds +5% automatic payout, up to +50%", "Automatic payout +15%", "Each Auto Thrower adds +10 Fribbies per automatic throw", "Every 5 automatic throws/sec adds +10% payout, up to +100%", "Each Turbo Thrower adds +2 Fribbies to automatic payout", "+25% automatic payout; every 5 Turbo Throwers adds +1 base Fribby", "Automatic payout +40%, +5 base payout, and +5 throws per second", "Each Fribby Factory adds +10% automatic payout, up to +100%", "Automatic payout +50%, +10 base payout, and +5 throws per second", "Automatic throws are 50% faster and pay 25% more."],
  mini: ["Minigame rewards +10%", "Minigame unlock prices -10%", "+5% minigame rewards per unlocked game", "Minigame rewards +15%", "Minigame rewards +25%", "Minigame rewards +20%", "Ascension reward +2% per unlocked minigame", "Minigame rewards +25%", "Minigame rewards +30%", "All minigame rewards +40%", "Minigame rewards +35%", "Minigame rewards +50% and ascension reward +10%", "All minigame rewards are increased by 50%."],
  arcade: [
    "Each Auto Thrower level adds +1% click payout, up to +30%.",
    "Each Extra Hand level adds +1% automatic payout, up to +30%.",
    "Each Fribby Factory adds +1 base Fribby per click; each Fribby Cannon adds +1 base Fribby per auto throw.",
    "When both upgrade groups are owned and their level totals differ by 3 or less, click and auto payout +25%.",
    "Each Turbo Thrower level adds +2% click payout, up to +40%.",
    "Every 10 levels in both click and automation upgrades grants +1 automatic throw per second, up to +3.",
    "Each matched level across paired upgrade families adds +1% to click and auto payout, up to +30%.",
    "The upgrade group with fewer levels gains +30% payout; a non-zero tie grants +15% to both.",
    "Each manual throw also earns 10% of your current automatic throw reward.",
    "Each paired upgrade family you own on both sides adds +5% to click and auto payout, up to +35%.",
    "Buying an upgrade whose paired family you own refunds 5% of its cost.",
    "All other Synergy Matrix effects are doubled.",
    "All Synergy Matrix effects gain another 25% power."
  ],
  collection: ["Unlock Quick Count", "All minigame rewards +10%", "Unlock Odd One Out", "Minigame rewards +15%", "Unlock Sum Sprint", "Minigame rewards +20%", "Unlock Color Mixer", "Minigame rewards +25%", "Unlock Disc Golf", "Minigame rewards +30%", "Unlock Word Shuffle", "All minigame rewards +50%", "All minigames grant 25% more Fribbies per unlocked minigame."],
  engineering: ["Unlock the block editor", "Run repeated throw blocks", "Buy upgrades from scripts", "Prioritize affordable upgrades", "Repeat a routine while enabled", "Allow scripts to request ascension", "Add conditional blocks to routines", "Read upgrade affordability", "Run throw sequences quickly", "Keep scripts between sessions", "Build longer block programs", "Unlock unattended routines", "Engineering scripts run 25% faster."]
}
const skillBranchOrder = ["auto", "cheap", "strong", "path", "click", "mega", "mini", "arcade", "collection", "engineering"]
const skillNodeIcons = { path: "◇", strong: "▰", click: "⊕", mega: "✧", cheap: "−", auto: "↻", mini: "▦", arcade: "⧉", collection: "▧", engineering: "⌘" }
const skillNodeIconSets = {
  path: Array(13).fill("◇"),
  strong: Array(13).fill("▰"),
  click: Array(13).fill("⊕"),
  mega: Array(13).fill("✧"),
  cheap: Array(13).fill("−"),
  auto: Array(13).fill("↻"),
  mini: Array(13).fill("▦"),
  arcade: Array(13).fill("⧉"),
  collection: Array(13).fill("▧"),
  engineering: Array(13).fill("⌘")
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
let u9Amount = 0
let u9Cost = 50000n
let u10Amount = 0
let u10Cost = 100000n
let u11Amount = 0
let u11Cost = 250000n
let u12Amount = 0
let u12Cost = 500000n
let u13Amount = 0
let u13Cost = 1000000n
let u14Amount = 0
let u14Cost = 2500000n

let autoThrowTimer
let gameSaveDirty = false
let statsDisplayEnabled = false
let recentFribbyClicks = []
const FRIBBY_STATS_WINDOW_MS = 10000

function updateFribby() {
  document.getElementById("fribbyAmount").innerText = "Fribbies: " + formatFribbies(fribbies)
  updateAscensionUI()
  updateTabVisibility()
  gameSaveDirty = true
  updateFribbyStats()
}
function hasSkill(id) { return purchasedSkills.has(id) }
function countSkills(branch) {
  return [...purchasedSkills].filter(id => id.startsWith(branch + "-") && id !== "path-12" && !id.endsWith("-12")).length
}
function pathSkillCount() {
  return [...purchasedSkills].filter(id => /^path-(?:[0-9]|1[01])$/.test(id)).length
}
function getRegularUpgradeCost(cost, upgradeIndex = -1) {
  let discount = (hasSkill("path-5") ? 5 : 0) + (hasSkill("strong-2") ? 10 : 0)
  const generalDiscounts = [[0, 8], [4, 10], [6, 12], [9, 14], [10, 16], [11, 20]]
  generalDiscounts.forEach(([index, amount]) => { if (hasSkill(`cheap-${index}`)) discount += amount })
  const clickUpgrades = [0, 3, 5, 8, 9, 11]
  const automationUpgrades = [1, 2, 4, 6, 7, 10, 12]
  if (clickUpgrades.includes(upgradeIndex)) {
    discount += (hasSkill("cheap-1") ? 10 : 0) + (hasSkill("cheap-8") ? 20 : 0)
  }
  if (automationUpgrades.includes(upgradeIndex) && hasSkill("cheap-2")) discount += 12
  if ([3, 8].includes(upgradeIndex) && hasSkill("cheap-5")) discount += 20
  if ([1, 7].includes(upgradeIndex) && hasSkill("cheap-7")) discount += 25
  if (hasSkill("cheap-12")) discount += 20
  discount = Math.min(90, discount)
  const price = BigInt(100 - discount) * cost / 100n
  return price > 0n ? price : 1n
}
function getMinigameUnlockPrice() {
  let discount = hasSkill("path-9") ? 20 : 0
  if (hasSkill("mini-1")) discount += 10
  if (hasSkill("cheap-3")) discount += 20
  return (minigameUnlockCost * BigInt(100 - discount) / 100n) || 1n
}
function addMinigameClickPowerNotes() {
  document.querySelectorAll('[id^="minigame-"]').forEach(panel => {
    if (panel.id === "minigamesArea" || panel.querySelector(".minigame-click-power-note")) return;
    const note = document.createElement("p");
    note.className = "minigame-click-power-note";
    note.textContent = "Minigame Fribby rewards are multiplied by your current clicking power.";
    note.setAttribute("aria-live", "polite");
    panel.insertBefore(note, panel.firstChild);
  });
}

function getMinigameRewardMultiplierPercent() {
  let bonus = (hasSkill("path-2") ? 10 : 0) + (hasSkill("path-6") ? 15 : 0) + (hasSkill("strong-8") ? 20 : 0)
  const miniBonuses = [10, 0, 0, 15, 25, 20, 0, 25, 30, 40, 35, 50]
  miniBonuses.forEach((amount, index) => { if (hasSkill(`mini-${index}`)) bonus += amount })
  if (hasSkill("mini-2")) bonus += getTotalUnlockedMinigames() * 5
  bonus += (hasSkill("collection-1") ? 10 : 0) + (hasSkill("collection-3") ? 15 : 0) + (hasSkill("collection-5") ? 20 : 0) + (hasSkill("collection-7") ? 25 : 0) + (hasSkill("collection-9") ? 30 : 0) + (hasSkill("collection-11") ? 50 : 0)
  if (hasSkill("mini-12")) bonus += 50
  if (hasSkill("collection-12")) bonus += 25 * getTotalUnlockedMinigames()
  return 100 + bonus
}
function getMinigamePayout(baseReward) {
  let bonusPercent = getMinigameRewardMultiplierPercent()
  return BigInt(baseReward) * BigInt(getFribbiesPerClick()) * BigInt(bonusPercent) / 100n
}
function getAutoThrowsPerSecond() {
  return u1Amount + u7Amount * 5 + (hasSkill("path-4") ? 5 : 0)
    + (hasSkill("auto-0") ? 5 : 0) + (hasSkill("auto-2") ? Math.min(20, u1Amount) : 0) + (hasSkill("auto-9") ? 5 : 0)
    + (hasSkill("auto-11") ? 5 : 0) + (hasSkill("auto-12") ? Math.max(1, Math.floor(u1Amount * 0.5)) : 0)
    + getSynergyMatrixAutoThrowBonus()
}
function getRegularUpgradeLevelCount() {
  return u0Amount + u1Amount + u2Amount + u3Amount + u4Amount + u5Amount + u6Amount + u7Amount + u8Amount + u9Amount + u10Amount + u11Amount + u12Amount + u13Amount + u14Amount
}

// The Synergy Matrix pairs one click-focused upgrade with one automation-focused upgrade.
// `arcade-*` remains the internal ID only for compatibility with existing local and exported saves.
const SYNERGY_MATRIX_UPGRADE_FAMILIES = [[0, 1], [3, 2], [5, 4], [8, 6], [9, 10], [11, 12], [13, 14]]
function getRegularUpgradeAmount(index) {
  return [u0Amount, u1Amount, u2Amount, u3Amount, u4Amount, u5Amount, u6Amount, u7Amount, u8Amount, u9Amount, u10Amount, u11Amount, u12Amount, u13Amount, u14Amount][index] || 0
}
function getClickUpgradeLevelCount() {
  return u0Amount + u3Amount + u5Amount + u8Amount + u9Amount + u11Amount + u13Amount
}
function getAutomationUpgradeLevelCount() {
  return u1Amount + u2Amount + u4Amount + u6Amount + u7Amount + u10Amount + u12Amount + u14Amount
}
function getSynergyMatrixMatchedLevels() {
  return SYNERGY_MATRIX_UPGRADE_FAMILIES.reduce((total, [clickIndex, autoIndex]) =>
    total + Math.min(getRegularUpgradeAmount(clickIndex), getRegularUpgradeAmount(autoIndex)), 0)
}
function getSynergyMatrixOwnedFamilies() {
  return SYNERGY_MATRIX_UPGRADE_FAMILIES.filter(([clickIndex, autoIndex]) =>
    getRegularUpgradeAmount(clickIndex) > 0 && getRegularUpgradeAmount(autoIndex) > 0).length
}
function getSynergyMatrixMultiplierPercent() {
  return 100 + (hasSkill("arcade-11") ? 100 : 0) + (hasSkill("arcade-12") ? 25 : 0)
}
function applySynergyMatrixMultiplier(value) {
  return Math.floor(value * getSynergyMatrixMultiplierPercent() / 100)
}
function getSynergyMatrixClickBonusPercent() {
  const clickLevels = getClickUpgradeLevelCount()
  const autoLevels = getAutomationUpgradeLevelCount()
  let bonus = 0
  if (hasSkill("arcade-0")) bonus += Math.min(30, u1Amount)
  if (hasSkill("arcade-3") && clickLevels > 0 && autoLevels > 0 && Math.abs(clickLevels - autoLevels) <= 3) bonus += 25
  if (hasSkill("arcade-4")) bonus += Math.min(40, u7Amount * 2)
  if (hasSkill("arcade-6")) bonus += Math.min(30, getSynergyMatrixMatchedLevels())
  if (hasSkill("arcade-7")) {
    if (clickLevels < autoLevels) bonus += 30
    else if (clickLevels === autoLevels && clickLevels > 0) bonus += 15
  }
  if (hasSkill("arcade-9")) bonus += getSynergyMatrixOwnedFamilies() * 5
  return applySynergyMatrixMultiplier(bonus)
}
function getSynergyMatrixAutoBonusPercent() {
  const clickLevels = getClickUpgradeLevelCount()
  const autoLevels = getAutomationUpgradeLevelCount()
  let bonus = 0
  if (hasSkill("arcade-1")) bonus += Math.min(30, u0Amount)
  if (hasSkill("arcade-3") && clickLevels > 0 && autoLevels > 0 && Math.abs(clickLevels - autoLevels) <= 3) bonus += 25
  if (hasSkill("arcade-6")) bonus += Math.min(30, getSynergyMatrixMatchedLevels())
  if (hasSkill("arcade-7")) {
    if (autoLevels < clickLevels) bonus += 30
    else if (autoLevels === clickLevels && autoLevels > 0) bonus += 15
  }
  if (hasSkill("arcade-9")) bonus += getSynergyMatrixOwnedFamilies() * 5
  return applySynergyMatrixMultiplier(bonus)
}
function getSynergyMatrixAutoThrowBonus() {
  if (!hasSkill("arcade-5")) return 0
  return applySynergyMatrixMultiplier(Math.min(3, Math.floor(Math.min(getClickUpgradeLevelCount(), getAutomationUpgradeLevelCount()) / 10)))
}
function getSynergyMatrixPurchaseRefund(index, purchaseCost) {
  if (!hasSkill("arcade-10") || purchaseCost <= 0n) return 0n
  const family = SYNERGY_MATRIX_UPGRADE_FAMILIES.find(([clickIndex, autoIndex]) => clickIndex === index || autoIndex === index)
  if (!family) return 0n
  const partnerIndex = family[0] === index ? family[1] : family[0]
  if (getRegularUpgradeAmount(partnerIndex) <= 0) return 0n
  // Five percent at base strength; Matrix upgrades amplify the refund too.
  return purchaseCost * 5n * BigInt(getSynergyMatrixMultiplierPercent()) / 10000n
}
function getClickBonusPercent() {
  return 100
    + (hasSkill("strong-0") ? 15 : 0) + (hasSkill("strong-12") ? 25 : 0)
    + (hasSkill("strong-3") ? Math.min(50, Math.floor(getRegularUpgradeLevelCount() / 5) * 10) : 0)
    + (hasSkill("strong-9") ? 20 : 0)
    + (hasSkill("strong-11") ? 20 : 0)
    + (hasSkill("click-1") ? 25 : 0)
    + (hasSkill("click-10") ? 30 : 0)
    + (hasSkill("click-11") ? 50 : 0)
    + (hasSkill("click-8") ? Math.min(100, u0Amount) : 0)
    + (hasSkill("path-8") ? 15 : 0)
    + (hasSkill("path-11") ? 10 : 0)
    + (repeatableEchoes * 5) + (hasSkill("click-12") ? 50 : 0)
    + getSynergyMatrixClickBonusPercent()
}
function getAutoBonusPercent() {
  return 100
    + (hasSkill("strong-0") ? 15 : 0)
    + (hasSkill("strong-1") ? 20 : 0)
    + (hasSkill("strong-3") ? Math.min(50, Math.floor(getRegularUpgradeLevelCount() / 5) * 10) : 0)
    + (hasSkill("strong-5") && getAutoThrowsPerSecond() >= 10 ? 100 : 0)
    + (hasSkill("strong-10") ? 30 : 0)
    + (hasSkill("strong-11") ? 20 : 0)
    + (hasSkill("strong-7") ? Math.min(100, u7Amount * 10) : 0)
    + (hasSkill("path-7") ? 15 : 0)
    + (hasSkill("path-11") ? 10 : 0)
    + (hasSkill("strong-4") ? Math.min(80, Math.floor(u1Amount / 5) * 20) : 0)
    + (hasSkill("auto-1") ? 25 : 0)
    + (hasSkill("auto-3") ? Math.min(50, u1Amount * 5) : 0)
    + (hasSkill("auto-6") ? Math.min(100, Math.floor(getAutoThrowsPerSecond() / 5) * 10) : 0)
    + (hasSkill("auto-4") ? 15 : 0)
    + (hasSkill("auto-8") ? 25 : 0)
    + (hasSkill("auto-9") ? 40 : 0)
    + (hasSkill("auto-10") ? Math.min(100, u6Amount * 10) : 0)
    + (hasSkill("auto-11") ? 50 : 0)
    + (hasSkill("auto-12") ? 25 : 0)
    + (repeatableEchoes * 5)
    + getSynergyMatrixAutoBonusPercent()
}
function refreshUpgradeLabels() {
  const labels = [
    `Extra Hand (${u0Amount}, +1 Fribby per click) - ${formatFribbies(getRegularUpgradeCost(u0Cost, 0))} Fribbies`,
    `Auto Thrower (${u1Amount}, +1 auto throw/sec) - ${formatFribbies(getRegularUpgradeCost(u1Cost, 1))} Fribbies`,
    `Intern (${u2Amount}, +1 Fribby per auto throw) - ${formatFribbies(getRegularUpgradeCost(u2Cost, 2))} Fribbies`,
    `Fribby Cannon (${u3Amount}, +5 Fribbies per click) - ${formatFribbies(getRegularUpgradeCost(u3Cost, 3))} Fribbies`,
    `Supervisor (${u4Amount}, +5 Fribbies per auto throw) - ${formatFribbies(getRegularUpgradeCost(u4Cost, 4))} Fribbies`,
    `Power Throw (${u5Amount}, +10 Fribbies per click) - ${formatFribbies(getRegularUpgradeCost(u5Cost, 5))} Fribbies`,
    `Fribby Factory (${u6Amount}, +10 Fribbies per auto throw) - ${formatFribbies(getRegularUpgradeCost(u6Cost, 6))} Fribbies`,
    `Turbo Thrower (${u7Amount}, +5 auto throws/sec) - ${formatFribbies(getRegularUpgradeCost(u7Cost, 7))} Fribbies`,
    `Mega Cannon (${u8Amount}, +${hasSkill("strong-6") ? 150 : 100} Fribbies per click) - ${formatFribbies(getRegularUpgradeCost(u8Cost, 8))} Fribbies`,
    `Power Cannon (${u9Amount}, +500 Fribbies per click) - ${formatFribbies(getRegularUpgradeCost(u9Cost, 9))} Fribbies`,
    `Factory Intern (${u10Amount}, +25 Fribbies per auto throw) - ${formatFribbies(getRegularUpgradeCost(u10Cost, 10))} Fribbies`,
    `Turbo Cannon (${u11Amount}, +2,500 Fribbies per click) - ${formatFribbies(getRegularUpgradeCost(u11Cost, 11))} Fribbies`,
    `Mega Factory (${u12Amount}, +100 Fribbies per auto throw) - ${formatFribbies(getRegularUpgradeCost(u12Cost, 12))} Fribbies`,
    `Super Cannon (${u13Amount}, +10,000 Fribbies per click) - ${formatFribbies(getRegularUpgradeCost(u13Cost, 13))} Fribbies`,
    `Turbo Factory (${u14Amount}, +500 Fribbies per auto throw) - ${formatFribbies(getRegularUpgradeCost(u14Cost, 14))} Fribbies`
  ]
  labels.forEach((label, index) => {
    const button = document.getElementById(`upgrade${index}`)
    if (button) button.textContent = label
  })
}
function getFribbiesPerClick() {
  let base = u0Amount + 1 + u3Amount * 5 + u5Amount * 10 + u8Amount * (hasSkill("strong-6") ? 150 : 100) + u9Amount * 500 + u11Amount * 2500 + u13Amount * 10000
  if (hasSkill("arcade-2")) base += applySynergyMatrixMultiplier(u6Amount)
  if (hasSkill("path-0")) base += 10
  if (hasSkill("path-8")) base += 0
  if (hasSkill("click-3")) base += 50
  if (hasSkill("click-4")) base += u0Amount * 5
  if (hasSkill("click-6")) base += u3Amount * 20
  if (hasSkill("click-9")) base += 250
  return Math.max(1, Math.floor(base * getClickBonusPercent() / 100))
}
function getAutoThrowReward() {
  let base = 1 + u2Amount + u4Amount * 5 + u6Amount * 10 + u10Amount * 25 + u12Amount * 100 + u14Amount * 500
  if (hasSkill("arcade-2")) base += applySynergyMatrixMultiplier(u3Amount)
  if (hasSkill("path-10")) base += 10
  if (hasSkill("auto-5")) base += u1Amount * 10
  if (hasSkill("auto-7")) base += u7Amount * 2
  if (hasSkill("auto-8")) base += Math.floor(u7Amount / 5)
  if (hasSkill("auto-9")) base += 5
  if (hasSkill("auto-11")) base += 10
  return Math.max(1, Math.floor(base * getAutoBonusPercent() / 100))
}

function throwFribby() {
  playSoundEffect("throwSound")
  let gain = getFribbiesPerClick()
  if (hasSkill("arcade-8")) gain += Math.floor(getAutoThrowReward() * getSynergyMatrixMultiplierPercent() / 1000)
  const criticalChance = (hasSkill("click-0") ? 10 : 0) + (hasSkill("click-2") ? 5 : 0) + (hasSkill("click-7") ? 10 : 0)
  if (criticalChance > 0 && Math.random() * 100 < criticalChance) gain *= hasSkill("click-5") ? 5 : 3
  triggerFribbyClickEffect(gain)
  if (statsDisplayEnabled) {
    const now = Date.now()
    recentFribbyClicks.push({ time: now, gain })
    pruneRecentFribbyClicks(now)
  }
  fribbies += BigInt(gain)
  updateFribby()
}

function buy0() {
  const purchaseCost = getRegularUpgradeCost(u0Cost, 0)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(0, purchaseCost)
   fribbies -= purchaseCost
   u0Amount += 1
   u0Cost = u0Cost * 3n
   updateFribby()
   document.getElementById("upgrade0").innerText =
        "Extra Hand - (" + u0Amount + ", +1 Fribby per click) - " + formatFribbies(u0Cost) + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy1() {
  const purchaseCost = getRegularUpgradeCost(u1Cost, 1)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(1, purchaseCost)
   fribbies -= purchaseCost
      u1Amount += 1
   u1Cost = (u1Cost * 3n + 1n) / 2n
   updateFribby()
   document.getElementById("upgrade1").innerText =
        "Auto Thrower (" + u1Amount + ", +1 auto throw/sec) - " + formatFribbies(u1Cost) + " Fribbies"
   refreshUpgradeLabels()
   updateAutoThrowInterval()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy2() {
  const purchaseCost = getRegularUpgradeCost(u2Cost, 2)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(2, purchaseCost)
   fribbies -= purchaseCost
      u2Amount += 1
   u2Cost = (u2Cost * 3n + 1n) / 2n
   updateFribby()
   document.getElementById("upgrade2").innerText =
        "Intern (" + u2Amount + ", +1 Fribby per auto throw) - " + formatFribbies(u2Cost) + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy3() {
  const purchaseCost = getRegularUpgradeCost(u3Cost, 3)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(3, purchaseCost)
    fribbies -= purchaseCost
    u3Amount += 1
    u3Cost = (u3Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade3").innerText =
      "Fribby Cannon (" + u3Amount + ", +5 Fribbies per click) - " + formatFribbies(u3Cost) + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy4() {
  const purchaseCost = getRegularUpgradeCost(u4Cost, 4)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(4, purchaseCost)
    fribbies -= purchaseCost
    u4Amount += 1
    u4Cost = (u4Cost * 3n + 1n) / 2n
    updateFribby()
       document.getElementById("upgrade4").innerText =
        "Supervisor (" + u4Amount + ", +5 Fribbies per auto throw) - " + formatFribbies(u4Cost) + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy5() {
  const purchaseCost = getRegularUpgradeCost(u5Cost, 5)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(5, purchaseCost)
    fribbies -= purchaseCost
    u5Amount += 1
    u5Cost = (u5Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade5").innerText =
      "Power Throw (" + u5Amount + ", +10 Fribbies per click) - " + formatFribbies(u5Cost) + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy6() {
  const purchaseCost = getRegularUpgradeCost(u6Cost, 6)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(6, purchaseCost)
    fribbies -= purchaseCost
    u6Amount += 1
    u6Cost = (u6Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade6").innerText =
      "Fribby Factory (" + u6Amount + ", +10 Fribbies per auto throw) - " + formatFribbies(u6Cost) + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy7() {
  const purchaseCost = getRegularUpgradeCost(u7Cost, 7)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(7, purchaseCost)
    fribbies -= purchaseCost
    u7Amount += 1
    u7Cost = (u7Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade7").innerText =
      "Turbo Thrower (" + u7Amount + ", +5 auto throws/sec) - " + formatFribbies(u7Cost) + " Fribbies"
   refreshUpgradeLabels()
    updateAutoThrowInterval()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy8() {
  const purchaseCost = getRegularUpgradeCost(u8Cost, 8)
  if (fribbies >= purchaseCost) {
   playSoundEffect("upgradeSound")
   triggerRegularUpgradeEffect(8, purchaseCost)
    fribbies -= purchaseCost
    u8Amount += 1
    u8Cost = (u8Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade8").innerText =
      "Mega Cannon (" + u8Amount + ", +100 Fribbies per click) - " + formatFribbies(u8Cost) + " Fribbies"
   refreshUpgradeLabels()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy9() { purchaseNewRegularUpgrade(9) }
function buy10() { purchaseNewRegularUpgrade(10) }
function buy11() { purchaseNewRegularUpgrade(11) }
function buy12() { purchaseNewRegularUpgrade(12) }
function buy13() { purchaseNewRegularUpgrade(13) }
function buy14() { purchaseNewRegularUpgrade(14) }
function purchaseNewRegularUpgrade(index) {
  const costs = [u9Cost, u10Cost, u11Cost, u12Cost, u13Cost, u14Cost]
  const purchaseCost = getRegularUpgradeCost(costs[index - 9], index)
  if (fribbies < purchaseCost) {
    playSoundEffect("upgradeFailSound")
    return
  }
  playSoundEffect("upgradeSound")
  triggerRegularUpgradeEffect(index, purchaseCost)
  fribbies -= purchaseCost
  if (index === 9) { u9Amount++; u9Cost = (u9Cost * 3n + 1n) / 2n }
  else if (index === 10) { u10Amount++; u10Cost = (u10Cost * 3n + 1n) / 2n }
  else if (index === 11) { u11Amount++; u11Cost = (u11Cost * 3n + 1n) / 2n }
  else if (index === 12) { u12Amount++; u12Cost = (u12Cost * 3n + 1n) / 2n }
  else if (index === 13) { u13Amount++; u13Cost = (u13Cost * 3n + 1n) / 2n }
  else if (index === 14) { u14Amount++; u14Cost = (u14Cost * 3n + 1n) / 2n }
  updateFribby()
  refreshUpgradeLabels()
}

function toggleStatsDisplay() {
  statsDisplayEnabled = !statsDisplayEnabled
  if (!statsDisplayEnabled) recentFribbyClicks = []
  const button = document.getElementById("statsToggle")
  const panel = document.getElementById("fribbyStats")
  if (button) {
    button.textContent = statsDisplayEnabled ? "📊 Hide Fribby Stats: On" : "📊 Show Fribby Stats: Off"
    button.setAttribute("aria-pressed", String(statsDisplayEnabled))
  }
  if (panel) panel.hidden = !statsDisplayEnabled
  try { localStorage.setItem("fribbyStatsDisplay", String(statsDisplayEnabled)) } catch (error) {}
  updateFribbyStats()
}

function pruneRecentFribbyClicks(now = Date.now()) {
  const cutoff = now - FRIBBY_STATS_WINDOW_MS
  while (recentFribbyClicks.length && recentFribbyClicks[0].time < cutoff) recentFribbyClicks.shift()
}

function updateFribbyStats() {
  if (!statsDisplayEnabled) return
  const panel = document.getElementById("fribbyStats")
  if (!panel) return
  const now = Date.now()
  pruneRecentFribbyClicks(now)
  const perClick = getFribbiesPerClick()
  const autoThrows = getAutoThrowsPerSecond()
  const perAutoThrow = getAutoThrowReward()
  const autoPerSecond = BigInt(autoThrows) * BigInt(perAutoThrow)
  const recentClickGain = recentFribbyClicks.reduce((sum, click) => sum + BigInt(click.gain), 0n)
  const clickPerSecond = recentClickGain / BigInt(FRIBBY_STATS_WINDOW_MS / 1000)
  const values = {
    statsPerClick: formatFribbies(BigInt(perClick)),
    statsAutoThrows: autoThrows.toLocaleString(),
    statsPerAutoThrow: formatFribbies(BigInt(perAutoThrow)),
    statsPerSecond: formatFribbies(autoPerSecond + clickPerSecond)
  }
  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) element.textContent = value
  })
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
  if (index === 81) return "auto-10"
  if (index === 82) return "auto-11"
  if (index === 83) return "mini-10"
  if (index === 84) return "mini-11"
  // Branch-end Eternal Echo upgrades occupy legacy bit positions 109-117.
  if (index >= 109 && index <= 116) return ["strong-12", "click-12", "mega-12", "cheap-12", "auto-12", "mini-12", "arcade-12", "collection-12"][index - 109]
  if (index === 117) return "engineering-12"
  if (index >= 118 && index < 130) return `engineering-${index - 118}`
  if (index >= 85 && index < 97) return `arcade-${index - 85}`
  if (index >= 97 && index < 109) return `collection-${index - 97}`
  return null
}
function skillIdToIndex(id) {
  const match = /^(path|strong|click|mega|cheap|auto|mini|arcade|collection|engineering)-(\d+)$/.exec(id)
  if (!match) return -1
  const number = Number(match[2])
  if (match[2] === "12" && ["strong", "click", "mega", "cheap", "auto", "mini", "arcade", "collection", "engineering"].includes(match[1])) return 109 + ["strong", "click", "mega", "cheap", "auto", "mini", "arcade", "collection", "engineering"].indexOf(match[1])
  if (match[1] === "auto" && number >= 10 && number < 12) return 81 + number - 10
  if (match[1] === "mini" && number >= 10 && number < 12) return 83 + number - 10
  if (match[1] === "arcade") return number >= 0 && number < 12 ? 85 + number : -1
  if (match[1] === "collection") return number >= 0 && number < 12 ? 97 + number : -1
  if (match[1] === "engineering") return number >= 0 && number < 12 ? 118 + number : -1
  const offset = { path: 0, strong: 13, click: 25, mega: 37, cheap: 49, auto: 61, mini: 71 }[match[1]]
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
  const engineeringPanel = document.getElementById("engineeringPanel")
  if (engineeringPanel) engineeringPanel.hidden = !hasSkill("engineering-0")
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
  percent += hasSkill("mega-1") ? 20 : 0
  percent += hasSkill("mega-4") ? ascensionCount * 2 : 0
  percent += hasSkill("mega-5") ? 15 : 0
  percent += hasSkill("mega-8") && baseReward >= 10n ? 25 : 0
  percent += hasSkill("mega-9") ? Math.max(0, countSkills("mega") - 1) * 5 : 0
  percent += hasSkill("mega-11") ? 30 : 0
  percent += hasSkill("mega-12") ? 25 : 0
  percent += hasSkill("mini-6") ? getTotalUnlockedMinigames() * 2 : 0
  percent += hasSkill("mini-11") ? 10 : 0
  let reward = baseReward * BigInt(percent) / 100n
  if (hasSkill("mega-0")) reward += 5n
  if (hasSkill("mega-2")) reward += (baseReward + 4n) / 5n
  if (hasSkill("mega-3") && fribbies % ASCENSION_THRESHOLD >= 750000n) reward += 25n
  if (hasSkill("mega-6")) reward += BigInt(Math.floor(ascensionCount / 2))
  if (hasSkill("mega-7") && getTotalUnlockedMinigames() >= 14) reward += 10n
  if (hasSkill("mega-10") && fribbies >= 5000000n) reward += 15n
  return reward > 0n ? reward : 1n
}
function ascend(skipConfirmation = false) {
  if (fribbies < ASCENSION_THRESHOLD) return
  const reward = calculateAscensionReward()
  if (!skipConfirmation && !confirm(`Ascend and gain ${formatFribbies(reward)} Mega Fribbies? This resets your Fribbies, regular upgrades, and minigame unlocks.`)) return
  megaFribbies += reward
  ascensionCount++
  fribbies = hasSkill("path-1") ? 1000n : 0n
  u0Amount=0; u0Cost=10n; u1Amount=0; u1Cost=50n; u2Amount=0; u2Cost=200n
  u3Amount=0; u3Cost=500n; u4Amount=0; u4Cost=1000n; u5Amount=0; u5Cost=2500n
  u6Amount=0; u6Cost=5000n; u7Amount=0; u7Cost=10000n; u8Amount=0; u8Cost=25000n; u9Amount=0; u9Cost=50000n; u10Amount=0; u10Cost=100000n; u11Amount=0; u11Cost=250000n; u12Amount=0; u12Cost=500000n; u13Amount=0; u13Cost=1000000n; u14Amount=0; u14Cost=2500000n
  clearInterval(autoThrowTimer)
  unlockedMinigames = 0; minigameUnlockCost = 2500n
  document.querySelectorAll("[data-minigame]").forEach(button => button.hidden = true)
  document.getElementById("minigamesArea").hidden = true
  refreshBonusMinigames()
  refreshUpgradeLabels()
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
function triggerFribbyClickEffect(gain) {
  const button = document.getElementById("fribbyButton")
  if (!button) return
  button.classList.remove("fribby-click-burst")
  void button.offsetWidth
  button.classList.add("fribby-click-burst")
  makeSkillParticles(button, 12, [190, 205, 270, 45, 52])
  const gainPop = makeElement("span", "fribby-gain-pop", `+${formatFribbies(gain ?? getFribbiesPerClick())}`)
  gainPop.setAttribute("aria-hidden", "true")
  button.appendChild(gainPop)
  window.setTimeout(() => gainPop.remove(), motionIsReduced() ? 250 : 900)
  window.setTimeout(() => button.classList.remove("fribby-click-burst"), motionIsReduced() ? 250 : 600)
}
function triggerRegularUpgradeEffect(index, purchaseCost = 0n) {
  const refund = getSynergyMatrixPurchaseRefund(index, BigInt(purchaseCost || 0))
  if (refund > 0n) fribbies += refund
  const button = document.getElementById(`upgrade${index}`)
  if (!button) return
  button.classList.remove("regular-upgrade-purchase")
  void button.offsetWidth
  button.classList.add("regular-upgrade-purchase")
  makeSkillParticles(button, 14, [145, 165, 190, 270, 45, 52])
  const toast = makeElement("span", "regular-upgrade-toast", refund > 0n ? `+${formatFribbies(refund)} SYNTHESIS REFUND` : "UPGRADE ACQUIRED")
  toast.setAttribute("aria-hidden", "true")
  button.appendChild(toast)
  window.setTimeout(() => toast.remove(), motionIsReduced() ? 250 : 1100)
  window.setTimeout(() => button.classList.remove("regular-upgrade-purchase"), motionIsReduced() ? 250 : 900)
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
  const cx = 1100, cy = 1100
  const branchStep = (Math.PI * 2) / 10
  const branchAngles = { path: -Math.PI / 2, strong: -Math.PI / 2 + branchStep, click: -Math.PI / 2 + branchStep * 2, mega: -Math.PI / 2 + branchStep * 3, mini: -Math.PI / 2 + branchStep * 4, arcade: -Math.PI / 2 + branchStep * 5, collection: -Math.PI / 2 + branchStep * 6, auto: -Math.PI / 2 + branchStep * 7, cheap: -Math.PI / 2 + branchStep * 8, engineering: -Math.PI / 2 + branchStep * 9 }
  const point = (branch, index) => {
    if (branch === "path" && index === 12) {
      return { x: Math.round(cx + Math.cos(branchAngles.path) * 990), y: Math.round(cy + Math.sin(branchAngles.path) * 990) }
    }
    const count = branch === "path" ? 12 : skillNames[branch].length
    const maxIndex = Math.max(1, count - 1)
    const radius = index === 12 && branch !== "path" ? 990 : 155 + Math.min(index, 11) * (735 / 11)
    const angle = branchAngles[branch]
    return { x: Math.round(cx + Math.cos(angle) * radius), y: Math.round(cy + Math.sin(angle) * radius) }
  }

  graph.push({ id: "core", x: cx, y: cy, parents: [], core: true })
  for (let i = 0; i < 12; i++) {
    const p = point("path", i)
    graph.push({ id: `path-${i}`, branch: "path", index: i, ...p, parents: [i === 0 ? "core" : `path-${i - 1}`] })
  }
  for (const branch of ["strong", "click", "mega", "cheap", "auto", "mini", "arcade", "collection", "engineering"]) {
    const count = skillNames[branch].length
    for (let i = 0; i < count; i++) {
      const p = point(branch, i)
      const pathGate = `path-${Math.min(i, 11)}`
      graph.push({
        id: `${branch}-${i}`, branch, index: i, ...p,
        parents: i === 0 ? ["core", pathGate] : [`${branch}-${i - 1}`, pathGate]
      })
    }
  }
  const echo = point("path", 12)
  graph.push({ id: "path-12", branch: "path", index: 12, ...echo, parents: ["path-11", "strong-11", "click-11", "mega-11", "cheap-11", "auto-11", "mini-11", "arcade-11", "collection-11", "engineering-11"] })
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
    const diameter = Number(id.split("-")[1]) === 12 ? 72 : 58
    wrapper.style.left = `${graphNode.x - diameter / 2}px`
    wrapper.style.top = `${graphNode.y - diameter / 2}px`
  }
  const button = document.createElement("button")
  button.type = "button"
  button.className = Number(id.split("-")[1]) === 12 ? "skill-node eternal-echo-node" : "skill-node"
  button.dataset.skillId = id
  button.setAttribute("aria-label", skillNodeLabel(id))
  button.onclick = () => buySkill(id)
  const icon = document.createElement("span")
  icon.className = "skill-node-icon"
  icon.setAttribute("aria-hidden", "true")
  icon.textContent = index === 12 ? "◇" : (skillNodeIconSets[branch]?.[index] || skillNodeIcons[branch] || "◇")
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
  wrapper.append(button, caption, tooltip)
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
  edges.setAttribute("viewBox", "0 0 2200 2200")
  edges.setAttribute("preserveAspectRatio", "xMinYMin meet")
  const graphById = new Map(graph.map(node => [node.id, node]))
  const edgeAnchor = (node, other) => {
    const dx = other.x - node.x
    const dy = other.y - node.y
    const length = Math.hypot(dx, dy) || 1
    const ux = dx / length
    const uy = dy / length
    const radius = node.core
      ? 1 / Math.sqrt((ux * ux) / (98 * 98) + (uy * uy) / (36 * 36))
      : node.id === "path-12" ? 36 : 30
    return { x: node.x + ux * radius, y: node.y + uy * radius }
  }
  graph.forEach(node => {
    node.parents.forEach(parentId => {
      const parent = graphById.get(parentId)
      if (!parent) return
      // Keep radial spokes and within-branch links. Neighboring branches are
      // connected separately below, rung-to-rung, to form a spiderweb.
      if (parentId !== "core" && parent.branch !== node.branch) return
      const start = edgeAnchor(parent, node)
      const end = edgeAnchor(node, parent)
      const dx = end.x - start.x
      const dy = end.y - start.y
      const length = Math.hypot(dx, dy) || 1
      const curve = Math.min(24, length * .06) * (Number(node.index || 0) % 2 ? 1 : -1)
      const px = -dy / length
      const py = dx / length
      const c1x = start.x + dx * .35 + px * curve
      const c1y = start.y + dy * .35 + py * curve
      const c2x = start.x + dx * .65 + px * curve
      const c2y = start.y + dy * .65 + py * curve
      const path = document.createElementNS(svgNS, "path")
      path.setAttribute("d", `M ${start.x} ${start.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${end.x} ${end.y}`)
      path.setAttribute("class", `skill-edge edge-${node.branch || "core"}`)
      path.dataset.to = node.id
      path.dataset.from = parentId
      edges.appendChild(path)
    })
  })
  // Join each rung to the matching rung in the two neighboring outer branches.
  // Drawing each pair once avoids doubled lines where the web closes into a ring.
  const webBranches = ["path", "strong", "click", "mega", "mini", "arcade", "collection", "auto", "cheap", "engineering"]
  const addWebEdge = (from, to) => {
    if (!from || !to) return
    const start = edgeAnchor(from, to)
    const end = edgeAnchor(to, from)
    const path = document.createElementNS(svgNS, "path")
    path.setAttribute("d", `M ${start.x} ${start.y} L ${end.x} ${end.y}`)
    path.setAttribute("class", `skill-edge edge-web edge-${from.branch}`)
    path.dataset.from = from.id
    path.dataset.to = to.id
    edges.appendChild(path)
  }
  for (let i = 0; i < 12; i++) {
    for (let branchIndex = 0; branchIndex < webBranches.length; branchIndex++) {
      const branch = webBranches[branchIndex]
      const nextBranch = webBranches[(branchIndex + 1) % webBranches.length]
      addWebEdge(graphById.get(`${branch}-${i}`), graphById.get(`${nextBranch}-${i}`))
    }
  }
  map.appendChild(edges)
  const origin = document.createElement("div")
  origin.className = "skill-tree-origin skill-web-origin"
  origin.innerHTML = '<span class="origin-star" aria-hidden="true">⊙</span><strong>FRIBBY CORE</strong><span>Start the web</span>'
  origin.style.left = `${graph[0].x}px`
  origin.style.top = `${graph[0].y}px`
  map.appendChild(origin)
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
  requestAnimationFrame(() => {
    const treeRect = tree.getBoundingClientRect()
    const mapRect = map.getBoundingClientRect()
    if (!tree.clientWidth || !tree.clientHeight || !map.offsetWidth || !map.offsetHeight) return
    const mapLeft = mapRect.left - treeRect.left + tree.scrollLeft
    const mapTop = mapRect.top - treeRect.top + tree.scrollTop
    tree.scrollLeft = mapLeft + map.offsetWidth / 2 - tree.clientWidth / 2
    tree.scrollTop = mapTop + map.offsetHeight / 2 - tree.clientHeight / 2
  })
  updateSkillTreeButtons()
}
function isSkillAvailable(id) {
  if (isRepeatableSkillId(id)) return hasAllCoreSkills() && repeatableEchoes < MAX_REPEATABLE_ECHOES
  if (purchasedSkills.has(id)) return false
  getSkillGraph()
  const node = cachedSkillGraphById.get(id)
  if (!node || node.core) return false
  return node.parents.every(parentId => parentId === "core"
    || (parentId === "path-12" ? repeatableEchoes > 0 : purchasedSkills.has(parentId)))
}
function skillCost(id) {
  if (isRepeatableSkillId(id)) return repeatableEchoCost()
  const [branch, rawIndex] = id.split("-")
  const index = Number(rawIndex)
  const base = { path: 2n, strong: 3n, click: 3n, mega: 2n, cheap: 4n, auto: 4n, mini: 4n, arcade: 4n, collection: 4n, engineering: 4n }[branch] || 3n
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
    const statusText = repeatable
      ? repeatableEchoes >= MAX_REPEATABLE_ECHOES
        ? "Maximum level reached."
        : `Level ${repeatableEchoes}; next level costs ${formatFribbies(cost)} Mega Fribbies.`
      : purchased ? "Purchased."
        : !available ? `Locked. Unlock all connected parent nodes first. Cost: ${formatFribbies(cost)} Mega Fribbies.`
          : megaFribbies < cost ? `Available; earn ${formatFribbies(cost - megaFribbies)} more Mega Fribbies to unlock.`
            : `Ready to unlock for ${formatFribbies(cost)} Mega Fribbies.`
    button.title = `${name}: ${effect}. ${statusText}`
    button.setAttribute("aria-label", `${name}. ${effect}. ${statusText}`)
    const tooltip = button.closest(".skill-node-wrap")?.querySelector(".skill-node-tooltip")
    if (tooltip) tooltip.textContent = `${name} — ${effect}. ${statusText}`
    // Keep locked nodes focusable so players can inspect their upgrade details on touch and keyboard.
    button.disabled = false
    button.setAttribute("aria-disabled", String(repeatable
      ? (!available || megaFribbies < cost)
      : (purchased || !available || megaFribbies < cost)))
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
  if (id.startsWith("collection-")) refreshBonusMinigames()
  updateAscensionUI()
  triggerSkillUnlockEffect(id)
  if (id.endsWith("-12")) triggerEternalEchoEffect(1)
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

const bonusMinigames = ["quickCount", "oddOneOut", "sumSprint", "colorMixer", "discGolf", "wordShuffle"]
function isMinigameUnlocked(game) {
  if (minigameUnlockOrder.slice(0, unlockedMinigames).includes(game)) return true
  const bonusIndex = bonusMinigames.indexOf(game)
  return bonusIndex >= 0 && purchasedSkills.has(`collection-${bonusIndex * 2}`)
}
function getTotalUnlockedMinigames() {
  return unlockedMinigames + bonusMinigames.filter(game => purchasedSkills.has(`collection-${bonusMinigames.indexOf(game) * 2}`)).length
}
function refreshBonusMinigames() {
  bonusMinigames.forEach(game => {
    const unlocked = isMinigameUnlocked(game)
    const selector = document.querySelector(`[data-minigame="${game}"]`)
    if (selector) selector.hidden = !unlocked
    const section = document.getElementById(`minigame-${game}`)
    if (section && !unlocked) section.hidden = true
  })
  document.getElementById("minigamesArea").hidden = unlockedMinigames === 0 && !bonusMinigames.some(isMinigameUnlocked)
  updateTabVisibility()
}

const minigameUnlockOrder = [
  "numberGuess",
  "patternRecall",
  "luckySpin",
  "matching",
  "pathFinder",
  "minesweeper",
  "rapidToss",
  "oddOrbit"
]
let unlockedMinigames = 0
let minigameUnlockCost = 2500n

function buyMinigameUnlock() {
  const status = document.getElementById("minigameUnlockStatus")
  if (unlockedMinigames >= minigameUnlockOrder.length) return
  const unlockPrice = getMinigameUnlockPrice()
  if (fribbies < unlockPrice) {
    playSoundEffect("upgradeFailSound")
    status.textContent = `You need ${formatFribbies(unlockPrice)} Fribbies to unlock the next minigame.`
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
    minesweeper: "Fribbysweeper",
    rapidToss: "Rapid Toss",
    oddOrbit: "Odd Orbit", quickCount: "Quick Count", oddOneOut: "Odd One Out", sumSprint: "Sum Sprint", colorMixer: "Color Mixer", discGolf: "Disc Golf", wordShuffle: "Word Shuffle"
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
  button.textContent = `Unlock Minigame (${unlockedMinigames}/${minigameUnlockOrder.length}) - ${formatFribbies(getMinigameUnlockPrice())} Fribbies`
}

function showMinigame(game) {
  if (!isMinigameUnlocked(game)) return
  playSoundEffect("minigameStartSound")
  document.getElementById("minigame-minesweeper").hidden = game !== "minesweeper"
  document.getElementById("minigame-numberGuess").hidden = game !== "numberGuess"
  document.getElementById("minigame-matching").hidden = game !== "matching"
  document.getElementById("minigame-pathFinder").hidden = game !== "pathFinder"
  document.getElementById("minigame-patternRecall").hidden = game !== "patternRecall"
  document.getElementById("minigame-luckySpin").hidden = game !== "luckySpin"
  document.getElementById("minigame-rapidToss").hidden = game !== "rapidToss"
  document.getElementById("minigame-oddOrbit").hidden = game !== "oddOrbit"
  bonusMinigames.forEach(id => {
    const section = document.getElementById(`minigame-${id}`)
    if (section) section.hidden = game !== id
  })
}


let rapidTossTimer = null
let rapidTossActive = false
let rapidTossCount = 0
let oddOrbitStreak = 0
function startRapidToss() {
  clearInterval(rapidTossTimer)
  rapidTossActive = true
  rapidTossCount = 0
  let seconds = 10
  const start = document.getElementById("rapidTossStart")
  const tap = document.getElementById("rapidTossTap")
  const status = document.getElementById("rapidTossStatus")
  if (start) start.disabled = true
  if (tap) tap.disabled = false
  if (status) status.textContent = `${seconds} seconds left — toss as fast as you can!`
  rapidTossTimer = setInterval(() => {
    seconds--
    if (status) status.textContent = `${seconds} seconds left · ${rapidTossCount} tosses`
    if (seconds <= 0) {
      clearInterval(rapidTossTimer)
      rapidTossActive = false
      if (tap) tap.disabled = true
      if (start) start.disabled = false
      const payout = getMinigamePayout(rapidTossCount * 10)
      fribbies += payout
      updateFribby()
      playSoundEffect("minigameCompleteSound")
      if (status) status.textContent = `Round over! ${rapidTossCount} tosses earned ${formatFribbies(payout)} Fribbies.`
    }
  }, 1000)
}
function tapRapidToss() {
  if (!rapidTossActive) return
  rapidTossCount++
  if (rapidTossCount % 5 === 0) playSoundEffect("throwSound")
  const status = document.getElementById("rapidTossStatus")
  if (status) status.textContent = `Tosses: ${rapidTossCount} · Keep going!`
}
function playOddOrbit(prediction) {
  if (!isMinigameUnlocked("oddOrbit")) return
  const number = Math.floor(Math.random() * 20) + 1
  const result = number % 2 ? "odd" : "even"
  const status = document.getElementById("oddOrbitStatus")
  if (prediction === result) {
    oddOrbitStreak++
    let reward = getMinigamePayout(150)
    fribbies += reward
    updateFribby()
    playSoundEffect("minigameCompleteSound")
    if (status) status.textContent = `The number was ${number} (${result.toUpperCase()}) — correct! +${formatFribbies(reward)} Fribbies. Streak: ${oddOrbitStreak}.`
  } else {
    oddOrbitStreak = 0
    playSoundEffect("upgradeFailSound")
    if (status) status.textContent = `The number was ${number} (${result.toUpperCase()}). Streak reset — try again!`
  }
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

// Six compact minigames unlocked along the Minigame Collection branch.
let quickCountTarget = 0
let oddOneOutTarget = -1
let sumSprintAnswer = null
let colorMixerRound = null
let discGolfTarget = null
let wordShuffleAnswer = ""

function rewardMinigame(base, status, message) {
  const prize = getMinigamePayout(base)
  fribbies += prize
  updateFribby()
  if (prize > 0n) playSoundEffect("minigameCompleteSound")
  if (status) status.textContent = message.replace("{reward}", formatFribbies(prize))
  gameSaveDirty = true
}
function startQuickCount() {
  quickCountTarget = 4 + Math.floor(Math.random() * 13)
  document.getElementById("quickCountPrompt").textContent = Array(quickCountTarget).fill("🥏").join(" ")
  document.getElementById("quickCountAnswer").value = ""
  document.getElementById("quickCountStatus").textContent = "How many discs?"
}
function playQuickCount() {
  const status = document.getElementById("quickCountStatus")
  if (!quickCountTarget) return startQuickCount()
  if (Number(document.getElementById("quickCountAnswer").value) === quickCountTarget) {
    rewardMinigame(100, status, "Correct! You earned {reward} Fribbies.")
    quickCountTarget = 0
  } else status.textContent = "Not quite. Try counting again!"
}
function startOddOneOut() {
  const board = document.getElementById("oddOneOutBoard")
  board.innerHTML = ""
  const symbols = ["●", "●", "●", "●", "●", "◆"]
  oddOneOutTarget = Math.floor(Math.random() * symbols.length)
  symbols.forEach((symbol, index) => {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = index === oddOneOutTarget ? "◆" : "●"
    button.setAttribute("aria-label", `Symbol ${index + 1}`)
    button.onclick = () => {
      const status = document.getElementById("oddOneOutStatus")
      if (index === oddOneOutTarget) rewardMinigame(125, status, "Nice spotting! +{reward} Fribbies.")
      else status.textContent = "That one matches the others. Try again."
      if (index === oddOneOutTarget) board.querySelectorAll("button").forEach(b => b.disabled = true)
    }
    board.appendChild(button)
  })
  document.getElementById("oddOneOutStatus").textContent = "Find the diamond."
}
function startSumSprint() {
  const operations = [
    () => { const a = 2 + Math.floor(Math.random() * 18), b = 2 + Math.floor(Math.random() * 18); return { prompt: `${a} + ${b} = ?`, answer: a + b } },
    () => { const a = 10 + Math.floor(Math.random() * 30), b = 1 + Math.floor(Math.random() * Math.min(20, a)); return { prompt: `${a} − ${b} = ?`, answer: a - b } },
    () => { const a = 2 + Math.floor(Math.random() * 9), b = 2 + Math.floor(Math.random() * 9); return { prompt: `${a} × ${b} = ?`, answer: a * b } }
  ]
  const problem = operations[Math.floor(Math.random() * operations.length)]()
  sumSprintAnswer = problem.answer
  document.getElementById("sumSprintPrompt").textContent = problem.prompt
  document.getElementById("sumSprintAnswer").value = ""
  document.getElementById("sumSprintStatus").textContent = "Solve the equation to earn Fribbies."
}
function playSumSprint() {
  const status = document.getElementById("sumSprintStatus")
  if (sumSprintAnswer === null) return startSumSprint()
  const answer = document.getElementById("sumSprintAnswer").value.trim()
  if (answer !== "" && Number(answer) === sumSprintAnswer) {
    rewardMinigame(180, status, "Correct calculation! +{reward} Fribbies.")
    sumSprintAnswer = null
  } else status.textContent = "Not quite—check your arithmetic and try again."
}
function startColorMixer() {
  const recipes = [
    { question: "Red + blue makes…", answer: "Purple", options: ["Purple", "Green", "Orange"] },
    { question: "Red + yellow makes…", answer: "Orange", options: ["Green", "Orange", "Purple"] },
    { question: "Blue + yellow makes…", answer: "Green", options: ["Orange", "Purple", "Green"] },
    { question: "Black + white makes…", answer: "Gray", options: ["Brown", "Gray", "Pink"] }
  ]
  colorMixerRound = recipes[Math.floor(Math.random() * recipes.length)]
  document.getElementById("colorMixerPrompt").textContent = colorMixerRound.question
  const board = document.getElementById("colorMixerChoices")
  board.innerHTML = ""
  colorMixerRound.options.forEach(option => {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = option
    button.onclick = () => {
      if (!colorMixerRound) return
      if (option === colorMixerRound.answer) {
        rewardMinigame(160, document.getElementById("colorMixerStatus"), "Perfect blend! +{reward} Fribbies.")
        board.querySelectorAll("button").forEach(choice => choice.disabled = true)
        colorMixerRound = null
      } else document.getElementById("colorMixerStatus").textContent = "That blend doesn't look right. Try another color."
    }
    board.appendChild(button)
  })
  document.getElementById("colorMixerStatus").textContent = "Choose the resulting color."
}
function startDiscGolf() {
  discGolfTarget = 30 + Math.floor(Math.random() * 71)
  document.getElementById("discGolfTarget").textContent = `The basket is ${discGolfTarget} metres away. Choose your throw distance.`
  document.getElementById("discGolfStatus").textContent = "Pick the closest distance."
  const board = document.getElementById("discGolfChoices")
  board.innerHTML = ""
  ;[20, 40, 60, 80, 100].forEach(distance => {
    const button = document.createElement("button")
    button.type = "button"
    button.textContent = `${distance} m`
    button.onclick = () => {
      if (discGolfTarget === null) return
      const difference = Math.abs(distance - discGolfTarget)
      const status = document.getElementById("discGolfStatus")
      if (difference <= 10) rewardMinigame(220, status, `Great throw! +{reward} Fribbies. (${difference} m off target.)`)
      else if (difference <= 20) rewardMinigame(90, status, `Close throw! +{reward} Fribbies. (${difference} m off target.)`)
      else status.textContent = `You were ${difference} m off target. Start a new hole to try again.`
      discGolfTarget = null
      board.querySelectorAll("button").forEach(choice => choice.disabled = true)
    }
    board.appendChild(button)
  })
}

function startWordShuffle() {
  const words = ["FRIBBY", "TOSS", "QUICK", "PRIZE", "ARCADE", "BUTTON"]
  wordShuffleAnswer = words[Math.floor(Math.random() * words.length)]
  let shuffled = wordShuffleAnswer
  while (shuffled === wordShuffleAnswer) shuffled = wordShuffleAnswer.split("").sort(() => Math.random() - .5).join("")
  document.getElementById("wordShufflePrompt").textContent = `Unscramble: ${shuffled}`
  document.getElementById("wordShuffleAnswer").value = ""
  document.getElementById("wordShuffleStatus").textContent = "Type the original word."
}
function checkWordShuffle() {
  const answer = document.getElementById("wordShuffleAnswer").value.trim().toUpperCase()
  const status = document.getElementById("wordShuffleStatus")
  if (answer === wordShuffleAnswer && wordShuffleAnswer) {
    rewardMinigame(200, status, "Solved! +{reward} Fribbies.")
    wordShuffleAnswer = ""
  } else status.textContent = "Not quite. Give it another go!"
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
  return toBigIntAmount(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
    version: 6,
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
      { amount: u8Amount, cost: u8Cost.toString() },
      { amount: u9Amount, cost: u9Cost.toString() },
      { amount: u10Amount, cost: u10Cost.toString() },
      { amount: u11Amount, cost: u11Cost.toString() },
      { amount: u12Amount, cost: u12Cost.toString() },
      { amount: u13Amount, cost: u13Cost.toString() },
      { amount: u14Amount, cost: u14Cost.toString() }
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
  let localStorageAvailable = false

  // localStorage is the primary save. Avoid writing and verifying a cookie on
  // every save; repeated serialization/storage writes during idle play can
  // create needless memory and CPU pressure.
  try {
    localStorage.setItem(GAME_SAVE_COOKIE, serialized)
    saved = true
    localStorageAvailable = true
  } catch (error) {
    // Use the cookie only if localStorage is unavailable.
  }

  if (!localStorageAvailable) {
    try {
      setGameCookie(GAME_SAVE_COOKIE, serialized, GAME_SAVE_DAYS)
      saved = getGameCookie(GAME_SAVE_COOKIE) !== null
    } catch (error) {
      // Both browser storage options may be blocked.
    }
  }

  if (saved) gameSaveDirty = false
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
  if (Array.isArray(data.upgrades)) {
    if (!data.upgrades[9]) data.upgrades[9] = { amount: 0, cost: "50000" }
    if (!data.upgrades[10]) data.upgrades[10] = { amount: 0, cost: "100000" }
    if (!data.upgrades[11]) data.upgrades[11] = { amount: 0, cost: "250000" }
    if (!data.upgrades[12]) data.upgrades[12] = { amount: 0, cost: "500000" }
  }
  data.version = Math.max(6, Number(data.version) || 1)
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
    if (![1, 2, 3, 4, 5, 6].includes(data.version) || !Array.isArray(data.upgrades) || data.upgrades.length < 9 || data.upgrades.length > 15) {
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
    u9Amount = Math.max(0, Number(data.upgrades[9]?.amount) || 0); u9Cost = toBigIntAmount(data.upgrades[9]?.cost, 50000n) || 50000n
    u10Amount = Math.max(0, Number(data.upgrades[10]?.amount) || 0); u10Cost = toBigIntAmount(data.upgrades[10]?.cost, 100000n) || 100000n
    u11Amount = Math.max(0, Number(data.upgrades[11]?.amount) || 0); u11Cost = toBigIntAmount(data.upgrades[11]?.cost, 250000n) || 250000n
    u12Amount = Math.max(0, Number(data.upgrades[12]?.amount) || 0); u12Cost = toBigIntAmount(data.upgrades[12]?.cost, 500000n) || 500000n
    u13Amount = Math.max(0, Number(data.upgrades[13]?.amount) || 0); u13Cost = toBigIntAmount(data.upgrades[13]?.cost, 1000000n) || 1000000n
    u14Amount = Math.max(0, Number(data.upgrades[14]?.amount) || 0); u14Cost = toBigIntAmount(data.upgrades[14]?.cost, 2500000n) || 2500000n

    unlockedMinigames = Math.max(0, Math.min(minigameUnlockOrder.length, Number(data.unlockedMinigames) || 0))
    minigameUnlockCost = toBigIntAmount(data.minigameUnlockCost, 2500n) < 2500n ? 2500n : toBigIntAmount(data.minigameUnlockCost, 2500n)
    megaFribbies = toBigIntAmount(data.megaFribbies)
    ascensionCount = Math.max(0, Number(data.ascensionCount) || 0)
    repeatableEchoes = Math.min(MAX_REPEATABLE_ECHOES, Math.max(0, Math.floor(Number(data.repeatableEchoes) || 0)))
    purchasedSkills = new Set(Array.isArray(data.purchasedSkills) ? data.purchasedSkills.filter(id => skillIdToIndex(id) >= 0 && id !== "path-12") : [])

    updateFribby()
    renderSkillTree()
    refreshUpgradeLabels()

    document.getElementById("minigamesArea").hidden = unlockedMinigames === 0 && !bonusMinigames.some(isMinigameUnlocked)
    minigameUnlockOrder.forEach((game, index) => {
      const selector = document.querySelector(`[data-minigame="${game}"]`)
      if (selector) selector.hidden = index >= unlockedMinigames
    })
    refreshBonusMinigames()
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
  // Autosave only when something changed, at a modest interval. Currency can
  // update many times per second, but that should never trigger a storage write.
  window.setInterval(() => {
    if (gameSaveDirty) saveGame(false)
  }, 30000)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && gameSaveDirty) saveGame(false)
  })
  window.addEventListener("beforeunload", () => {
    if (gameSaveDirty) saveGame(false)
  })
})

const SUPABASE_URL = "https://soofisuqqwszdhqxiqzw.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_r68LSwAd5IFOdsI9sm31Gg_cx2-DmSe"
const LEADERBOARD_TABLE = "fribby_leaderboard"
const TWITCH_STATS_TABLE = "fribby_stream_stats"
const TWITCH_STREAM_KEY_STORAGE = "fribbyTwitchStreamKey"
let twitchStreamKey = ""
let twitchStatsPublishTimer = null
let twitchStatsPublishBusy = false
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
    startTwitchStatsPublisher()
  } catch (error) {
    if (status) status.textContent = "Couldn't connect to the leaderboard. Check Supabase settings and anonymous sign-ins."
    console.error("Leaderboard initialization failed:", error)
  }
}

function initializeTwitchStatsSettings() {
  try { twitchStreamKey = String(localStorage.getItem(TWITCH_STREAM_KEY_STORAGE) || "").trim() } catch (error) {}
  const input = document.getElementById("twitchStreamKey")
  const status = document.getElementById("twitchStatsStatus")
  if (input) input.value = twitchStreamKey
  if (status && twitchStreamKey) status.textContent = "Stream key saved. Waiting for the game's Supabase connection…"
}

function saveTwitchStreamKey() {
  const input = document.getElementById("twitchStreamKey")
  const status = document.getElementById("twitchStatsStatus")
  const key = String(input?.value || "").trim()
  if (key.length < 8 || key.length > 80 || !/^[a-zA-Z0-9_-]+$/.test(key)) {
    if (status) status.textContent = "Enter the Stream Link Key from Twitch config (8–80 letters, numbers, underscores, or hyphens)."
    return
  }
  twitchStreamKey = key
  try { localStorage.setItem(TWITCH_STREAM_KEY_STORAGE, key) } catch (error) {
    if (status) status.textContent = "Browser storage is blocked, so the key could not be saved."
    return
  }
  if (status) status.textContent = leaderboardClient && leaderboardUserId
    ? "Key saved. Sending your current stats…"
    : "Key saved. Waiting for Supabase sign-in to finish…"
  startTwitchStatsPublisher()
  publishTwitchStats()
}

function clearTwitchStreamKey() {
  twitchStreamKey = ""
  if (twitchStatsPublishTimer !== null) window.clearInterval(twitchStatsPublishTimer)
  twitchStatsPublishTimer = null
  try { localStorage.removeItem(TWITCH_STREAM_KEY_STORAGE) } catch (error) {}
  const input = document.getElementById("twitchStreamKey")
  const status = document.getElementById("twitchStatsStatus")
  if (input) input.value = ""
  if (status) status.textContent = "Disconnected. This browser will stop publishing stats to Twitch."
}

function startTwitchStatsPublisher() {
  if (twitchStatsPublishTimer !== null) window.clearInterval(twitchStatsPublishTimer)
  if (!twitchStreamKey || !leaderboardClient || !leaderboardUserId) return
  publishTwitchStats()
  twitchStatsPublishTimer = window.setInterval(publishTwitchStats, 5000)
}

async function publishTwitchStats() {
  if (twitchStatsPublishBusy || !twitchStreamKey || !leaderboardClient || !leaderboardUserId) return
  twitchStatsPublishBusy = true
  const status = document.getElementById("twitchStatsStatus")
  try {
    const payload = {
      stream_key: twitchStreamKey,
      user_id: leaderboardUserId,
      fribbies: fribbies.toString(),
      mega_fribbies: megaFribbies.toString(),
      ascension_count: Math.max(0, Math.floor(Number(ascensionCount) || 0)),
      updated_at: new Date().toISOString()
    }
    const { error } = await leaderboardClient
      .from(TWITCH_STATS_TABLE)
      .upsert(payload, { onConflict: "stream_key" })
    if (error) throw error
    if (status) status.textContent = "Connected! Your Fribbies, Mega Fribbies, and ascensions update about every 5 seconds while this game is open."
  } catch (error) {
    if (status) status.textContent = "Could not publish stats. Run the SQL in README-TWITCH-EXTENSION-SETUP.txt in your Supabase SQL Editor, and check that anonymous sign-ins are enabled."
    console.error("Twitch stats publishing failed:", error)
    // Avoid hammering Supabase if the table or its policies have not been created yet.
    if (twitchStatsPublishTimer !== null) {
      window.clearInterval(twitchStatsPublishTimer)
      twitchStatsPublishTimer = window.setTimeout(() => {
        twitchStatsPublishTimer = null
        startTwitchStatsPublisher()
      }, 30000)
    }
  } finally {
    twitchStatsPublishBusy = false
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
      const editor = document.getElementById("adminGameEditor")
      if (editor) editor.hidden = true
      return
    }
    const { data, error } = await leaderboardAdminClient.rpc("is_fribby_leaderboard_admin")
    if (error) throw error
    leaderboardIsAdmin = data === true
    if (adminStatus) adminStatus.textContent = leaderboardIsAdmin
      ? "Administrator verified. Crown and remove controls are enabled globally."
      : "Signed-in account is not an administrator."
    if (signOut) signOut.hidden = !leaderboardIsAdmin
    const editor = document.getElementById("adminGameEditor")
    if (editor) editor.hidden = !leaderboardIsAdmin
    if (leaderboardIsAdmin) populateAdminGameEditor()
  } catch (error) {
    leaderboardIsAdmin = false
    if (adminStatus) adminStatus.textContent = "Admin verification is not configured. Apply leaderboard-admin.sql in Supabase."
    if (signOut) signOut.hidden = true
    const editor = document.getElementById("adminGameEditor")
    if (editor) editor.hidden = true
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

function populateAdminGameEditor() {
  const setValue = (id, value) => {
    const input = document.getElementById(id)
    if (input) input.value = String(value)
  }
  setValue("adminFribbies", fribbies)
  setValue("adminMegaFribbies", megaFribbies)
  ;[u0Amount, u1Amount, u2Amount, u3Amount, u4Amount, u5Amount, u6Amount, u7Amount, u8Amount, u9Amount, u10Amount, u11Amount, u12Amount, u13Amount, u14Amount]
    .forEach((amount, index) => setValue(`adminUpgrade${index}`, amount))
}

function applyAdminGameEdits() {
  if (!leaderboardIsAdmin) return
  const fribbyInput = document.getElementById("adminFribbies")
  const megaInput = document.getElementById("adminMegaFribbies")
  const status = document.getElementById("adminGameEditStatus")
  const amountInputs = Array.from({ length: 15 }, (_, index) => document.getElementById(`adminUpgrade${index}`))
  const parseAmount = input => {
    const value = input?.value.trim() ?? ""
    return /^\d+$/.test(value) ? BigInt(value) : null
  }
  const nextFribbies = parseAmount(fribbyInput)
  const nextMegaFribbies = parseAmount(megaInput)
  const nextUpgrades = amountInputs.map(input => {
    const value = input?.value.trim() ?? ""
    return /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : null
  })
  if (nextFribbies === null || nextMegaFribbies === null || nextUpgrades.some(value => value === null)) {
    if (status) status.textContent = "Enter non-negative whole numbers for every field. Upgrade counts must be within JavaScript's safe integer range."
    return
  }
  fribbies = nextFribbies
  megaFribbies = nextMegaFribbies
  ;[u0Amount, u1Amount, u2Amount, u3Amount, u4Amount, u5Amount, u6Amount, u7Amount, u8Amount, u9Amount, u10Amount, u11Amount, u12Amount, u13Amount, u14Amount] = nextUpgrades
  updateFribby()
  refreshUpgradeLabels()
  updateAscensionUI()
  renderSkillTree()
  saveGame()
  if (status) status.textContent = "Your game values were updated and saved in this browser. Upgrade prices were left unchanged."
}

async function signOutLeaderboardAdmin() {
  if (!leaderboardAdminClient) return
  try {
    await leaderboardAdminClient.auth.signOut()
    leaderboardIsAdmin = false
    const editor = document.getElementById("adminGameEditor")
    if (editor) editor.hidden = true
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

document.addEventListener("DOMContentLoaded", initializeTwitchStatsSettings)
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
    if (parsedCopies.some(copy => ![21, 24, 25, 33, 37].includes(copy.length)) || parsedCopies.some(copy => copy.length !== parsedCopies[0].length)) throw new Error("Invalid save field count")

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
  if (!([21, 24, 25, 33, 37].includes(legacyFields.length)) || legacyFields.some(field => !/^\d+$/.test(field))) {
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
  const upgradeCount = decoded.length >= 37 ? 15 : decoded.length >= 33 ? 13 : decoded.length >= 24 ? 9 : 7
  const upgrades = []
  for (let i = 0; i < upgradeCount; i++) {
    upgrades.push({ amount: Number(decoded[1 + i * 2]), cost: String(decoded[2 + i * 2]) })
  }
  const tail = 1 + upgradeCount * 2
  const unlockedMinigames = Number(decoded[tail])
  const minigameUnlockCost = String(decoded[tail + 1])
  const hasAscensionData = decoded.length >= tail + 5
  const megaFribbies = hasAscensionData ? String(decoded[tail + 2]) : "0"
  const ascensionCount = hasAscensionData ? Number(decoded[tail + 3]) : 0
  const maskIndex = tail + 4
  const mask = decoded.length > maskIndex ? toBigIntAmount(decoded[maskIndex]) : 0n
  const skillIds = decoded.length > maskIndex
    ? Array.from({ length: 130 }, (_, index) => (mask & (1n << BigInt(index))) ? skillIndexToId(index) : null).filter(Boolean)
    : []
  const legacyEchoLevel = skillIds.includes("path-12") ? 1 : 0
  return {
    version: decoded.length > maskIndex + 1 ? 6 : decoded.length > maskIndex ? 4 : 2,
    fribbies: String(decoded[0]), upgrades,
    unlockedMinigames, minigameUnlockCost,
    megaFribbies, ascensionCount,
    purchasedSkills: skillIds.filter(id => id !== "path-12"),
    repeatableEchoes: decoded.length > maskIndex + 1 ? Number(decoded[maskIndex + 1]) : legacyEchoLevel
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
      ![1, 2, 3, 4, 5, 6].includes(Number(data.version)) ||
      !/^\d+$/.test(String(data.fribbies)) ||
      !Array.isArray(data.upgrades) ||
      data.upgrades.length < 9 || data.upgrades.length > 15 ||
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
    u9Amount = Math.max(0, Number(data.upgrades[9]?.amount) || 0); u9Cost = toBigIntAmount(data.upgrades[9]?.cost, 50000n) || 50000n
    u10Amount = Math.max(0, Number(data.upgrades[10]?.amount) || 0); u10Cost = toBigIntAmount(data.upgrades[10]?.cost, 100000n) || 100000n
    u11Amount = Math.max(0, Number(data.upgrades[11]?.amount) || 0); u11Cost = toBigIntAmount(data.upgrades[11]?.cost, 250000n) || 250000n
    u12Amount = Math.max(0, Number(data.upgrades[12]?.amount) || 0); u12Cost = toBigIntAmount(data.upgrades[12]?.cost, 500000n) || 500000n
    u13Amount = Math.max(0, Number(data.upgrades[13]?.amount) || 0); u13Cost = toBigIntAmount(data.upgrades[13]?.cost, 1000000n) || 1000000n
    u14Amount = Math.max(0, Number(data.upgrades[14]?.amount) || 0); u14Cost = toBigIntAmount(data.upgrades[14]?.cost, 2500000n) || 2500000n
  unlockedMinigames = Math.max(0, Math.min(minigameUnlockOrder.length, Number(data.unlockedMinigames) || 0))
  minigameUnlockCost = toBigIntAmount(data.minigameUnlockCost, 2500n) < 2500n ? 2500n : toBigIntAmount(data.minigameUnlockCost, 2500n)
  megaFribbies = toBigIntAmount(data.megaFribbies)
  ascensionCount = Math.max(0, Number(data.ascensionCount) || 0)
  repeatableEchoes = Math.min(MAX_REPEATABLE_ECHOES, Math.max(0, Math.floor(Number(data.repeatableEchoes) || 0)))
  purchasedSkills = new Set(Array.isArray(data.purchasedSkills) ? data.purchasedSkills.filter(id => skillIdToIndex(id) >= 0 && id !== "path-12") : [])

  updateFribby()
  renderSkillTree()
  refreshUpgradeLabels()
  document.getElementById("minigamesArea").hidden = unlockedMinigames === 0 && !bonusMinigames.some(isMinigameUnlocked)
  minigameUnlockOrder.forEach((game, index) => {
    const selector = document.querySelector(`[data-minigame="${game}"]`)
    if (selector) selector.hidden = index >= unlockedMinigames
  })
  refreshBonusMinigames()
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
  if (gassyModeEnabled) {
    playFartSound(elementId)
    return
  }
  const sound = document.getElementById(elementId)
  if (!sound) return
  sound.currentTime = 0
  sound.play().catch(() => {
    // Playback may be blocked until the player interacts with the page.
  })
}

// Gassy mode gives each original SFX its own fart-like sound, synthesized locally.
let fartAudioContext = null
const fartSoundProfiles = {
  throwSound:            { start: 145, end: 48, duration: 0.24, type: "sawtooth", filter: 620, bursts: 3, wobble: 15 },
  upgradeSound:          { start: 90, end: 34, duration: 0.42, type: "triangle", filter: 420, bursts: 2, wobble: 24 },
  upgradeFailSound:      { start: 62, end: 82, duration: 0.34, type: "square", filter: 300, bursts: 4, wobble: 7 },
  saveSound:             { start: 118, end: 42, duration: 0.52, type: "sawtooth", filter: 760, bursts: 5, wobble: 31 },
  patternThrowSound:     { start: 185, end: 76, duration: 0.18, type: "triangle", filter: 880, bursts: 2, wobble: 38 },
  minigameStartSound:    { start: 72, end: 130, duration: 0.48, type: "sawtooth", filter: 500, bursts: 3, wobble: 18 },
  minigameCompleteSound: { start: 105, end: 29, duration: 0.68, type: "triangle", filter: 680, bursts: 6, wobble: 34 },
  minesweeperCorrectSound:{ start: 155, end: 58, duration: 0.16, type: "sine", filter: 980, bursts: 1, wobble: 12 },
  minesweeperFailSound:  { start: 48, end: 24, duration: 0.72, type: "sawtooth", filter: 240, bursts: 7, wobble: 5 },
  musicToggleSound:      { start: 132, end: 44, duration: 0.3, type: "square", filter: 560, bursts: 2, wobble: 22 }
}
function playFartSound(elementId) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    if (!fartAudioContext) fartAudioContext = new AudioContextClass()
    const context = fartAudioContext
    if (context.state === "suspended") context.resume().catch(() => {})

    const profile = fartSoundProfiles[elementId] || fartSoundProfiles.throwSound
    const now = context.currentTime
    const duration = profile.duration * (0.92 + Math.random() * 0.16)
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const filter = context.createBiquadFilter()
    const wobble = profile.wobble * (0.8 + Math.random() * 0.4)

    oscillator.type = profile.type
    oscillator.frequency.setValueAtTime(profile.start * (0.94 + Math.random() * 0.12), now)
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(18, profile.end), now + duration)
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(profile.filter, now)
    filter.frequency.exponentialRampToValueAtTime(Math.max(100, profile.filter * 0.32), now + duration)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.2, now + 0.018)

    // Each SFX has its own rhythm and pitch wobble, so the fart sounds are recognizably different.
    for (let i = 1; i <= profile.bursts; i++) {
      const time = now + duration * i / (profile.bursts + 1)
      const level = i % 2 ? 0.16 : 0.23
      gain.gain.setValueAtTime(level, time)
      oscillator.frequency.setValueAtTime(Math.max(18, profile.start - wobble * i), time)
    }
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.035)
    oscillator.connect(filter)
    filter.connect(gain)
    gain.connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.045)
  } catch (error) {
    // Keep the game running if Web Audio is unavailable or blocked.
  }
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
  u6Amount=0; u6Cost=5000n; u7Amount=0; u7Cost=10000n; u8Amount=0; u8Cost=25000n; u9Amount=0; u9Cost=50000n; u10Amount=0; u10Cost=100000n; u11Amount=0; u11Cost=250000n; u12Amount=0; u12Cost=500000n; u13Amount=0; u13Cost=1000000n; u14Amount=0; u14Cost=2500000n
  clearInterval(autoThrowTimer)
  unlockedMinigames = 0; minigameUnlockCost = 2500n
  megaFribbies = 0n; ascensionCount = 0; repeatableEchoes = 0; purchasedSkills = new Set()
  document.querySelectorAll("[data-minigame]").forEach(button => button.hidden = true)
  document.getElementById("minigamesArea").hidden = true
  refreshBonusMinigames()
  refreshUpgradeLabels()
  updateMinigameUnlockButton(); updateFribby(); renderSkillTree(); updateAscensionUI()
  const status = document.getElementById("saveStatus"); if(status) status.textContent = "Save wiped. A fresh game has started."
}


function updateTabVisibility() {
  const ascensionButton = document.querySelector('#topTabs [data-tab="ascension"]')
  const minigamesButton = document.querySelector('#topTabs [data-tab="minigames"]')
  const canAscend = fribbies >= ASCENSION_THRESHOLD || ascensionCount > 0 || megaFribbies > 0n
  if (ascensionButton) ascensionButton.hidden = !canAscend
  if (minigamesButton) minigamesButton.hidden = !(unlockedMinigames > 0 || bonusMinigames.some(isMinigameUnlocked))

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
  const adminGameEditor = document.getElementById("adminGameEditor")
  const ascensionPanel = document.getElementById("ascensionPanel")
  const skillTree = document.getElementById("skillTreePanel")
  const mini = document.getElementById("minigamesArea")
  const board = document.getElementById("leaderboardArea")
  const dock = document.getElementById("settingsDock")
  if (ascensionPanel) ascensionPanel.remove()
  if (clicker) game.appendChild(clicker)
  if (adminGameEditor) game.appendChild(adminGameEditor)
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


/* Hidden Uwu Mode: type "uwu" anywhere to unlock and enable it. */
let uwuModeUnlocked = false
let uwuModeEnabled = false
const uwuOriginalText = new WeakMap()
const uwuTextNodes = new Set()
let uwuApplyingText = false
function uwuify(text) { return text.replace(/[rl]/gi, letter => letter === "R" ? "W" : letter === "L" ? "W" : letter === "r" ? "w" : "w") }
function isUwuExcluded(node) {
  const parent = node.parentElement
  return !parent || !!parent.closest("script, style, noscript, textarea, input, select, option, code, pre")
}
function applyUwuToNode(node) {
  if (node.nodeType !== Node.TEXT_NODE || isUwuExcluded(node)) return
  if (!uwuOriginalText.has(node)) uwuOriginalText.set(node, node.nodeValue)
  uwuTextNodes.add(node)
  if (uwuModeEnabled) {
    const original = uwuOriginalText.get(node)
    const transformed = uwuify(original)
    if (node.nodeValue !== transformed) {
      uwuApplyingText = true
      node.nodeValue = transformed
      uwuApplyingText = false
    }
  }
}
function scanUwuText(root = document.body) {
  if (!root) return
  if (root.nodeType === Node.TEXT_NODE) { applyUwuToNode(root); return }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) applyUwuToNode(node)
}
function releaseUwuText(root) {
  if (!root) return
  if (root.nodeType === Node.TEXT_NODE) {
    uwuTextNodes.delete(root)
    return
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) uwuTextNodes.delete(node)
}
function setUwuMode(enabled) {
  uwuModeEnabled = Boolean(enabled && uwuModeUnlocked)
  uwuApplyingText = true
  for (const node of uwuTextNodes) {
    if (!node.isConnected) { uwuTextNodes.delete(node); continue }
    const original = uwuOriginalText.get(node)
    if (original == null) continue
    node.nodeValue = uwuModeEnabled ? uwuify(original) : original
  }
  uwuApplyingText = false
  const button = document.getElementById("uwuToggle")
  if (button) {
    button.hidden = !uwuModeUnlocked
    button.textContent = `Uwu Mode: ${uwuModeEnabled ? "On" : "Off"}`
    button.setAttribute("aria-pressed", String(uwuModeEnabled))
  }
  try { localStorage.setItem("fribbyUwuUnlocked", String(uwuModeUnlocked)); localStorage.setItem("fribbyUwuEnabled", String(uwuModeEnabled)) } catch (error) {}
}
function toggleUwuMode() { setUwuMode(!uwuModeEnabled) }
function unlockUwuMode() {
  if (uwuModeUnlocked) return
  uwuModeUnlocked = true
  setUwuMode(true)
  const button = document.getElementById("uwuToggle")
  if (button) button.title = 'Secret found! Toggle the r/l-to-w text effect here.'
}

/* Hidden Gassy Mode: type "gassy" anywhere to swap every SFX for fart noises. */
let gassyModeUnlocked = false
let gassyModeEnabled = false
function setGassyMode(enabled) {
  gassyModeEnabled = Boolean(enabled && gassyModeUnlocked)
  const button = document.getElementById("gassyToggle")
  if (button) {
    button.hidden = !gassyModeUnlocked
    button.textContent = `Fart SFX: ${gassyModeEnabled ? "On" : "Off"}`
    button.setAttribute("aria-pressed", String(gassyModeEnabled))
  }
  try {
    localStorage.setItem("fribbyGassyUnlocked", String(gassyModeUnlocked))
    localStorage.setItem("fribbyGassyEnabled", String(gassyModeEnabled))
  } catch (error) {}
}
function toggleGassyMode() { setGassyMode(!gassyModeEnabled) }
function unlockGassyMode() {
  if (gassyModeUnlocked) return
  gassyModeUnlocked = true
  setGassyMode(true)
  const button = document.getElementById("gassyToggle")
  if (button) button.title = "Secret found! Toggle fart sounds for all sound effects here."
}
document.addEventListener("keydown", event => {
  if (event.key.length !== 1) return
  window.__fribbyUwuBuffer = ((window.__fribbyUwuBuffer || "") + event.key.toLowerCase()).slice(-3)
  if (window.__fribbyUwuBuffer === "uwu") unlockUwuMode()
})
document.addEventListener("keydown", event => {
  if (event.key.length !== 1) return
  window.__fribbyGassyBuffer = ((window.__fribbyGassyBuffer || "") + event.key.toLowerCase()).slice(-5)
  if (window.__fribbyGassyBuffer === "gassy") unlockGassyMode()
})
document.addEventListener("DOMContentLoaded", () => {
  try {
    uwuModeUnlocked = localStorage.getItem("fribbyUwuUnlocked") === "true"
    uwuModeEnabled = uwuModeUnlocked && localStorage.getItem("fribbyUwuEnabled") === "true"
    gassyModeUnlocked = localStorage.getItem("fribbyGassyUnlocked") === "true"
    gassyModeEnabled = gassyModeUnlocked && localStorage.getItem("fribbyGassyEnabled") === "true"
  } catch (error) {}
  setGassyMode(gassyModeEnabled)
  scanUwuText()
  setUwuMode(uwuModeEnabled)
  const observer = new MutationObserver(records => {
    if (uwuApplyingText) return
    for (const record of records) {
      if (record.type === "childList") {
        // Rebuilt panels (especially the ascension web) detach many text nodes.
        // Drop those references immediately so repeated UI updates cannot grow
        // the tracking Set for the lifetime of the tab.
        record.removedNodes.forEach(node => {
          if (!node.isConnected) releaseUwuText(node)
        })
        record.addedNodes.forEach(node => scanUwuText(node))
      } else if (record.type === "characterData" && uwuModeEnabled) {
        const node = record.target
        const current = node.nodeValue
        const original = uwuOriginalText.get(node)
        if (original != null && current !== uwuify(original)) uwuOriginalText.set(node, current)
        applyUwuToNode(node)
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
})


// Restore the optional earnings panel preference and keep its estimates current.
document.addEventListener("DOMContentLoaded", () => {
  try { statsDisplayEnabled = localStorage.getItem("fribbyStatsDisplay") === "true" } catch (error) {}
  const button = document.getElementById("statsToggle")
  const panel = document.getElementById("fribbyStats")
  if (button) {
    button.textContent = statsDisplayEnabled ? "📊 Hide Fribby Stats: On" : "📊 Show Fribby Stats: Off"
    button.setAttribute("aria-pressed", String(statsDisplayEnabled))
  }
  if (panel) panel.hidden = !statsDisplayEnabled
  updateFribbyStats()
  window.setInterval(updateFribbyStats, 500)
})

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addMinigameClickPowerNotes, { once: true }); else addMinigameClickPowerNotes();


// Engineering Workbench: safe visual blocks with bounded control flow and state-aware conditions.
const ENGINEERING_STORAGE_KEY = "fribbyEngineeringBlocks"
const ENGINEERING_ASCENSION_CONSENT_KEY = "fribbyEngineeringAscensionConsent"
const ENGINEERING_ACTIONS = new Set(["throw", "buy", "ascend", "wait", "repeat", "repeatUntil", "loopBack", "ifCondition", "whenCondition", "stop"])
const ENGINEERING_UPGRADE_NAMES = [
  "Extra Hand", "Auto Thrower", "Intern", "Fribby Cannon", "Supervisor",
  "Power Glove", "Turbo Thrower", "Turbo Cannon", "Mega Cannon",
  "Power Cannon", "Factory Intern", "Turbo Cannon", "Mega Factory",
  "Super Cannon", "Turbo Factory"
]
const ENGINEERING_CONDITION_METRICS = [
  ["fribbies", "Fribbies"],
  ["megaFribbies", "Mega Fribbies (MF)"],
  ["ascensions", "Total ascensions"],
  ["ascensionUpgradeCount", "Ascension upgrades owned (total)"],
  ["ascensionUpgrade", "A specific ascension upgrade"],
  ["regularUpgrade", "A regular upgrade's amount"],
  ["repeatableEchoes", "Eternal Echo level"]
]
const ENGINEERING_CONDITION_OPERATORS = [
  ["gte", "is at least (≥)"], ["gt", "is greater than (>)"], ["eq", "equals (=)"],
  ["lte", "is at most (≤)"], ["lt", "is less than (<)"], ["neq", "does not equal (≠)"],
  ["increasedBy", "increased by at least"], ["decreasedBy", "decreased by at least"]
]
const ENGINEERING_CONDITION_REFERENCES = [
  ["target", "a fixed target"],
  ["scriptStart", "the value at script start (+ offset)"],
  ["outerLoopStart", "the value before the outer loop (+ offset)"],
  ["conditionStart", "the value when this block first checked (+ offset)"],
  ["repeatStart", "the value when the enclosing repeat began (+ offset)"],
  ["previousCheck", "the previous checked value (+ offset)"]
]
let engineeringBlockCounter = 0
let engineeringRunning = false
let engineeringLoading = false
let engineeringLoopTimer = null
let engineeringLoopEnabled = false
let engineeringStopRequested = false
let engineeringLoopStartSnapshot = null
let engineeringLoopPreviousValues = new Map()
let engineeringLoopConditionBaselines = new Map()

function engineeringBoundNumber(value, fallback, min, max) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.floor(number))) : fallback
}

function engineeringAmountString(value) {
  const digits = String(value ?? "0").replace(/\D/g, "").slice(0, 100)
  return digits || "0"
}

function engineeringHasAtLeast(amount) {
  try { return fribbies >= BigInt(engineeringAmountString(amount)) } catch (error) { return false }
}

function engineeringSafeBigInt(value) {
  try { return BigInt(value ?? 0) } catch (error) { return 0n }
}

function engineeringSkillIds() {
  const ids = []
  for (const [branch, names] of Object.entries(skillNames)) {
    const max = branch === "path" ? Math.min(12, names.length) : names.length
    for (let index = 0; index < max; index++) ids.push(`${branch}-${index}`)
  }
  ids.push("path-12")
  return [...new Set(ids)]
}

function engineeringCaptureSnapshot() {
  const regularAmounts = [u0Amount, u1Amount, u2Amount, u3Amount, u4Amount, u5Amount, u6Amount, u7Amount, u8Amount, u9Amount, u10Amount, u11Amount, u12Amount, u13Amount, u14Amount]
    .map(value => engineeringSafeBigInt(Math.max(0, Math.floor(Number(value) || 0))))
  const ascensionUpgrades = Object.create(null)
  for (const id of engineeringSkillIds()) {
    ascensionUpgrades[id] = id === "path-12"
      ? engineeringSafeBigInt(repeatableEchoes)
      : (purchasedSkills.has(id) ? 1n : 0n)
  }
  const regularSkillCount = Math.max(0, purchasedSkills.size - (purchasedSkills.has("path-12") ? 1 : 0))
  return {
    fribbies: engineeringSafeBigInt(fribbies),
    megaFribbies: engineeringSafeBigInt(megaFribbies),
    ascensions: engineeringSafeBigInt(Math.max(0, Math.floor(Number(ascensionCount) || 0))),
    ascensionUpgradeCount: BigInt(regularSkillCount) + engineeringSafeBigInt(repeatableEchoes),
    regularAmounts,
    ascensionUpgrades,
    repeatableEchoes: engineeringSafeBigInt(repeatableEchoes)
  }
}

function engineeringMetricValue(snapshot, block) {
  if (!snapshot) return null
  switch (block.metric || "fribbies") {
    case "fribbies": return snapshot.fribbies
    case "megaFribbies": return snapshot.megaFribbies
    case "ascensions": return snapshot.ascensions
    case "ascensionUpgradeCount": return snapshot.ascensionUpgradeCount
    case "ascensionUpgrade": return snapshot.ascensionUpgrades[String(block.skillId || "path-0")] ?? 0n
    case "regularUpgrade": {
      const index = engineeringBoundNumber(block.metricUpgrade, 0, 0, 14)
      return snapshot.regularAmounts[index] ?? 0n
    }
    case "repeatableEchoes": return snapshot.repeatableEchoes
    default: return snapshot.fribbies
  }
}

function engineeringConditionKey(index, block) {
  return `${index}:${block.metric || "fribbies"}:${block.metricUpgrade || 0}:${block.skillId || "path-0"}`
}

function engineeringCompare(current, target, operator) {
  if (current == null || target == null) return false
  switch (operator || "gte") {
    case "gt": return current > target
    case "eq": return current === target
    case "lte": return current <= target
    case "lt": return current < target
    case "neq": return current !== target
    default: return current >= target
  }
}

function engineeringConditionSatisfied(block, context, blockIndex, repeatSnapshot = null) {
  // Older saved scripts did not have a metric selector; preserve their Fribby target behavior.
  if (!block.metric) return engineeringHasAtLeast(block.amount)

  const currentSnapshot = engineeringCaptureSnapshot()
  const currentValue = engineeringMetricValue(currentSnapshot, block)
  if (currentValue == null) return false
  const amount = engineeringSafeBigInt(engineeringAmountString(block.amount))
  const reference = block.reference || "target"
  const operator = block.operator || "gte"
  const key = engineeringConditionKey(blockIndex, block)
  let baselineValue = null

  if (reference === "target") {
    if (operator === "increasedBy") return currentValue >= amount
    if (operator === "decreasedBy") return currentValue <= amount
    return engineeringCompare(currentValue, amount, operator)
  }

  let baselineSnapshot = null
  if (reference === "scriptStart") baselineSnapshot = context.scriptStartSnapshot
  else if (reference === "outerLoopStart") baselineSnapshot = engineeringLoopStartSnapshot || context.scriptStartSnapshot
  else if (reference === "conditionStart") {
    if (!context.conditionBaselines.has(key)) context.conditionBaselines.set(key, currentSnapshot)
    baselineSnapshot = context.conditionBaselines.get(key)
  } else if (reference === "repeatStart") {
    baselineSnapshot = repeatSnapshot || context.repeatStack.slice().reverse().find(frame => frame.snapshot)?.snapshot || context.scriptStartSnapshot
  } else if (reference === "previousCheck") {
    baselineValue = context.previousValues.has(key) ? context.previousValues.get(key) : null
    // Store the new sample after reading the prior one, whether or not the condition passes.
    context.previousValues.set(key, currentValue)
    if (baselineValue == null) return false
  }

  if (baselineSnapshot) baselineValue = engineeringMetricValue(baselineSnapshot, block)
  if (baselineValue == null) return false

  if (operator === "increasedBy") return currentValue >= baselineValue + amount
  if (operator === "decreasedBy") return currentValue <= baselineValue - amount
  return engineeringCompare(currentValue, baselineValue + amount, operator)
}

function createEngineeringSelect(className, ariaLabel, options, value) {
  const select = document.createElement("select")
  select.className = className
  select.setAttribute("aria-label", ariaLabel)
  options.forEach(([optionValue, label]) => {
    const option = document.createElement("option")
    option.value = optionValue
    option.textContent = label
    select.appendChild(option)
  })
  if ([...select.options].some(option => option.value === String(value))) select.value = String(value)
  return select
}

function createEngineeringParameter(labelText, className, value, options = {}) {
  const label = document.createElement("label")
  label.className = "engineering-param-label"
  label.textContent = labelText
  const input = document.createElement("input")
  input.className = `engineering-param ${className}`
  input.setAttribute("aria-label", labelText)
  if (options.text) {
    input.type = "text"
    input.inputMode = "numeric"
    input.maxLength = 100
  } else {
    input.type = "number"
    input.min = String(options.min ?? 1)
    input.max = String(options.max ?? 100)
    input.step = String(options.step ?? 1)
  }
  input.value = String(value)
  label.appendChild(input)
  const onChange = () => {
    if (options.text) input.value = engineeringAmountString(input.value)
    else if (options.integer === false) {
      const number = Number(input.value)
      const normalized = Number.isFinite(number) ? Math.min(options.max ?? 100, Math.max(options.min ?? 0, number)) : (options.defaultValue ?? 1)
      input.value = String(Math.round(normalized * 10) / 10)
    } else input.value = String(engineeringBoundNumber(input.value, options.defaultValue ?? 1, options.min ?? 1, options.max ?? 100))
    saveEngineeringBlocks()
  }
  input.addEventListener("change", onChange)
  input.addEventListener("input", () => {
    if (options.text) input.value = input.value.replace(/\D/g, "").slice(0, 100)
    saveEngineeringBlocks()
  })
  return { label, input }
}

function addEngineeringBlock(action = "throw", upgrade = "0", config = {}) {
  const workspace = document.getElementById("engineeringBlocks")
  if (!workspace || workspace.children.length >= 50) {
    setEngineeringStatus("The workspace holds up to 50 blocks. Remove a block before adding another.")
    return
  }
  const row = document.createElement("div")
  row.className = "engineering-block"
  row.dataset.blockId = String(++engineeringBlockCounter)

  const number = document.createElement("span")
  number.className = "engineering-block-number"
  number.textContent = `BLOCK ${workspace.children.length + 1}`

  const actionLabel = document.createElement("label")
  actionLabel.textContent = "Do"
  const actionSelect = createEngineeringSelect("engineering-action", "Block action", [
    ["throw", "Click the throw button"],
    ["buy", "Buy a regular upgrade"],
    ["ascend", "Ascend"],
    ["wait", "Wait x seconds"],
    ["repeat", "Repeat next x blocks"],
    ["repeatUntil", "Repeat until condition is true"],
    ["loopBack", "Loop back x blocks (until stopped)"],
    ["ifCondition", "If condition is true"],
    ["whenCondition", "When condition is true (wait)"],
    ["stop", "Stop script"]
  ], action)

  const upgradeLabel = document.createElement("label")
  upgradeLabel.textContent = "Upgrade to buy"
  const upgradeSelect = createEngineeringSelect("engineering-upgrade", "Regular upgrade", ENGINEERING_UPGRADE_NAMES.map((name, index) => [String(index), `#${index} — ${name}`]), upgrade)

  const metricLabel = document.createElement("label")
  metricLabel.textContent = "Compare"
  const metricSelect = createEngineeringSelect("engineering-metric", "Metric to compare", ENGINEERING_CONDITION_METRICS, config.metric || "fribbies")
  const operatorLabel = document.createElement("label")
  operatorLabel.textContent = "Condition"
  const operatorSelect = createEngineeringSelect("engineering-operator", "Condition operator", ENGINEERING_CONDITION_OPERATORS, config.operator || "gte")
  const referenceLabel = document.createElement("label")
  referenceLabel.textContent = "Against"
  const referenceSelect = createEngineeringSelect("engineering-reference", "Comparison reference", ENGINEERING_CONDITION_REFERENCES, config.reference || "target")

  const skillOptions = []
  for (const [branch, names] of Object.entries(skillNames)) {
    const max = branch === "path" ? Math.min(12, names.length) : names.length
    for (let index = 0; index < max; index++) {
      const id = `${branch}-${index}`
      skillOptions.push([id, `${names[index]} (${branch}, ${index})`])
    }
  }
  skillOptions.push(["path-12", "Eternal Echo: Transcendence (path, 12)"])
  const skillLabel = document.createElement("label")
  skillLabel.textContent = "Ascension upgrade"
  const skillSelect = createEngineeringSelect("engineering-skill", "Ascension upgrade to compare", skillOptions, config.skillId || "path-0")

  const params = {
    seconds: createEngineeringParameter("Seconds", "engineering-seconds", config.seconds ?? 1, { min: 0.1, max: 60, step: 0.1, defaultValue: 1, integer: false }),
    blockCount: createEngineeringParameter("Next blocks", "engineering-block-count", config.blockCount ?? 1, { min: 1, max: 50, defaultValue: 1 }),
    repeatCount: createEngineeringParameter("Times", "engineering-repeat-count", config.repeatCount ?? 2, { min: 1, max: 100, defaultValue: 2 }),
    back: createEngineeringParameter("Blocks back", "engineering-back", config.back ?? 1, { min: 1, max: 50, defaultValue: 1 }),
    amount: createEngineeringParameter("Target / change", "engineering-amount", config.amount ?? "1000000", { text: true })
  }

  const remove = document.createElement("button")
  remove.type = "button"
  remove.className = "engineering-remove"
  remove.textContent = "×"
  remove.setAttribute("aria-label", "Remove block")
  remove.addEventListener("click", () => {
    row.remove()
    renumberEngineeringBlocks()
    saveEngineeringBlocks()
  })

  const conditionActions = new Set(["ifCondition", "whenCondition", "repeatUntil"])
  const refreshControls = () => {
    const selected = actionSelect.value
    const isCondition = conditionActions.has(selected)
    const metric = metricSelect.value
    upgradeLabel.hidden = !(selected === "buy" || (isCondition && metric === "regularUpgrade"))
    upgradeLabel.textContent = selected === "buy" ? "Upgrade to buy" : "Regular upgrade"
    upgradeSelect.hidden = !(selected === "buy" || (isCondition && metric === "regularUpgrade"))
    metricLabel.hidden = operatorLabel.hidden = referenceLabel.hidden = !isCondition
    metricSelect.hidden = operatorSelect.hidden = referenceSelect.hidden = !isCondition
    skillLabel.hidden = skillSelect.hidden = !(isCondition && metric === "ascensionUpgrade")
    Object.values(params).forEach(param => param.label.hidden = true)
    if (selected === "wait") params.seconds.label.hidden = false
    if (selected === "repeat") {
      params.blockCount.label.hidden = false
      params.repeatCount.label.hidden = false
    }
    if (selected === "repeatUntil" || selected === "ifCondition") {
      params.blockCount.label.hidden = false
      params.amount.label.hidden = false
    }
    if (selected === "whenCondition") params.amount.label.hidden = false
    if (isCondition && params.amount.label.hidden) params.amount.label.hidden = false
    if (selected === "loopBack") params.back.label.hidden = false
    const isRelative = referenceSelect.value !== "target"
    operatorSelect.options[6].disabled = !isRelative
    operatorSelect.options[7].disabled = !isRelative
    if (!isRelative && ["increasedBy", "decreasedBy"].includes(operatorSelect.value)) operatorSelect.value = "gte"
  }

  actionSelect.addEventListener("change", () => { refreshControls(); saveEngineeringBlocks() })
  upgradeSelect.addEventListener("change", saveEngineeringBlocks)
  ;[metricSelect, operatorSelect, referenceSelect, skillSelect].forEach(select => {
    select.addEventListener("change", () => { refreshControls(); saveEngineeringBlocks() })
  })

  row.append(number, actionLabel, actionSelect, upgradeLabel, upgradeSelect,
    metricLabel, metricSelect, operatorLabel, operatorSelect,
    referenceLabel, referenceSelect, skillLabel, skillSelect)
  Object.values(params).forEach(param => row.appendChild(param.label))
  row.appendChild(remove)
  workspace.appendChild(row)
  refreshControls()
  renumberEngineeringBlocks()
  saveEngineeringBlocks()
}

function renumberEngineeringBlocks() {
  document.querySelectorAll("#engineeringBlocks .engineering-block").forEach((row, index) => {
    const number = row.querySelector(".engineering-block-number")
    if (number) number.textContent = `BLOCK ${index + 1}`
  })
}

function getEngineeringProgram() {
  return [...document.querySelectorAll("#engineeringBlocks .engineering-block")].map(row => {
    const action = row.querySelector(".engineering-action")?.value || "throw"
    const value = selector => row.querySelector(selector)?.value
    const upgrade = row.querySelector(".engineering-upgrade")?.value || "0"
    const block = { action }
    if (action === "buy") block.upgrade = /^\d+$/.test(String(upgrade)) && Number(upgrade) <= 14 ? String(upgrade) : "0"
    if (action === "wait") block.seconds = Math.min(60, Math.max(0.1, Number(value(".engineering-seconds")) || 1))
    if (["repeat", "repeatUntil", "ifCondition"].includes(action)) {
      block.blockCount = engineeringBoundNumber(value(".engineering-block-count"), 1, 1, 50)
    }
    if (action === "repeat") block.repeatCount = engineeringBoundNumber(value(".engineering-repeat-count"), 2, 1, 100)
    if (action === "loopBack") block.back = engineeringBoundNumber(value(".engineering-back"), 1, 1, 50)
    if (["repeatUntil", "ifCondition", "whenCondition"].includes(action)) {
      block.metric = ENGINEERING_CONDITION_METRICS.some(([metric]) => metric === value(".engineering-metric")) ? value(".engineering-metric") : "fribbies"
      block.operator = ENGINEERING_CONDITION_OPERATORS.some(([operator]) => operator === value(".engineering-operator")) ? value(".engineering-operator") : "gte"
      block.reference = ENGINEERING_CONDITION_REFERENCES.some(([reference]) => reference === value(".engineering-reference")) ? value(".engineering-reference") : "target"
      block.amount = engineeringAmountString(value(".engineering-amount"))
      block.metricUpgrade = engineeringBoundNumber(value(".engineering-upgrade"), 0, 0, 14)
      const selectedSkill = value(".engineering-skill")
      block.skillId = engineeringSkillIds().includes(selectedSkill) ? selectedSkill : "path-0"
    }
    return block
  })
}

function hasEngineeringAscensionBlock(program = getEngineeringProgram()) {
  return program.some(block => block.action === "ascend")
}

function isEngineeringAscensionProgramAuthorized(program = getEngineeringProgram()) {
  if (!hasEngineeringAscensionBlock(program)) return true
  const serialized = JSON.stringify(program)
  try {
    return localStorage.getItem(ENGINEERING_STORAGE_KEY) === serialized &&
      localStorage.getItem(ENGINEERING_ASCENSION_CONSENT_KEY) === serialized
  } catch (error) {
    return false
  }
}

function saveEngineeringBlocks() {
  if (engineeringLoading) return
  const program = getEngineeringProgram()
  // Ascension scripts require an explicit save and a clear confirmation.
  if (hasEngineeringAscensionBlock(program)) {
    setEngineeringStatus("This script contains an Ascend block. Click Save script and confirm to save it for looping.")
    return
  }
  try {
    localStorage.setItem(ENGINEERING_STORAGE_KEY, JSON.stringify(program))
    localStorage.removeItem(ENGINEERING_ASCENSION_CONSENT_KEY)
  } catch (error) {
    // The current program remains usable for this session if storage is blocked.
  }
}

function saveEngineeringScript() {
  const program = getEngineeringProgram()
  if (!program.length) {
    setEngineeringStatus("Add at least one block before saving the script.")
    return
  }
  const hasAscension = hasEngineeringAscensionBlock(program)
  if (hasAscension && !confirm("This script contains an Ascend block. Saving it confirms that you understand it can reset your regular progress. Logic blocks may repeat ascension automatically. Save this script?")) {
    setEngineeringStatus("Script not saved. Your current blocks are still in the workspace.")
    return
  }
  const serialized = JSON.stringify(program)
  try {
    localStorage.setItem(ENGINEERING_STORAGE_KEY, serialized)
    if (hasAscension) localStorage.setItem(ENGINEERING_ASCENSION_CONSENT_KEY, serialized)
    else localStorage.removeItem(ENGINEERING_ASCENSION_CONSENT_KEY)
    setEngineeringStatus(hasAscension ? "Script saved. Ascension is authorized for this exact program when it runs in a loop." : "Script saved.")
  } catch (error) {
    setEngineeringStatus("The script is ready, but browser storage is unavailable so it could not be saved.")
  }
}

function loadEngineeringBlocks() {
  let program = null
  try { program = JSON.parse(localStorage.getItem(ENGINEERING_STORAGE_KEY) || "null") } catch (error) {}
  const workspace = document.getElementById("engineeringBlocks")
  if (!workspace || workspace.children.length) return
  engineeringLoading = true
  if (Array.isArray(program) && program.length) {
    program.slice(0, 50).forEach(savedBlock => {
      if (!savedBlock || typeof savedBlock !== "object") return
      const block = { ...savedBlock }
      let action = block.action
      // Upgrade old saved conditions to the new metric/operator/reference system.
      if (action === "ifFribbies") {
        action = "ifCondition"
        block.metric = "fribbies"
        block.operator = "gte"
        block.reference = "target"
      } else if (action === "waitUntil") {
        action = "whenCondition"
        block.metric = "fribbies"
        block.operator = "gte"
        block.reference = "target"
      }
      if (!ENGINEERING_ACTIONS.has(action)) action = "throw"
      const upgrade = /^\d+$/.test(String(block.upgrade)) && Number(block.upgrade) <= 14 ? String(block.upgrade) : "0"
      addEngineeringBlock(action, upgrade, block)
    })
  } else {
    addEngineeringBlock("throw")
    addEngineeringBlock("buy", "0")
  }
  engineeringLoading = false
  if (!Array.isArray(program) || !program.length) saveEngineeringBlocks()
  else if (hasEngineeringAscensionBlock() && !isEngineeringAscensionProgramAuthorized()) {
    setEngineeringStatus("This saved script contains an Ascend block. Click Save script and confirm before running it in a loop.")
  } else if (!hasEngineeringAscensionBlock()) {
    // Persist migrated legacy conditions in the new compatible format.
    saveEngineeringBlocks()
  }
}

function clearEngineeringBlocks() {
  stopEngineeringLoop()
  const workspace = document.getElementById("engineeringBlocks")
  if (workspace) workspace.replaceChildren()
  saveEngineeringBlocks()
  setEngineeringStatus("Workspace cleared. Add a block to build a new program.")
}

function setEngineeringStatus(message) {
  const status = document.getElementById("engineeringStatus")
  if (status) status.textContent = message
}

function waitForEngineeringStep() {
  return new Promise(resolve => window.setTimeout(resolve, 140))
}

async function waitForEngineeringDuration(milliseconds) {
  let remaining = milliseconds
  while (remaining > 0 && !engineeringStopRequested) {
    const interval = Math.min(remaining, 100)
    await new Promise(resolve => window.setTimeout(resolve, interval))
    remaining -= interval
  }
}

async function runEngineeringScript(fromLoop = false) {
  if (!hasSkill("engineering-0")) {
    setEngineeringStatus("Unlock Block Basics in the Engineering ascension branch first.")
    return
  }
  if (engineeringRunning) return
  const program = getEngineeringProgram()
  if (!program.length) {
    setEngineeringStatus("Your workspace is empty. Add a block first.")
    return
  }
  const loopAscensionAuthorized = fromLoop && isEngineeringAscensionProgramAuthorized(program)
  if (fromLoop && hasEngineeringAscensionBlock(program) && !loopAscensionAuthorized) {
    setEngineeringStatus("Save this script and confirm its Ascend block before running it in a loop.")
    return
  }

  engineeringRunning = true
  engineeringStopRequested = false
  let completed = 0
  let programCounter = 0
  let steps = 0
  let stopReason = ""
  const maxSteps = 250
  const repeatStack = []
  const maxRuntime = Date.now() + 120000
  const context = {
    scriptStartSnapshot: engineeringCaptureSnapshot(),
    conditionBaselines: fromLoop ? engineeringLoopConditionBaselines : new Map(),
    previousValues: fromLoop ? engineeringLoopPreviousValues : new Map(),
    repeatStack
  }

  const frameAtEnd = async () => {
    while (repeatStack.length && programCounter >= repeatStack[repeatStack.length - 1].end) {
      const frame = repeatStack[repeatStack.length - 1]
      if (frame.untilCondition) {
        if (engineeringConditionSatisfied(frame.untilCondition, context, frame.blockIndex, frame.snapshot)) {
          repeatStack.pop()
          programCounter = frame.after
        } else {
          programCounter = frame.start
        }
      } else {
        frame.remaining--
        if (frame.remaining > 0) programCounter = frame.start
        else {
          repeatStack.pop()
          programCounter = frame.after
        }
      }
      if (engineeringStopRequested) break
    }
  }

  try {
    while (!engineeringStopRequested) {
      await frameAtEnd()
      if (programCounter >= program.length || engineeringStopRequested) break
      if (steps >= maxSteps || Date.now() >= maxRuntime) {
        stopReason = "Safety limit reached (250 executed blocks or 2 minutes). Stop the script or simplify its loop to continue."
        if (fromLoop) stopEngineeringLoop()
        break
      }
      const currentIndex = programCounter
      const block = program[currentIndex]
      steps++
      completed++
      setEngineeringStatus(`Running block ${currentIndex + 1} of ${program.length}…`)

      if (block.action === "throw") {
        throwFribby()
        programCounter++
      } else if (block.action === "buy") {
        const buyAction = window[`buy${Number(block.upgrade)}`]
        if (typeof buyAction === "function") buyAction()
        programCounter++
      } else if (block.action === "ascend") {
        if (fribbies >= ASCENSION_THRESHOLD) ascend(loopAscensionAuthorized)
        else setEngineeringStatus("Ascend block skipped: you need at least 1,000,000 Fribbies.")
        programCounter++
      } else if (block.action === "wait") {
        await waitForEngineeringDuration(Math.min(60, Math.max(0.1, Number(block.seconds) || 1)) * 1000)
        programCounter++
      } else if (block.action === "repeat" || block.action === "repeatUntil") {
        const span = Math.min(program.length - currentIndex - 1, Math.max(0, Number(block.blockCount) || 1))
        const initialConditionMet = block.action === "repeatUntil" && engineeringConditionSatisfied(block, context, currentIndex, engineeringCaptureSnapshot())
        if (span <= 0 || initialConditionMet) {
          programCounter += span + 1
        } else {
          repeatStack.push({
            blockIndex: currentIndex,
            start: currentIndex + 1,
            end: currentIndex + 1 + span,
            after: currentIndex + 1 + span,
            remaining: block.action === "repeat" ? Math.min(100, Math.max(1, Number(block.repeatCount) || 1)) : null,
            untilCondition: block.action === "repeatUntil" ? block : null,
            snapshot: engineeringCaptureSnapshot()
          })
          programCounter++
        }
      } else if (block.action === "loopBack") {
        const back = Math.min(program.length, Math.max(1, Number(block.back) || 1))
        programCounter = Math.max(0, currentIndex - back)
      } else if (block.action === "ifCondition") {
        if (engineeringConditionSatisfied(block, context, currentIndex)) programCounter++
        else {
          const span = Math.min(program.length - currentIndex - 1, Math.max(0, Number(block.blockCount) || 1))
          programCounter = currentIndex + 1 + span
        }
      } else if (block.action === "whenCondition") {
        const deadline = maxRuntime
        let conditionMet = engineeringConditionSatisfied(block, context, currentIndex)
        while (!conditionMet && !engineeringStopRequested && Date.now() < deadline) {
          await new Promise(resolve => window.setTimeout(resolve, 100))
          if (engineeringStopRequested || Date.now() >= deadline) break
          conditionMet = engineeringConditionSatisfied(block, context, currentIndex)
        }
        if (!conditionMet && !engineeringStopRequested) {
          stopReason = "When-condition reached the 2-minute safety limit before the condition became true."
          engineeringStopRequested = true
          if (fromLoop) stopEngineeringLoop()
        }
        programCounter++
      } else if (block.action === "stop") {
        engineeringStopRequested = true
        stopReason = "Stopped by a Stop script block."
        if (fromLoop) stopEngineeringLoop()
      } else {
        programCounter++
      }

      if (programCounter < program.length && !engineeringStopRequested) await waitForEngineeringStep()
    }

    if (stopReason) setEngineeringStatus(stopReason)
    else if (engineeringStopRequested) setEngineeringStatus("Script stopped.")
    else if (completed && !(fromLoop && !engineeringLoopEnabled)) {
      setEngineeringStatus(`Program finished: ran ${completed} block${completed === 1 ? "" : "s"}.`)
    }
  } finally {
    engineeringRunning = false
    engineeringStopRequested = false
  }
}

function toggleEngineeringLoop() {
  if (engineeringLoopEnabled) {
    stopEngineeringLoop()
    return
  }
  const program = getEngineeringProgram()
  if (hasEngineeringAscensionBlock(program) && !isEngineeringAscensionProgramAuthorized(program)) {
    setEngineeringStatus("Save this script and confirm its Ascend block before running it in a loop.")
    return
  }
  engineeringLoopStartSnapshot = engineeringCaptureSnapshot()
  engineeringLoopPreviousValues = new Map()
  engineeringLoopConditionBaselines = new Map()
  engineeringLoopEnabled = true
  engineeringStopRequested = false
  const button = document.getElementById("engineeringLoopButton")
  if (button) {
    button.textContent = "■ Stop loop"
    button.setAttribute("aria-pressed", "true")
  }
  setEngineeringStatus(hasEngineeringAscensionBlock(program)
    ? "Loop running. Ascend and state-aware logic blocks are enabled and may reset regular progress automatically."
    : "Loop running. Conditions can compare currencies and upgrades to fixed targets or earlier values.")
  runEngineeringScript(true)
  engineeringLoopTimer = window.setInterval(() => {
    if (!engineeringRunning && engineeringLoopEnabled) runEngineeringScript(true)
  }, 1000)
}

function stopEngineeringScript() {
  engineeringStopRequested = true
  if (engineeringLoopEnabled) stopEngineeringLoop()
  else setEngineeringStatus("Stopping script…")
}

function stopEngineeringLoop() {
  engineeringLoopEnabled = false
  if (engineeringLoopTimer !== null) window.clearInterval(engineeringLoopTimer)
  engineeringLoopTimer = null
  engineeringStopRequested = true
  engineeringLoopStartSnapshot = null
  engineeringLoopPreviousValues = new Map()
  engineeringLoopConditionBaselines = new Map()
  const button = document.getElementById("engineeringLoopButton")
  if (button) {
    button.textContent = "↻ Start loop"
    button.setAttribute("aria-pressed", "false")
  }
}

document.addEventListener("DOMContentLoaded", loadEngineeringBlocks)
