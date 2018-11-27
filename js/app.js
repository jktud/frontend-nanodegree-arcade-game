//////////////////////////////////////////////////////////
// Consants class
///////////////////////////////////////////////////////////

// constants used for game play
class Constants {
    constructor() {
        // constants
        this.ROWS = 6;          // number of rows in game
        this.COLS = 5;          // number of columns in game
        this.ROW_HEIGHT = 83;   // height of a single row
        this.COL_WIDTH = 101;   // width of a single column
        this.ENEMIES = 3;       // number of enemy bugs
        this.PLAYER_ROW = 5;    // player starting row
        this.PLAYER_COL = 2;    // player starting column
        this.ENEMY_ROW = 1;     // enemy starting row
        this.ENEMY_COL = -1;    // enemy starting column
    }
}

var constants = new Constants();

//////////////////////////////////////////////////////////
// Common base class for player and enemies
///////////////////////////////////////////////////////////
class Entity {
    constructor(sprite) {
        this.sprite = sprite;
        this.row = 0;
        this.col = 0;
    }

    render() {
        const x = this.col * constants.COL_WIDTH;
        const y = this.row * constants.ROW_HEIGHT - constants.ROW_HEIGHT/4;
        ctx.drawImage(Resources.get(this.sprite), x, y);
    };
}

///////////////////////////////////////////////////////////
// Enemy class -- bugs that our player must avoid
///////////////////////////////////////////////////////////
class Enemy extends Entity {

    constructor() {
        super('images/enemy-bug.png');
        this.increment = 0.1;
    }

    // reset an enemy's position and speed
    reset() {
        // enemy goes on a random row from 1-3
        this.row = Math.floor( Math.random() * 3 + 1 );

        // enemy starts offscreen left
        this.col = -1;

        // enemy speed is a random value
        this.increment = Math.random() * 3.0 + 1.5;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.col += this.increment * dt;

        // if enemy went offscreen right, reset it to offscreen left
        if (this.col > constants.COLS) {
            this.reset();
        }
    }

    // return true if this enemy is at least
    // partially covering this square
    occupiesSquare(icol, irow) {
        // compute row and column of this enemy's head and tail
        // make the enemy be 1/3 of the way into a column before
        // a collision is detected there
        var enemyRow = this.row;
        var enemyTailCol = Math.floor(this.col + 0.33333333);
        var enemyHeadCol = Math.floor(this.col + 0.66666666);

        // see if input row and column are the same as this enemy's
        return (irow == enemyRow &&
               (icol == enemyHeadCol || icol == enemyTailCol) );
    }
}

///////////////////////////////////////////////////////////
// Player class -- the hero of our story
///////////////////////////////////////////////////////////
class Player extends Entity {

    constructor() {
        super('images/char-boy.png');
    }

    // reset the player
    reset() {
        this.sendHome();
    }

    // put the player back in starting position
    sendHome() {
        this.row = constants.PLAYER_ROW;
        this.col = constants.PLAYER_COL;
    }

    // Update the player's position
    update(dt) {
        // if player reached the water, reset him to home
        if (this.row <= 0) {
            this.sendHome();
        }
    }

    handleInput(keyCode) {
        switch(keyCode) {
            // pause and invoke the JS debugger
            case 'escape': {
                //debugger;
                break;
            }

            // move player one square left
            case 'left': {
                this.col--;
                if (this.col < 0) {
                    this.col = 0;
                }
                break;
            }
            // move player one square right
            case 'right': {
                this.col++;
                if (this.col > constants.COLS - 1) {
                    this.col = constants.COLS - 1;
                }
                break;
            }
            // move player one square up
            case 'up': {
                this.row--;
                if (this.row <= 0) {
                    this.row = 0;
                }
                break;
            }
            // move player one square down
            case 'down': {
                this.row++;
                if (this.row > constants.ROWS - 1) {
                    this.row = constants.ROWS - 1;
                }
                break;
            }
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// create enemies
var allEnemies = [];
for (let i=0; i < constants.ENEMIES; i++) {
    allEnemies[i] = new Enemy();
}

// create player
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

