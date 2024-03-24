//Turning game into a Class

class Game {
  constructor(height, width, playerOne, playerTwo) {
    this.height = height;
    this.width = width;
    this.board = [];
    this.active = true;
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.currPlayer = 1;
    this.handleClick = this.handleClick.bind(this);
    this.handleClickNewGame = this.handleClickNewGame.bind(this);
    this.makeBoard();
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById("board");
    const gameItems = document.querySelector(".game_functions");
    //Insert start game buttons
    const startButton = document.createElement("button");
    startButton.setAttribute("type", "button");
    startButton.innerHTML = "Start New Game";
    gameItems.appendChild(startButton);
    startButton.addEventListener("click", this.handleClickNewGame);

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
    this.playerNameDisplay();
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    
    const currPlayer = this.currPlayer;
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${currPlayer}`);
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    if(this.active){
    if (this.currPlayer === 1) {
      piece.style.backgroundColor = this.playerOne.color;
    } else {
      piece.style.backgroundColor = this.playerTwo.color;
    }
  }
    spot.append(piece);
  }

  endGame(msg) {
    this.active = false;
    alert(msg);
  }

  playerNameDisplay() {
    const gameItems = document.querySelector(".game_functions");
    if (this.playerOne && this.playerTwo) {
      const playerList = [this.playerOne, this.playerTwo];
      playerList.forEach((item) => {
        const newTextBox = document.createElement("input");
        newTextBox.setAttribute("type", "text");
        newTextBox.setAttribute("readonly", true);
        newTextBox.value = item.name;
        gameItems.appendChild(newTextBox);
      });
    }
  }

  handleClickNewGame() {
    const gameItems = document.querySelector(".game_functions");
    const board = document.getElementById("board");
    board.innerHTML = "";
    gameItems.innerHTML = "";
    this.board = [];
    this.currPlayer = 1;
    this.active = true;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    if(this.active = true){
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    if(this.active){
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    }
    // check for win
    if (this.checkForWin()) {
      this.active = false;
      if(this.currPlayer === 1){
        console.log(this.active)
      return this.endGame(`${this.playerOne.name} won!`);
      } else if(this.currPlayer === 2){
        return this.endGame(`${this.playerTwo.name} won!`);
      }else {
        return this.endGame(`Player ${this.currPlayer} won!`);
      }
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }
}

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          this.active = false;
          return true;
        }
      }
    }
    return false;
  }
}

class Player {
  constructor(color, name) {
    this.color = color;
    this.name = name;
  }

  setPieceColor(color) {}
}

const robyn = new Player("pink", "Robyn");
const jhanei = new Player("green", "Jhanei");
const playGame = new Game(6, 7, robyn, jhanei);
playGame.makeHtmlBoard();
