let fribbies = 0n

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
  document.getElementById("fribbyAmount").innerText =
        "Fribbies Thrown: " + formatFribbies(fribbies)
  saveGame()
}

function getFribbiesPerClick() { return u0Amount + 1 + u3Amount * 5 + u5Amount * 10 + u8Amount * 100 }

function throwFribby() {
  playSoundEffect("throwSound")
  fribbies += BigInt(getFribbiesPerClick())
  updateFribby()
}

function buy0() {
  if (fribbies >= u0Cost) {
   playSoundEffect("upgradeSound")
   fribbies -= u0Cost
   u0Amount += 1
   u0Cost = u0Cost * 3n
   updateFribby()
   document.getElementById("upgrade0").innerText =
        "Extra Hand - (" + u0Amount + ", +1 Fribby per click) - " + u0Cost + " Fribbies"
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy1() {
  if (fribbies >= u1Cost) {
   playSoundEffect("upgradeSound")
   fribbies -= u1Cost
      u1Amount += 1
   u1Cost = (u1Cost * 3n + 1n) / 2n
   updateFribby()
   document.getElementById("upgrade1").innerText =
        "Auto Thrower (" + u1Amount + ", +1 auto throw/sec) - " + u1Cost + " Fribbies"
   updateAutoThrowInterval()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy2() {
  if (fribbies >= u2Cost) {
   playSoundEffect("upgradeSound")
   fribbies -= u2Cost
      u2Amount += 1
   u2Cost = (u2Cost * 3n + 1n) / 2n
   updateFribby()
   document.getElementById("upgrade2").innerText =
        "Intern (" + u2Amount + ", +1 Fribby per auto throw) - " + u2Cost + " Fribbies"
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy3() {
  if (fribbies >= u3Cost) {
   playSoundEffect("upgradeSound")
    fribbies -= u3Cost
    u3Amount += 1
    u3Cost = (u3Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade3").innerText =
      "Fribby Cannon (" + u3Amount + ", +5 Fribbies per click) - " + u3Cost + " Fribbies"
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy4() {
  if (fribbies >= u4Cost) {
   playSoundEffect("upgradeSound")
    fribbies -= u4Cost
    u4Amount += 1
    u4Cost = (u4Cost * 3n + 1n) / 2n
    updateFribby()
       document.getElementById("upgrade4").innerText =
        "Supervisor (" + u4Amount + ", +5 Fribbies per auto throw) - " + u4Cost + " Fribbies"
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy5() {
  if (fribbies >= u5Cost) {
   playSoundEffect("upgradeSound")
    fribbies -= u5Cost
    u5Amount += 1
    u5Cost = (u5Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade5").innerText =
      "Power Throw (" + u5Amount + ", +10 Fribbies per click) - " + u5Cost + " Fribbies"
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy6() {
  if (fribbies >= u6Cost) {
   playSoundEffect("upgradeSound")
    fribbies -= u6Cost
    u6Amount += 1
    u6Cost = (u6Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade6").innerText =
      "Fribby Factory (" + u6Amount + ", +10 Fribbies per auto throw) - " + u6Cost + " Fribbies"
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy7() {
  if (fribbies >= u7Cost) {
   playSoundEffect("upgradeSound")
    fribbies -= u7Cost
    u7Amount += 1
    u7Cost = (u7Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade7").innerText =
      "Turbo Thrower (" + u7Amount + ", +5 auto throws/sec) - " + u7Cost + " Fribbies"
    updateAutoThrowInterval()
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function buy8() {
  if (fribbies >= u8Cost) {
   playSoundEffect("upgradeSound")
    fribbies -= u8Cost
    u8Amount += 1
    u8Cost = (u8Cost * 3n + 1n) / 2n
    updateFribby()
    document.getElementById("upgrade8").innerText =
      "Mega Cannon (" + u8Amount + ", +100 Fribbies per click) - " + u8Cost + " Fribbies"
  } else {
    playSoundEffect("upgradeFailSound")
  }
}

function updateAutoThrowInterval() {
  clearInterval(autoThrowTimer)
  const autoThrowsPerSecond = u1Amount + u7Amount * 5
  autoThrowTimer = setInterval(function() {
        fribbies += BigInt(1 + u2Amount + u4Amount * 5 + u6Amount * 10)
    updateFribby()
  }, 1000 / autoThrowsPerSecond)
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
  if (fribbies < minigameUnlockCost) {
    playSoundEffect("upgradeFailSound")
    status.textContent = `You need ${minigameUnlockCost} Fribbies to unlock the next minigame.`
    return
  }

  fribbies -= minigameUnlockCost
  updateFribby()
  document.getElementById("minigamesArea").hidden = false
  const game = minigameUnlockOrder[unlockedMinigames]
  unlockedMinigames++
  document.querySelector(`[data-minigame="${game}"]`).hidden = false
  minigameUnlockCost *= 2n
  status.textContent = `Unlocked ${getMinigameName(game)}!`
  showMinigame(game)
  updateMinigameUnlockButton()
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
  button.textContent = `Unlock Minigame (${unlockedMinigames}/6) - ${minigameUnlockCost} Fribbies`
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
    fribbies += BigInt(100) * BigInt(getFribbiesPerClick())
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
      fribbies += BigInt(150) * BigInt(getFribbiesPerClick())
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
    fribbies += BigInt(1000) * BigInt(getFribbiesPerClick())
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
    fribbies += BigInt(250) * BigInt(getFribbiesPerClick())
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
  fribbies += BigInt(reward) * BigInt(getFribbiesPerClick())
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
    fribbies += BigInt(prize) * BigInt(getFribbiesPerClick())
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
    version: 2,
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
    minigameUnlockCost: minigameUnlockCost.toString()
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
    if (![1, 2].includes(data.version) || !Array.isArray(data.upgrades) || data.upgrades.length !== 9) {
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

    updateFribby()
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
        score.textContent = `${formatLeaderboardScore(entry.score)} Fribbies`
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
  values.push(data.unlockedMinigames, data.minigameUnlockCost)

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
    if (parsedCopies.some(copy => copy.length !== 21)) throw new Error("Invalid save field count")

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
  if (legacyFields.length !== 21 || legacyFields.some(field => !/^\d+$/.test(field))) {
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
  return {
    version: 2,
    fribbies: String(decoded[0]),
    upgrades,
    unlockedMinigames: Number(decoded[19]),
    minigameUnlockCost: String(decoded[20])
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
      ![1, 2].includes(Number(data.version)) ||
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

  updateFribby()
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
  document.getElementById("minigamesArea").hidden = unlockedMinigames === 0
  minigameUnlockOrder.forEach((game, index) => {
    const selector = document.querySelector(`[data-minigame="${game}"]`)
    if (selector) selector.hidden = index >= unlockedMinigames
  })
  updateMinigameUnlockButton()
  if (u1Amount + u7Amount * 5 > 0) updateAutoThrowInterval()
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
  document.querySelectorAll("[data-minigame]").forEach(button => button.hidden = true)
  document.getElementById("minigamesArea").hidden = true
  const defaults = ["Extra Hand (0, +1 Fribby per click) - 10 Fribbies","Auto Thrower (0, +1 auto throw/sec) - 50 Fribbies","Intern (0, +1 Fribby per auto throw) - 200 Fribbies","Fribby Cannon (0, +5 Fribbies per click) - 500 Fribbies","Supervisor (0, +5 Fribbies per auto throw) - 1000 Fribbies","Power Throw (0, +10 Fribbies per click) - 2500 Fribbies","Fribby Factory (0, +10 Fribbies per auto throw) - 5000 Fribbies","Foreman (0, +5 auto throws/sec) - 10000 Fribbies","Mega Cannon (0, +100 Fribbies per click) - 25000 Fribbies"]
  defaults.forEach((label,i) => { const button=document.getElementById(`upgrade${i}`); if(button) button.textContent=label })
  updateMinigameUnlockButton(); updateFribby()
  const status = document.getElementById("saveStatus"); if(status) status.textContent = "Save wiped. A fresh game has started."
}
