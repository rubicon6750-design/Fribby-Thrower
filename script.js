let fribbies = 0

let u0Amount = 0
let u0Cost = 50
let u1Amount = 0
let u1Cost = 200
let u2Amount = 0
let u2Cost = 500
let u3Amount = 0
let u3Cost = 1000
let u4Amount = 0
let u4Cost = 2500
let u5Amount = 0
let u5Cost = 5000
let u6Amount = 0
let u6Cost = 10000
let u7Amount = 0
let u7Cost = 25000
let u8Amount = 0
let u8Cost = 50000

let autoThrowTimer

function updateFribby() {
  document.getElementById("fribbyAmount").innerText =
        "Fribbies Thrown: " + fribbies
  saveGame()
}

function throwFribby() {
  fribbies += u0Amount + 1 + u3Amount * 5 + u5Amount * 10 + u8Amount * 100
  updateFribby()
}

function buy0() {
  if (fribbies >= u0Cost) {
   fribbies -= u0Cost
   u0Amount += 1
   u0Cost = u0Cost * 3
   updateFribby()
   document.getElementById("upgrade0").innerText =
        "Extra Hand - (" + u0Amount + ", +1 Fribby per click) - " + u0Cost + " Fribbies"
  }
}

function buy1() {
  if (fribbies >= u1Cost) {
   fribbies -= u1Cost
      u1Amount += 1
   u1Cost = Math.round(u1Cost * 1.5)
   updateFribby()
   document.getElementById("upgrade1").innerText =
        "Auto Thrower (" + u1Amount + ", +1 auto throw) - " + u1Cost + " Fribbies"
   updateAutoThrowInterval()
  }
}

function buy2() {
  if (fribbies >= u2Cost) {
   fribbies -= u2Cost
      u2Amount += 1
   u2Cost = Math.round(u2Cost * 1.5)
   updateFribby()
   document.getElementById("upgrade2").innerText =
        "Intern (" + u2Amount + ", +1 Fribby per auto throw) - " + u2Cost + " Fribbies"
  }
}

function buy3() {
  if (fribbies >= u3Cost) {
    fribbies -= u3Cost
    u3Amount += 1
    u3Cost = Math.round(u3Cost * 1.5)
    updateFribby()
    document.getElementById("upgrade3").innerText =
      "Fribby Cannon (" + u3Amount + ", +5 Fribbies per click) - " + u3Cost + " Fribbies"
  }
}

function buy4() {
  if (fribbies >= u4Cost) {
    fribbies -= u4Cost
    u4Amount += 1
    u4Cost = Math.round(u4Cost * 1.5)
    updateFribby()
       document.getElementById("upgrade4").innerText =
        "Supervisor (" + u4Amount + ", +5 Fribbies per auto throw) - " + u4Cost + " Fribbies"
  }
}

function buy5() {
  if (fribbies >= u5Cost) {
    fribbies -= u5Cost
    u5Amount += 1
    u5Cost = Math.round(u5Cost * 1.5)
    updateFribby()
    document.getElementById("upgrade5").innerText =
      "Power Throw (" + u5Amount + ", +10 Fribbies per click) - " + u5Cost + " Fribbies"
  }
}

function buy6() {
  if (fribbies >= u6Cost) {
    fribbies -= u6Cost
    u6Amount += 1
    u6Cost = Math.round(u6Cost * 1.5)
    updateFribby()
    document.getElementById("upgrade6").innerText =
      "Fribby Factory (" + u6Amount + ", +10 Fribbies per auto throw) - " + u6Cost + " Fribbies"
  }
}

function buy7() {
  if (fribbies >= u7Cost) {
    fribbies -= u7Cost
    u7Amount += 1
    u7Cost = Math.round(u7Cost * 1.5)
    updateFribby()
    document.getElementById("upgrade7").innerText =
      "Turbo Thrower (" + u7Amount + ", +5 auto throws/sec) - " + u7Cost + " Fribbies"
    updateAutoThrowInterval()
  }
}

function buy8() {
  if (fribbies >= u8Cost) {
    fribbies -= u8Cost
    u8Amount += 1
    u8Cost = Math.round(u8Cost * 1.5)
    updateFribby()
    document.getElementById("upgrade8").innerText =
      "Mega Cannon (" + u8Amount + ", +100 Fribbies per click) - " + u8Cost + " Fribbies"
  }
}

function updateAutoThrowInterval() {
  clearInterval(autoThrowTimer)
  const autoThrowsPerSecond = u1Amount + u7Amount * 5
  autoThrowTimer = setInterval(function() {
        fribbies += 1 + u2Amount + u4Amount * 5 + u6Amount * 10
    updateFribby()
  }, 1000 / autoThrowsPerSecond)
}

const minigameUnlockOrder = [
  "patternRecall",
  "luckySpin",
  "numberGuess",
  "pathFinder",
  "matching",
  "minesweeper"
]
let unlockedMinigames = 0
let minigameUnlockCost = 5000

function buyMinigameUnlock() {
  const status = document.getElementById("minigameUnlockStatus")
  if (unlockedMinigames >= minigameUnlockOrder.length) return
  if (fribbies < minigameUnlockCost) {
    status.textContent = `You need ${minigameUnlockCost} Fribbies to unlock the next minigame.`
    return
  }

  fribbies -= minigameUnlockCost
  updateFribby()
  document.getElementById("minigamesArea").hidden = false
  const game = minigameUnlockOrder[unlockedMinigames]
  unlockedMinigames++
  document.querySelector(`[data-minigame="${game}"]`).hidden = false
  minigameUnlockCost *= 2
  status.textContent = `Unlocked ${getMinigameName(game)}!`
  showMinigame(game)
  updateMinigameUnlockButton()
  saveGame()
}

function getMinigameName(game) {
  const names = {
    patternRecall: "Pattern Recall",
    luckySpin: "Lucky Spin",
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
  button.textContent = `Unlock Minigame (${unlockedMinigames}/6) - ${minigameUnlockCost} Fribbies`
}

function showMinigame(game) {
  if (!minigameUnlockOrder.slice(0, unlockedMinigames).includes(game)) return
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
    fribbies += 100
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
      fribbies += 150
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
  const positions = Array.from({ length: minesweeperRows * minesweeperColumns }, (_, i) => i)

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }

  minesweeperGrid = Array.from({ length: minesweeperRows }, () =>
    Array.from({ length: minesweeperColumns }, () => ({ mine: false, nearby: 0, revealed: false, flagged: false }))
  )
  minesweeperGameOver = false

  for (let i = 0; i < mineCount; i++) {
    const position = positions[i]
    minesweeperGrid[Math.floor(position / minesweeperColumns)][position % minesweeperColumns].mine = true
  }

  for (let row = 0; row < minesweeperRows; row++) {
    for (let column = 0; column < minesweeperColumns; column++) {
      if (!minesweeperGrid[row][column].mine) {
        minesweeperGrid[row][column].nearby = getNearbyMines(row, column)
      }
    }
  }

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

  status.textContent = `${mineCount} rogue Fribbies are hiding! Reveal every safe tile to win; right-click to flag.`
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
    tile.revealed = true
    getMinesweeperTileElement(row, column).textContent = "🥏"
    getMinesweeperTileElement(row, column).classList.add("revealed", "mine")
    minesweeperGameOver = true
    document.getElementById("minesweeperStatus").textContent = "A rogue Fribby! Your round is over."
    revealAllMines()
    return
  }

  revealSafeTile(row, column)
  if (hasWonMinesweeper()) {
    minesweeperGameOver = true
    fribbies += 500
    updateFribby()
    document.getElementById("minesweeperStatus").textContent = "Score! You earned 500 Fribbies."
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
let pathFinderGoal = { row: 6, column: 6 }
let pathFinderActive = false

function generatePathFinderMaze() {
  const maze = Array.from({ length: 7 }, () => Array(7).fill(1))
  const visited = Array.from({ length: 4 }, () => Array(4).fill(false))

  // Choose random, distinct starting and ending intersections.
  const startCell = Math.floor(Math.random() * 16)
  let goalCell
  do {
    goalCell = Math.floor(Math.random() * 16)
  } while (goalCell === startCell)

  const startRow = Math.floor(startCell / 4) * 2
  const startColumn = (startCell % 4) * 2
  const goalRow = Math.floor(goalCell / 4) * 2
  const goalColumn = (goalCell % 4) * 2

  const stack = [[startRow, startColumn]]
  const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]]

  visited[startRow / 2][startColumn / 2] = true
  maze[startRow][startColumn] = 0

  while (stack.length > 0) {
    const [row, column] = stack[stack.length - 1]

    const options = directions.filter(([rowChange, columnChange]) => {
      const nextRow = row + rowChange
      const nextColumn = column + columnChange

      return (
        nextRow >= 0 &&
        nextRow < 7 &&
        nextColumn >= 0 &&
        nextColumn < 7 &&
        !visited[nextRow / 2][nextColumn / 2]
      )
    })

    if (options.length === 0) {
      stack.pop()
      continue
    }

    const [rowChange, columnChange] =
      options[Math.floor(Math.random() * options.length)]

    const nextRow = row + rowChange
    const nextColumn = column + columnChange

    maze[row + rowChange / 2][column + columnChange / 2] = 0
    maze[nextRow][nextColumn] = 0
    visited[nextRow / 2][nextColumn / 2] = true
    stack.push([nextRow, nextColumn])
  }

  return {
    maze,
    start: { row: startRow, column: startColumn },
    goal: { row: goalRow, column: goalColumn }
  }
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
    fribbies += 100
    updateFribby()

    document.getElementById("pathFinderStatus").textContent =
      "Bullseye! You guided the Fribby home and earned 100 Fribbies."
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
  fribbies += reward
  updateFribby()
  if (patternRecallSequence.length >= 8) {
    patternRecallActive = false
    document.getElementById("patternRecallStatus").textContent = `Amazing memory! You earned ${reward} Fribbies this round.`
    return
  }

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

function spinLuckyWheel() {
  if (fribbies < 50) {
    document.getElementById("luckySpinStatus").textContent = "You need 50 Fribbies to power the wheel."
    return
  }
  fribbies -= 50
  const prizes = [0, 25, 50, 100, 200]
  const prize = prizes[Math.floor(Math.random() * prizes.length)]
  fribbies += prize
  updateFribby()
    document.getElementById("luckySpinStatus").textContent = prize === 0
    ? "The Fribby wheel slipped past the prize. Try another spin!"
    : `🥏 The wheel landed on ${prize} Fribbies!`
}

/* -------------------- COOKIE SAVE SYSTEM --------------------
   The save cookie stores progression only (currency, upgrades, and
   unlocked minigames). Active minigame rounds restart when the page reloads.
*/
const GAME_SAVE_COOKIE = "fribbyThrowerSave"
const GAME_SAVE_DAYS = 365

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
    version: 1,
    fribbies,
    upgrades: [
      { amount: u0Amount, cost: u0Cost },
      { amount: u1Amount, cost: u1Cost },
      { amount: u2Amount, cost: u2Cost },
      { amount: u3Amount, cost: u3Cost },
      { amount: u4Amount, cost: u4Cost },
      { amount: u5Amount, cost: u5Cost },
      { amount: u6Amount, cost: u6Cost },
      { amount: u7Amount, cost: u7Cost },
      { amount: u8Amount, cost: u8Cost }
    ],
    unlockedMinigames,
    minigameUnlockCost
  }
}

function saveGame(showMessage = false) {
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

function loadGame(showMessage = true) {
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
    const data = JSON.parse(rawSave)
    if (data.version !== 1 || !Array.isArray(data.upgrades) || data.upgrades.length !== 9) {
      throw new Error("Unsupported save format")
    }

    fribbies = Math.max(0, Number(data.fribbies) || 0)
    u0Amount = Math.max(0, Number(data.upgrades[0].amount) || 0); u0Cost = Math.max(1, Number(data.upgrades[0].cost) || 1)
    u1Amount = Math.max(0, Number(data.upgrades[1].amount) || 0); u1Cost = Math.max(1, Number(data.upgrades[1].cost) || 1)
    u2Amount = Math.max(0, Number(data.upgrades[2].amount) || 0); u2Cost = Math.max(1, Number(data.upgrades[2].cost) || 1)
    u3Amount = Math.max(0, Number(data.upgrades[3].amount) || 0); u3Cost = Math.max(1, Number(data.upgrades[3].cost) || 1)
    u4Amount = Math.max(0, Number(data.upgrades[4].amount) || 0); u4Cost = Math.max(1, Number(data.upgrades[4].cost) || 1)
    u5Amount = Math.max(0, Number(data.upgrades[5].amount) || 0); u5Cost = Math.max(1, Number(data.upgrades[5].cost) || 1)
    u6Amount = Math.max(0, Number(data.upgrades[6].amount) || 0); u6Cost = Math.max(1, Number(data.upgrades[6].cost) || 1)
    u7Amount = Math.max(0, Number(data.upgrades[7].amount) || 0); u7Cost = Math.max(1, Number(data.upgrades[7].cost) || 1)
    u8Amount = Math.max(0, Number(data.upgrades[8].amount) || 0); u8Cost = Math.max(1, Number(data.upgrades[8].cost) || 1)

    unlockedMinigames = Math.max(0, Math.min(minigameUnlockOrder.length, Number(data.unlockedMinigames) || 0))
    minigameUnlockCost = Math.max(5000, Number(data.minigameUnlockCost) || 5000)

    updateFribby()
    const labels = [
      `Extra Hand - (${u0Amount}, +1 Fribby per click) - ${u0Cost} Fribbies`,
      `Auto Thrower (${u1Amount}, +1 auto throw) - ${u1Cost} Fribbies`,
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

    document.getElementById("minigamesArea").hidden = unlockedMinigames === 0
    minigameUnlockOrder.forEach((game, index) => {
      const selector = document.querySelector(`[data-minigame="${game}"]`)
      if (selector) selector.hidden = index >= unlockedMinigames
    })
    updateMinigameUnlockButton()
    if (u1Amount + u7Amount * 5 > 0) updateAutoThrowInterval()
    if (status && showMessage) status.textContent = "Save loaded successfully!"
    return true
  } catch (error) {
    if (status && showMessage) status.textContent = "The saved cookie was invalid, so it wasn't loaded."
    return false
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loaded = loadGame(false)
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
let leaderboardUserId = null

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
    const savedName = localStorage.getItem("fribbyLeaderboardName") || ""
    if (nameInput) nameInput.value = savedName

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
  if (playerName.length < 2) {
    if (status) status.textContent = "Please enter a player name with at least 2 characters."
    nameInput?.focus()
    return
  }

  try {
    localStorage.setItem("fribbyLeaderboardName", playerName)
    const { error } = await leaderboardClient
      .from(LEADERBOARD_TABLE)
      .upsert({
        user_id: leaderboardUserId,
        player_name: playerName,
        score: Math.max(0, Math.floor(Number(fribbies) || 0)),
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
      .select("player_name, score, updated_at")
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
        const name = document.createElement("span")
        const score = document.createElement("strong")
        name.textContent = safeLeaderboardName(entry.player_name) || "Anonymous Fribby"
        score.textContent = `${Number(entry.score || 0).toLocaleString()} Fribbies`
        item.append(name, score)
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

document.addEventListener("DOMContentLoaded", initializeLeaderboard)

/* -------------------- SAVE FILE EXPORT / IMPORT --------------------
   Export creates a portable JSON backup. Import validates the file before
   replacing browser storage, then loads the imported progression.
*/
function exportSave() {
  try {
    const saveText = JSON.stringify(getGameSaveData(), null, 2)
    const blob = new Blob([saveText], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "fribby-thrower-save.json"
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
  try {
    const text = await file.text()
    const data = JSON.parse(text)

    // Validate the structure before touching the current save.
    if (
      data.version !== 1 ||
      !Number.isFinite(Number(data.fribbies)) ||
      !Array.isArray(data.upgrades) ||
      data.upgrades.length !== 9 ||
      !data.upgrades.every(item =>
        item &&
        Number.isFinite(Number(item.amount)) &&
        Number.isFinite(Number(item.cost))
      ) ||
      !Number.isFinite(Number(data.unlockedMinigames)) ||
      !Number.isFinite(Number(data.minigameUnlockCost))
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
  fribbies = Math.max(0, Number(data.fribbies) || 0)
  u0Amount = Math.max(0, Number(data.upgrades[0].amount) || 0); u0Cost = Math.max(1, Number(data.upgrades[0].cost) || 1)
  u1Amount = Math.max(0, Number(data.upgrades[1].amount) || 0); u1Cost = Math.max(1, Number(data.upgrades[1].cost) || 1)
  u2Amount = Math.max(0, Number(data.upgrades[2].amount) || 0); u2Cost = Math.max(1, Number(data.upgrades[2].cost) || 1)
  u3Amount = Math.max(0, Number(data.upgrades[3].amount) || 0); u3Cost = Math.max(1, Number(data.upgrades[3].cost) || 1)
  u4Amount = Math.max(0, Number(data.upgrades[4].amount) || 0); u4Cost = Math.max(1, Number(data.upgrades[4].cost) || 1)
  u5Amount = Math.max(0, Number(data.upgrades[5].amount) || 0); u5Cost = Math.max(1, Number(data.upgrades[5].cost) || 1)
  u6Amount = Math.max(0, Number(data.upgrades[6].amount) || 0); u6Cost = Math.max(1, Number(data.upgrades[6].cost) || 1)
  u7Amount = Math.max(0, Number(data.upgrades[7].amount) || 0); u7Cost = Math.max(1, Number(data.upgrades[7].cost) || 1)
  u8Amount = Math.max(0, Number(data.upgrades[8].amount) || 0); u8Cost = Math.max(1, Number(data.upgrades[8].cost) || 1)
  unlockedMinigames = Math.max(0, Math.min(minigameUnlockOrder.length, Number(data.unlockedMinigames) || 0))
  minigameUnlockCost = Math.max(5000, Number(data.minigameUnlockCost) || 5000)

  updateFribby()
  const labels = [
    `Extra Hand - (${u0Amount}, +1 Fribby per click) - ${u0Cost} Fribbies`,
    `Auto Thrower (${u1Amount}, +1 auto throw) - ${u1Cost} Fribbies`,
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
  document.getElementById("minigamesArea").hidden = unlockedMinigames === 0
  minigameUnlockOrder.forEach((game, index) => {
    const selector = document.querySelector(`[data-minigame="${game}"]`)
    if (selector) selector.hidden = index >= unlockedMinigames
  })
  updateMinigameUnlockButton()
  if (u1Amount + u7Amount * 5 > 0) updateAutoThrowInterval()
  saveGame(false)
}
