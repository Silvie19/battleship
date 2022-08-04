const view = {
  displayMassege: function (message) {
    const messageAreaElement = document.getElementById('messageArea');
    messageAreaElement.innerHTML = message;
  },

  displayMiss: function (location) {
    const cell = document.getElementById(location);
    cell.setAttribute('class', 'miss');
  },

  displayHit: function (location) {
    const cell = document.getElementById(location);
    cell.setAttribute('class', 'hit');
  },
};

const model = {
  boardSize: 7,
  numShips: 3,
  shipLenght: 3,
  shipsShunks: 0,
  ships: [
    { locations: [0, 0, 0], hits: ['', '', ''] },
    { locations: [0, 0, 0], hits: ['', '', ''] },
    { locations: [0, 0, 0], hits: ['', '', ''] },
  ],

  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      const ship = this.ships[i];
      const index = ship.locations.indexOf(guess);

      if (index >= 0) {
        ship.hits[index] = 'hit';
        view.displayHit(guess);
        view.displayMassege('HIT!!!');

        if (this.isSunk(ship)) {
          this.shipsShunks++;
          view.displayMassege('You suck my battleship!!!');
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMassege('YOU MISS!!!');
    return false;
  },

  isSunk: function (ship) {
    for (let i = 0; i < this.shipLenght; i++) {
      if (ship.hits[i] !== 'hit') {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function () {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));

      this.ships[i].locations = locations;
    }
  },

  generateShip: function () {
    const direction = Math.floor(Math.random() * 2);
    let row, col;
    let newShipLocation = [];

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
      col = Math.floor(Math.random() * this.boardSize);
    }

    for (let i = 0; i < this.shipLenght; i++) {
      if (direction === 1) {
        newShipLocation.push(`${row}${col + i}`);
      } else {
        newShipLocation.push(`${row + i}${col}`);
      }
    }

    return newShipLocation;
  },

  collision: function (location) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      for (let j = 0; j < this.shipLenght; j++) {
        if (ship.locations.indexOf(location[j]) >= 0) {
          return true;
        }
      }
    }

    return false;
  },
};

const controller = {
  guesses: 0,
  processGuess: function (guess) {
    const location = parseGuess(guess);

    if (location) {
      this.guesses++;
      model.fire(location);
      if (model.shipsShunks === model.numShips) {
        view.displayMessage('You sank all my battleships, in ' + this.guesses + ' guesses');
      }
    }
  },
};

function parseGuess(guess) {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (guess === null || guess.length !== 2) {
    alert('Oops, please enter a letter and a number on the board."');
  } else {
    const row = alphabet.indexOf(guess[0].toUpperCase());
    const col = guess[1];

    if (isNaN(row) || isNaN(col)) {
      alert(`Oops, that isn't on the board.`);
    } else if (row < 0 || row >= model.boardSize || col < 0 || col >= model.boardSize) {
      alert(`Oops, that isn't on the board.`);
    } else {
      return `${row}${col}`;
    }
  }
  return null;
}

function init() {
  const fireButton = document.getElementById('fireButton');
  fireButton.onclick = handleFireButton;

  const guessInput = document.getElementById('guessInput');
  guessInput.onkeypress = handleGuessInput;

  model.generateShipLocations();
}

function handleFireButton() {
  const guessInput = document.getElementById('guessInput');
  const guess = guessInput.value;

  controller.processGuess(guess);

  guessInput.value = '';
}

function handleGuessInput(e) {
  const fireButton = document.getElementById('fireButton');
  if (e.keyCode == 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;
