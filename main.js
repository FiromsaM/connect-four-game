function Gameboard() {
  const rows = 6
  const columns = 7
  const board = []

  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell())
    }
  }

  const getBoard = () => board

  const dropToken = (column, player) => {
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column])

    if (!availableCells.length) {
      alert('column is full!!! Place token in another column')
      return null
    }

    const lowestRow = availableCells.length - 1
    board[lowestRow][column].addToken(player)

    return { row: lowestRow, column }
  }

  const checkWinner = (row, column, player) => {
    const inBounds = (r, c) => {
      return r >= 0 && r < rows && c >= 0 && c < columns
    }

    //Horizonal
    let count = 1
    let r = row
    let c = column + 1
    // while (inBounds(r, c) && board[r][c].getValue() === player) {
    while (inBounds(r, c) && board[r][c].getValue() === player) {
      count++
      c++
      console.log(count)
    }

    c = column - 1
    while (inBounds(r, c) && board[r][c].getValue() === player) {
      count++
      c--
      console.log(count)
    }
    if (count >= 4) return true

    //Vertical
    count = 1
    r = row + 1
    c = column
    while (inBounds(r, c) && board[r][c].getValue() === player) {
      count++ + r++
    }
    r = row - 1
    while (inBounds(r, c) && board[r][c].getValue() === player) {
      count++
      r--
    }
    if (count >= 4) return true

    //diagnol
    count = 1
    r = row + 1
    c = column + 1
    while (inBounds(r, c) && board[r][c].getValue() === player) {
      count++
      r++
      c++
    }
    r = row - 1
    c = column - 1
    while (inBounds(r, c) && board[r][c].getValue() === player) {
      count++
      r--
      c--
    }
    if (count >= 4) return true

    // diagonal
    count = 1
    r = row + 1
    c = column - 1
    while (inBounds(r, c) && board[r][c].getValue() === player) {
      count++
      r++
      c--
    }
    r = row - 1
    c = column + 1
    while (inBounds(r, c) && board[r][c].getValue() === player) {
      count++
      r--
      c++
    }
    if (count >= 4) return true

    return false
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    )
    console.log(boardWithCellValues)
  }

  return {
    getBoard,
    dropToken,
    printBoard,
    checkWinner,
  }
}

function Cell() {
  let value = 0

  const addToken = (player) => {
    value = player
  }

  const getValue = () => value

  return {
    addToken,
    getValue,
  }
}

function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two'
) {
  const board = Gameboard()

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ]

  let activePlayer = players[0]
  let winner = null

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }
  const getActivePlayer = () => activePlayer

  const getWinner = () => winner

  const printNewRound = () => {
    board.printBoard()
    console.log(`${getActivePlayer().name}'s turn.`)
  }

  const playRound = (column) => {
    if (winner) return //We want to stop playing if we have a winner

    console.log(
      `${getActivePlayer().name}'s turn. Dropping token in column ${column}...`
    )

    const position = board.dropToken(column, getActivePlayer().token)

    if (!position) return

    const hasWon = board.checkWinner(
      position.row,
      position.column,
      getActivePlayer().token
    )

    if (hasWon) {
      console.log(`${getActivePlayer().name} has won!!!`)
      winner = activePlayer
    } else {
      switchPlayerTurn()
      printNewRound()
    }
  }

  printNewRound()

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getWinner,
  }
}

function ScreenController() {
  const game = GameController()
  const playerTurnDiv = document.querySelector('.turn')
  const boardDiv = document.querySelector('.board')
  const container = document.querySelector('.container')
  container.appendChild(playerTurnDiv)

  container.appendChild(boardDiv)

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = ''

    // get the newest version of the board and player turn
    const board = game.getBoard()
    const activePlayer = game.getActivePlayer()
    const winner = game.getWinner()

    // Display player's turn
    playerTurnDiv.textContent = winner
      ? `${winner.name} Won!!!`
      : `${activePlayer.name}'s turn...`

    // Render board squares
    board.forEach((row) => {
      row.forEach((cell, index) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement('button')
        cellButton.classList.add('cell')

        if (cell.getValue() === 1) {
          cellButton.classList.add('playerOne')
        } else if (cell.getValue() === 2) {
          cellButton.classList.add('playerTwo')
        }
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.column = index
        // cellButton.textContent = cell.getValue()
        boardDiv.appendChild(cellButton)
      })
    })
  }

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column
    // Make sure I've clicked a column and not the gaps in between
    if (selectedColumn === undefined) return
    game.playRound(parseInt(selectedColumn))
    updateScreen()
  }
  // function clickHandlerBoard(e) {
  //   const selectedColumn = e.target.dataset.column
  //   if (!selectedColumn) return

  //   game.playRound(parseInt(selectedColumn))
  //   updateScreen()
  // }

  boardDiv.addEventListener('click', clickHandlerBoard)

  // Initial render
  updateScreen()

  // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

ScreenController()

// // // --- Cell factory function ---
// // function Cell() {
// //   let value = 0

// //   const addToken = (player) => {
// //     value = player
// //   }

// //   const getValue = () => value

// //   return {
// //     addToken,
// //     getValue,
// //   }
// // }

// // // --- Gameboard factory function ---
// // function Gameboard() {
// //   const rows = 6
// //   const columns = 7
// //   const board = []

// //   for (let i = 0; i < rows; i++) {
// //     board[i] = []
// //     for (let j = 0; j < columns; j++) {
// //       board[i].push(Cell())
// //     }
// //   }

// //   const getBoard = () => board

// //   const dropToken = (column, player) => {
// //     const availableCells = board
// //       .filter((row) => row[column].getValue() === 0)
// //       .map((row) => row[column])

// //     if (!availableCells.length) {
// //       alert('Column is full! Try another one.')
// //       return null
// //     }

// //     const lowestRow = availableCells.length - 1
// //     board[lowestRow][column].addToken(player)
// //     return { row: lowestRow, column }
// //   }

// //   const printBoard = () => {
// //     const boardWithCellValues = board.map((row) =>
// //       row.map((cell) => cell.getValue())
// //     )
// //     console.log(boardWithCellValues)
// //   }

// //   const checkWinner = (row, column, player) => {
// //     const directions = [
// //       { r: 0, c: 1 }, // Horizontal
// //       { r: 1, c: 0 }, // Vertical
// //       { r: 1, c: 1 }, // Diagonal down-right
// //       { r: 1, c: -1 }, // Diagonal down-left
// //     ]

// //     const inBounds = (r, c) => r >= 0 && r < rows && c >= 0 && c < columns

// //     for (let { r: dr, c: dc } of directions) {
// //       let count = 1

// //       for (let d = -1; d <= 1; d += 2) {
// //         let r = row + d * dr
// //         let c = column + d * dc

// //         while (inBounds(r, c) && board[r][c].getValue() === player) {
// //           count++
// //           r += d * dr
// //           c += d * dc
// //         }
// //       }

// //       if (count >= 4) return true
// //     }

// //     return false
// //   }

// //   return {
// //     getBoard,
// //     dropToken,
// //     printBoard,
// //     checkWinner,
// //   }
// // }

// // // --- GameController ---
// // function GameController(
// //   playerOneName = 'Player One',
// //   playerTwoName = 'Player Two'
// // ) {
// //   const board = Gameboard()
// //   let gameOver = false

// //   const players = [
// //     { name: playerOneName, token: 1 },
// //     { name: playerTwoName, token: 2 },
// //   ]

// //   let activePlayer = players[0]
// //   let winner = null

// //   const switchPlayerTurn = () => {
// //     activePlayer = activePlayer === players[0] ? players[1] : players[0]
// //   }

// //   const getActivePlayer = () => activePlayer
// //   const getWinner = () => winner
// //   const isGameOver = () => gameOver

// //   const playRound = (column) => {
// //     if (gameOver) return

// //     const position = board.dropToken(column, activePlayer.token)
// //     if (!position) return

// //     const { row, column: col } = position
// //     const didWin = board.checkWinner(row, col, activePlayer.token)

// //     if (didWin) {
// //       board.printBoard()
// //       gameOver = true
// //       winner = activePlayer.name
// //       return
// //     }

// //     switchPlayerTurn()
// //     board.printBoard()
// //   }

// //   return {
// //     playRound,
// //     getActivePlayer,
// //     getBoard: board.getBoard,
// //     getWinner,
// //     isGameOver,
// //   }
// // }

// // // --- ScreenController ---
// // function ScreenController() {
// //   const game = GameController()
// //   const playerTurnDiv = document.querySelector('.turn')
// //   const boardDiv = document.querySelector('.board')

// //   const updateScreen = () => {
// //     boardDiv.textContent = ''

// //     const board = game.getBoard()
// //     const activePlayer = game.getActivePlayer()
// //     const winner = game.getWinner()

// //     if (winner) {
// //       playerTurnDiv.textContent = `${winner} wins! 🎉`
// //     } else {
// //       playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
// //     }

// //     board.forEach((row) => {
// //       row.forEach((cell, index) => {
// //         const cellButton = document.createElement('button')
// //         cellButton.classList.add('cell')

// //         if (cell.getValue() === 1) {
// //           cellButton.classList.add('playerOne')
// //         } else if (cell.getValue() === 2) {
// //           cellButton.classList.add('playerTwo')
// //         }

// //         cellButton.dataset.column = index
// //         boardDiv.appendChild(cellButton)
// //       })
// //     })
// //   }

// //   const clickHandlerBoard = (e) => {
// //     if (game.isGameOver()) return

// //     const selectedColumn = e.target.dataset.column
// //     if (!selectedColumn) return

// //     game.playRound(parseInt(selectedColumn))
// //     updateScreen()
// //   }

// //   boardDiv.addEventListener('click', clickHandlerBoard)
// //   updateScreen()
// // }

// // // --- Start the game ---
// // ScreenController()
// function Gameboard() {
//   const rows = 6
//   const columns = 7
//   const board = []

//   for (let i = 0; i < rows; i++) {
//     board[i] = []
//     for (let j = 0; j < columns; j++) {
//       board[i].push(Cell())
//     }
//   }

//   const getBoard = () => board

//   const dropToken = (column, player) => {
//     const availableCells = board
//       .map((row, rowIndex) => ({ cell: row[column], rowIndex }))
//       .filter(({ cell }) => cell.getValue() === 0)

//     if (!availableCells.length) {
//       alert('Column is full! Choose another column.')
//       return null
//     }

//     const { rowIndex } = availableCells[availableCells.length - 1]
//     board[rowIndex][column].addToken(player)
//     return { row: rowIndex, column } // Return position of last move
//   }

//   const checkWinner = (row, column, player) => {
//     const inBounds = (r, c) => r >= 0 && r < rows && c >= 0 && c < columns

//     // HORIZONTAL ↔
//     let count = 1
//     let r = row
//     let c = column + 1
//     while (inBounds(r, c) && board[r][c].getValue() === player) {
//       count++
//       c++
//     }
//     c = column - 1
//     while (inBounds(r, c) && board[r][c].getValue() === player) {
//       count++
//       c--
//     }
//     if (count >= 4) return true

//     // VERTICAL ↑↓
//     count = 1
//     r = row + 1
//     c = column
//     while (inBounds(r, c) && board[r][c].getValue() === player) {
//       count++
//       r++
//     }
//     r = row - 1
//     while (inBounds(r, c) && board[r][c].getValue() === player) {
//       count++
//       r--
//     }
//     if (count >= 4) return true

//     // DIAGONAL ↘↖
//     count = 1
//     r = row + 1
//     c = column + 1
//     while (inBounds(r, c) && board[r][c].getValue() === player) {
//       count++
//       r++
//       c++
//     }
//     r = row - 1
//     c = column - 1
//     while (inBounds(r, c) && board[r][c].getValue() === player) {
//       count++
//       r--
//       c--
//     }
//     if (count >= 4) return true

//     // DIAGONAL ↙↗
//     count = 1
//     r = row + 1
//     c = column - 1
//     while (inBounds(r, c) && board[r][c].getValue() === player) {
//       count++
//       r++
//       c--
//     }
//     r = row - 1
//     c = column + 1
//     while (inBounds(r, c) && board[r][c].getValue() === player) {
//       count++
//       r--
//       c++
//     }
//     if (count >= 4) return true

//     return false
//   }

//   const printBoard = () => {
//     const boardWithCellValues = board.map((row) =>
//       row.map((cell) => cell.getValue())
//     )
//     console.log(boardWithCellValues)
//   }

//   return {
//     getBoard,
//     dropToken,
//     printBoard,
//     checkWinner,
//   }
// }

// function Cell() {
//   let value = 0

//   const addToken = (player) => {
//     value = player
//   }

//   const getValue = () => value

//   return {
//     addToken,
//     getValue,
//   }
// }

// function GameController(
//   playerOneName = 'Player One',
//   playerTwoName = 'Player Two'
// ) {
//   const board = Gameboard()

//   const players = [
//     { name: playerOneName, token: 1 },
//     { name: playerTwoName, token: 2 },
//   ]

//   let activePlayer = players[0]
//   let winner = null

//   const switchPlayerTurn = () => {
//     activePlayer = activePlayer === players[0] ? players[1] : players[0]
//   }

//   const getActivePlayer = () => activePlayer
//   const getWinner = () => winner

//   const printNewRound = () => {
//     board.printBoard()
//     console.log(`${getActivePlayer().name}'s turn.`)
//   }

//   const playRound = (column) => {
//     if (winner) return // Stop game if someone already won

//     console.log(
//       `${getActivePlayer().name}'s turn. Dropping token in column ${column}...`
//     )

//     const position = board.dropToken(column, getActivePlayer().token)

//     if (!position) return // Column full

//     const hasWon = board.checkWinner(
//       position.row,
//       position.column,
//       getActivePlayer().token
//     )

//     if (hasWon) {
//       winner = getActivePlayer()
//       console.log(`${winner.name} wins!`)
//     } else {
//       switchPlayerTurn()
//       printNewRound()
//     }
//   }

//   printNewRound()

//   return {
//     playRound,
//     getActivePlayer,
//     getWinner,
//     getBoard: board.getBoard,
//   }
// }

// function ScreenController() {
//   const game = GameController()
//   const playerTurnDiv = document.querySelector('.turn')
//   const boardDiv = document.querySelector('.board')

//   const updateScreen = () => {
//     boardDiv.textContent = ''

//     const board = game.getBoard()
//     const activePlayer = game.getActivePlayer()
//     const winner = game.getWinner()

//     playerTurnDiv.textContent = winner
//       ? `${winner.name} wins!`
//       : `${activePlayer.name}'s turn...`

//     board.forEach((row, rowIndex) => {
//       row.forEach((cell, colIndex) => {
//         const cellButton = document.createElement('button')
//         cellButton.classList.add('cell')

//         if (cell.getValue() === 1) {
//           cellButton.classList.add('playerOne')
//         } else if (cell.getValue() === 2) {
//           cellButton.classList.add('playerTwo')
//         }

//         cellButton.dataset.column = colIndex
//         boardDiv.appendChild(cellButton)
//       })
//     })
//   }

//   function clickHandlerBoard(e) {
//     const selectedColumn = e.target.dataset.column
//     if (!selectedColumn) return

//     game.playRound(parseInt(selectedColumn))
//     updateScreen()
//   }

//   boardDiv.addEventListener('click', clickHandlerBoard)
//   updateScreen()
// }

// ScreenController()
