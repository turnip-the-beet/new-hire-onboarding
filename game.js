// --- Core Variables & Initial Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

console.log("Canvas initialized. Width:", canvas.width, "Height:", canvas.height);
console.log("2D drawing context obtained:", ctx);

const infoPanel = document.getElementById('info-panel');
const objectiveList = document.getElementById('objective-list');
const gameMessage = document.getElementById('game-message');
const resetButton = document.getElementById('resetButton');

const TILE_SIZE = 32; // Size of each tile in pixels
const PLAYER_SIZE = TILE_SIZE - 4; // Player slightly smaller than tile

// --- Image Assets Variables ---
const images = {}; // Object to hold all our loaded images
let imagesLoadedCount = 0;
const totalImages = 4; // Expecting all 4 images to be uploaded and loading correctly

// --- Game state Variables ---
const player = {
    x: 1, // Player's current x position on the MAP grid (grid coordinates)
    y: 1, // Player's current y position on the MAP grid (grid coordinates)
};

// Map definition (0: path, 1: wall, 2: interaction point)
const gameMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1], // Task 1 (Chest)
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Define objectives with their grid coordinates and the URL to open
const objectives = [
    {
        id: 'doc_signing',
        description: 'Sign your Onboarding Documents',
        completed: false,
        triggerTile: { x: 6, y: 5 }, // Corresponds to the '2' in gameMap
        link: 'https://example.com/onboarding-documents' // REPLACE with your actual document link
    },
    {
        id: 'training_video_1',
        description: 'Watch the Welcome Training Video',
        completed: false,
        triggerTile: { x: 15, y: 10 }, // Example new task location
        link: 'https://example.com/welcome-video' // REPLACE with your actual video link
    }
    // Add more objectives here
];

let currentMessage = '';
let gameStarted = false; // To prevent interaction before loading


// --- ALL FUNCTION DEFINITIONS GO HERE (BEFORE THEY ARE CALLED) ---

// Image loading function
function loadImage(name, src) {
    const img = new Image();
    img.onload = () => {
        imagesLoadedCount++;
        if (imagesLoadedCount === totalImages) {
            console.log('All required images loaded! Calling loadGame().'); // Added log
            loadGame(); // THIS WILL NOW BE DEFINED
        }
    };
    img.onerror = () => {
        console.error(`Failed to load image: ${src}. Please ensure the file exists and the path is correct (case-sensitive!).`);
    };
    img.src = src;
    images[name] = img;
}

// Drawing functions
function drawMap() {
    console.log(`Player pos: (${player.x}, ${player.y})`);
    // ... camera calculations ...
    console.log(`Camera pos: (${cameraX.toFixed(2)}, ${cameraY.toFixed(2)})`);

    // ... startTileX, endTileX, etc. calculations ...

    for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
            if (y >= 0 && y < gameMap.length && x >= 0 && x < gameMap[0].length) {
                const tileType = gameMap[y][x];
                let tileImage;

                // ... (your existing if/else if for tileType 1, 2, 0) ...
                if (tileType === 1) {
                    tileImage = images.wall;
                } else if (tileType === 2) {
                    tileImage = images.task_icon;
                } else {
                    tileImage = images.floor;
                }

                if (tileImage === images.player) { // **** ADD THIS CHECK ****
                    console.warn(`WARNING: Tile at (<span class="math-inline">\{x\},</span>{y}) is drawing the Player image! This tile should be a map tile.`);
                }

                if (tileImage && tileImage.complete) {
                    ctx.drawImage(tileImage,
                                  x * TILE_SIZE - cameraX,
                                  y * TILE_SIZE - cameraY,
                                  TILE_SIZE, TILE_SIZE);
                } else {
                    // Fallback: draw a colored square if image not loaded
                    let color = 'pink';
                    if (tileType === 0) color = 'lightgray';
                    else if (tileType === 1) color = 'darkgray';
                    else if (tileType === 2) color = 'gold';
                    ctx.fillStyle = color;
                    ctx.fillRect(x * TILE_SIZE - cameraX, y * TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }
}

function drawPlayer() {
    const playerDrawX = (canvas.width / 2); // Center X of canvas
    const playerDrawY = (canvas.height / 2); // Center Y of canvas

    ctx.fillStyle = 'lime'; // A very bright, unmistakable color
    ctx.beginPath(); // Start drawing a shape
    ctx.arc(playerDrawX, playerDrawY, PLAYER_SIZE / 2, 0, Math.PI * 2); // Draw a circle
    ctx.fill(); // Fill the circle with lime
    ctx.closePath(); // End drawing the shape

    // Optional: Draw a border around the circle for more visibility
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}
// Main game drawing loop
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawMap();
    drawPlayer();
}

// Game logic functions
function isColliding(targetX, targetY) {
    if (targetX < 0 || targetX >= gameMap[0].length ||
        targetY < 0 || targetY >= gameMap.length) {
        return true;
    }
    return gameMap[targetY][targetX] === 1;
}

function updateMessage(message) {
    currentMessage = message;
    gameMessage.textContent = currentMessage;
}

function updateObjectivesPanel() {
    objectiveList.innerHTML = '';
    objectives.forEach(obj => {
        const li = document.createElement('li');
        li.textContent = obj.description;
        if (obj.completed) {
            li.classList.add('completed');
        }
        objectiveList.appendChild(li);
    });
}

function checkInteraction() {
    objectives.forEach(obj => {
        if (!obj.completed && player.x === obj.triggerTile.x && player.y === obj.triggerTile.y) {
            updateMessage(`You found "${obj.description}"! Opening link...`);
            setTimeout(() => {
                window.open(obj.link, '_blank');
                obj.completed = true;
                updateObjectivesPanel();
                saveGame();
                checkForGameCompletion();
            }, 500);
        }
    });
}

function checkForGameCompletion() {
    const allCompleted = objectives.every(obj => obj.completed);
    if (allCompleted) {
        updateMessage("Congratulations! You've completed all your onboarding tasks!");
    }
}

function saveGame() {
    const gameState = {
        playerX: player.x,
        playerY: player.y,
        objectives: objectives.map(obj => ({ id: obj.id, completed: obj.completed }))
    };
    localStorage.setItem('onboardingGameSave', JSON.stringify(gameState));
    console.log('Game saved!');
}

function loadGame() {
    const savedState = localStorage.getItem('onboardingGameSave');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        player.x = gameState.playerX;
        player.y = gameState.playerY;

        gameState.objectives.forEach(savedObj => {
            const correspondingObj = objectives.find(obj => obj.id === savedObj.id);
            if (correspondingObj) {
                correspondingObj.completed = savedObj.completed;
            }
        });
        updateMessage('Game loaded! Continue your adventure.');
        console.log('Game loaded!');
    } else {
        updateMessage('Welcome, new adventurer! Begin your onboarding journey.');
        console.log('No saved game found, starting new.');
    }
    gameStarted = true;
    updateObjectivesPanel();
    drawGame(); // Initial draw after loading
}


// --- Event Listeners (Must be after functions they call) ---

// --- Event Listeners (Must be after functions they call) ---
console.log("Attempting to add keydown listener..."); // **** ADD THIS LINE ****

document.addEventListener('keydown', (e) => {
    // ... (rest of your keydown event listener code)
});

document.addEventListener('keydown', (e) => {
    console.log("Key pressed:", e.key); // Log every key press
    if (!gameStarted) {
        console.log("Game not started yet, ignoring key press.");
        return;
    }

    let newX = player.x;
    let newY = player.y;

    switch (e.key) {
        case 'ArrowUp':
            newY--;
            break;
        case 'ArrowDown':
            newY++;
            break;
        case 'ArrowLeft':
            newX--;
            break;
        case 'ArrowRight':
            newX++;
            break;
        default: // If other keys are pressed
            console.log("Non-arrow key pressed, ignoring.");
            return;
    }

    console.log("Attempting to move from (" + player.x + "," + player.y + ") to (" + newX + "," + newY + ")"); // Log attempted move

    if (!isColliding(newX, newY)) {
        player.x = newX; // Update player's data position
        player.y = newY; // Update player's data position
        updateMessage('Moving...');
        console.log("Player successfully moved to (" + player.x + "," + player.y + ")."); // Confirm data update
        drawGame(); // THIS SHOULD REDRAW THE GAME
        console.log("drawGame() called after move."); // Confirm drawGame was reached
        checkInteraction();
    } else {
        updateMessage("Can't go that way! It's a wall.");
        console.log("Collision detected. Player did NOT move."); // Confirm collision detection
    }
});

// --- Initial Calls to Start the Game (Must be after everything is defined) ---

// This function call starts the image loading process.
// Once all images are loaded (via their onload callbacks), loadGame() will be called,
// which then initiates the first draw of the game.
loadImage('floor', 'dungeon_floor_tile.png');
loadImage('wall', 'fences.png');
loadImage('player', 'Player.png');
loadImage('task_icon', 'Chest.png');
