document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.querySelector('.btn-success')
  const timerDisplay = document.querySelector('.card h3')
  const grid = document.querySelector('.grid-container')
  let tiles = Array.from(document.querySelectorAll('.grid-item'))
  let emptyTile = document.querySelector('.black-box')
  let startTime,
    timer,
    moveCount = 0
  let historyTable = document.getElementById('history')
  let isGameRunning = false

  function startGame() {
    if (isGameRunning) {
      stopGame()
      return
    }

    isGameRunning = true
    clearInterval(timer)
    moveCount = 0
    timerDisplay.textContent = '00:00'
    shuffleTiles()
    startTimer()
    startButton.textContent = 'Kết thúc'
  }

  function stopGame() {
    isGameRunning = false
    clearInterval(timer)
    startButton.textContent = 'Bắt đầu'
  }

  function shuffleTiles() {
    for (let i = 0; i < 100; i++) {
      let neighbors = getMovableTiles()
      let randomTile = neighbors[Math.floor(Math.random() * neighbors.length)]
      swapTiles(randomTile)
    }
  }

  function getMovableTiles() {
    let emptyIndex = tiles.indexOf(emptyTile)
    let neighbors = []
    let row = Math.floor(emptyIndex / 4)
    let col = emptyIndex % 4

    ;[
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ].forEach(([dx, dy]) => {
      let newRow = row + dx
      let newCol = col + dy
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 4) {
        neighbors.push(tiles[newRow * 4 + newCol])
      }
    })
    return neighbors
  }

  function swapTiles(tile) {
    let emptyIndex = tiles.indexOf(emptyTile)
    let tileIndex = tiles.indexOf(tile)
    ;[tiles[emptyIndex], tiles[tileIndex]] = [
      tiles[tileIndex],
      tiles[emptyIndex],
    ]

    // Cập nhật vị trí của ô trống
    emptyTile = tiles[emptyIndex]

    grid.innerHTML = ''
    tiles.forEach((tile) => grid.appendChild(tile))
  }

  function moveTile(event) {
    if (!isGameRunning) return

    let keyMap = {
      ArrowUp: -4,
      ArrowDown: 4,
      ArrowLeft: -1,
      ArrowRight: 1,
      w: -4,
      s: 4,
      a: -1,
      d: 1,
    }
    let move = keyMap[event.key]
    if (move !== undefined) {
      let emptyIndex = tiles.indexOf(emptyTile)
      let targetIndex = emptyIndex + move
      if (
        targetIndex >= 0 &&
        targetIndex < tiles.length &&
        !(emptyIndex % 4 === 0 && move === -1) &&
        !(emptyIndex % 4 === 3 && move === 1)
      ) {
        swapTiles(tiles[targetIndex])
        moveCount++
        if (checkWin()) {
          clearInterval(timer)
          alert('YOU WIN!')
          saveHistory()
          stopGame()
        }
      }
    }
  }

  function checkWin() {
    return tiles.every((tile, index) => {
      return tile.textContent === '' || parseInt(tile.textContent) === index + 1
    })
  }

  function startTimer() {
    startTime = Date.now()
    timer = setInterval(() => {
      let elapsed = Math.floor((Date.now() - startTime) / 1000)
      let minutes = String(Math.floor(elapsed / 60)).padStart(2, '0')
      let seconds = String(elapsed % 60).padStart(2, '0')
      timerDisplay.textContent = `${minutes}:${seconds}`
    }, 1000)
  }

  function saveHistory() {
    let newRow = document.createElement('tr')
    newRow.innerHTML = `<td>${
      historyTable.rows.length + 1
    }</td><td>${moveCount}</td><td>${timerDisplay.textContent}</td>`
    historyTable.appendChild(newRow)
  }

  startButton.addEventListener('click', startGame)
  document.addEventListener('keydown', moveTile)
})
