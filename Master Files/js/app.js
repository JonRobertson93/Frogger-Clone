// Global variable declarations:
let currentScore = 0;
let currentDeaths = 0;
let rockYMax = 0;
let rockYMin = 0;
let rockXMax = 0;
let rockXMin = 0;
let resetBtn = document.getElementById('reset');

resetBtn.addEventListener('click', resetBoard);

// Sets speed once for each enemy. Random 1-3 speed.
function speed() {
    let speed = (Math.random() + .5) * 3;
    return speed;
};

// Generates random x-coordinate
function randomX() {
    let x = Math.random() * 300;
    if (x < 10) {
        x += 10;
    }
    return x;
};

function Enemy(x,y,speed) { // Variables applied to each of our enemy instances go here:
    this.sprite = 'images/enemy-bug.png';   // enemy image
    this.x = x;                            // initial x position for enemy - Random
    this.y = y;                            // initial y position for enemy - STAYS FIXED.
    this.speed = speed;
};

// Update the enemy's position, required method for game... Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = (this.x + this.speed);
    if (this.x > 505){    // Once enemy reaches end of screen, moves back to start of screen
        this.x = 0;
    }
     // Collision Check - reset enemies, rock & player
    if (Math.abs(this.y - player.y) < 40 && Math.abs(this.x - player.x) < 40) {
    	resetEnemies();
        player.reset();
        rock.reset();
        updateDeaths();
    }
};

Enemy.prototype.render = function() {       // Draw the enemy on the screen, required method for game
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class. This class requires an update(), render() and a handleInput() method.
function Player(x, y) {
    this.sprite = 'images/char-princess-girl.png';
    this.x = 202;
    this.y = 380;
};

// If reached water, update score and send player back to start. Need to also reset rock and enemies (resetBoard() function)
Player.prototype.update = function(dt) {
    if (this.y <= -10) {
        player.reset();
        resetEnemies();
        rock.reset();
        updateScore();
        console.log(this.y);
    }
};

Player.prototype.render = function() {       // Draw the player on the screen, required method for game
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
    // back to starting point
    this.x = 202;
    this.y = 400;        
};

// Instancing all characters (enemies, player, obstacles)
let enemy1 = new Enemy(randomX(), 60, speed());
let enemy2 = new Enemy(randomX(), 145, speed());
let enemy3 = new Enemy(randomX(), 230, speed());
let enemy4 = new Enemy(randomX(), 60, speed());
let allEnemies = [enemy1, enemy2, enemy3, enemy4];

function resetEnemies() {
	for (enemy of allEnemies){
		enemy.x = randomX();
		enemy.speed = speed();
	}
}

let player = new Player;

let rock = new Rock(randomRock(), 290);
let allRocks = [rock];

// Draw the rock on the screen
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//reset the rock position and coordinates for obstacle checking
Rock.prototype.reset = function() {
	this.x = randomRock();
	rockXMax = x + 57;
    rockXMin = x - 63;
}

// This listens for key presses and sends the keys to your Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

Player.prototype.handleInput = function(allowedKeys) {
    // SET X AND Y BASED ON KEYBOARD CLICKS
    switch(allowedKeys) {
    case 'left':
        if (this.x < -8) {  // Prevents moving off left-side of screen
            this.x = -12;
        } 
        // Checks if running into the square with the rock obstacle
        else if (Math.abs(this.x - rockXMax) < 10 && (this.y > rockYMin && this.y < rockYMax)) {
            this.x = this.x;
        } else {
            this.x -= 20;   // Regular left movement, 20 units
        }
        break;
    case 'right':
        if (this.x > 416) {  // Prevents moving off the right of the screen
            this.x = 425;
        } 
        // Checks if running into the square with the rock obstacle
        else if (Math.abs(this.x - rockXMin) < 10 && (this.y > rockYMin && this.y < rockYMax)) {
            this.x = this.x;
        } else {
            this.x += 20;   // Regular right movement, 20 units
        }
        break;
    case 'up':
        // Checks if running into the square with the rock obstacle
        if ((this.y - rockYMax < 10 && this.y >= rockYMax) && (this.x >= rockXMin && this.x <= rockXMax)){
            this.y = this.y;
        } else {
        this.y -= 20;   // Regular upward movement, 20 units
        }
        break;
    case 'down':
        if (this.y > 436) {  // Prevents moving off bottom of screen
            this.y = 445;
        } 
        // Checks if running into the square with the rock obstacle
        else if ((Math.abs(this.y - rockYMin) < 10) && (this.x >= rockXMin && this.x <= rockXMax)) {
            this.y = this.y;
        } else {
            this.y += 20;   // Regular downward movement, 20 units
        }
        break;
    }
};

//ADD STONES
function Rock(x,y) {
    this.sprite = 'images/Rock.png';
    this.x = x;       // Random
    this.y = y;       // Fixed
    rockYMax = y + 30;
    rockYMin = y - 130;
    rockXMax = x + 57;
    rockXMin = x - 63;
};

function randomRock() {
    // Generates 5 random numbers. Assign number to an x-position for rock to be in.
    let position = Math.floor(Math.random() * 5);
    if (position === 0) {
        x = 4;
    } else if (position === 1) {
        x = 104;
    } else if (position === 2) {
        x = 205;
    } else if (position === 3) {
        x = 308;
    } else {
        x = 410;
    }
    return x;
};

function resetBoard() {
	resetEnemies();
    player.reset();
    rock.reset();
    currentScore = 0;
    currentDeaths = 0;
    document.querySelector('#score').innerHTML = "Score: " + currentScore;
    document.querySelector('#deaths').innerHTML = "Deaths: " + currentDeaths;
};

function updateScore() {
    currentScore += 1;
    document.querySelector('#score').innerHTML = "Score: " + currentScore;
};

function updateDeaths() {
    currentDeaths += 1;
    document.querySelector('#deaths').innerHTML = "Deaths: " + currentDeaths;
};
