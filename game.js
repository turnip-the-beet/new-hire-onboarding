// --- Core Variables & Initial Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Console logs for initial setup confirmation
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
// **** NEW: Much larger map to allow for scrolling (40x40 tiles) ****
const gameMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], // Task 1
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Define objectives with their grid coordinates and the URL to open
const objectives = [
    {
        id: 'doc_signing',
        description: 'Sign your Onboarding Documents',
        completed: false,
        triggerTile: { x: 6, y: 5 }, // Corresponds to the '2' in gameMap
        link: 'https://example.com/onboarding-documents'
    },
    {
        id: 'training_video_1',
        description: 'Watch the Welcome Training Video',
        completed: false,
        triggerTile: { x: 15, y: 10 },
        link: 'https://example.com/welcome-video'
    },
    {
        id: 'new_task_3', // Added a new task for the larger map
        description: 'Complete the Security Training',
        completed: false,
        triggerTile: { x: 30, y: 20 },
        link: 'https://example.com/security-training'
    }
];

let currentMessage = '';
let gameStarted = false;


// --- ALL FUNCTION DEFINITIONS ---

function loadImage(name, src) {
    const img = new Image();
    img.onload = () => {
        imagesLoadedCount++;
        if (imagesLoadedCount === totalImages) {
            console.log('All required images loaded! Calling loadGame().');
            loadGame();
        }
    };
    img.onerror = () => {
        console.error(`Failed to load image: ${src}. Please ensure the file exists and the path is correct (case-sensitive!).`);
    };
    img.src = src;
    images[name] = img;
}

function drawMap() {
    let cameraX = player.x * TILE_SIZE - canvas.width / 2 + PLAYER_SIZE / 2;
    let cameraY = player.y * TILE_SIZE - canvas.height / 2 + PLAYER_SIZE / 2;

    const maxCameraX = gameMap[0].length * TILE_SIZE - canvas.width;
    const maxCameraY = gameMap.length * TILE_SIZE - canvas.height;

    cameraX = Math.max(0, Math.min(cameraX, maxCameraX));
    cameraY = Math.max(0, Math.min(cameraY, maxCameraY));

    // Console logs for camera debugging (remove when satisfied)
    // console.log(`Player pos: (${player.x}, ${player.y})`);
    // console.log(`Camera pos: (${cameraX.toFixed(2)}, ${cameraY.toFixed(2)})`);

    const startTileX = Math.floor(cameraX / TILE_SIZE);
    const endTileX = Math.ceil((cameraX + canvas.width) / TILE_SIZE);
    const startTileY = Math.floor(cameraY / TILE_SIZE);
    const endTileY = Math.ceil((cameraY + canvas.height) / TILE_SIZE);

    for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
            if (y >= 0 && y < gameMap.length && x >= 0 && x < gameMap[0].length) {
                const tileType = gameMap[y][x];
                let tileImage;

                if (tileType === 1) {
                    tileImage = images.wall;
                } else if (tileType === 2) {
                    tileImage = images.task_icon;
                } else {
                    tileImage = images.floor;
                }

                // Debug: Check if any map tile is trying to draw the Player image
                // if (tileImage === images.player) {
                //     console.warn(`WARNING: Tile at (${x},${y}) is drawing the Player image! This tile should be a map tile.`);
                // }

                if (tileImage && tileImage.complete) {
                    ctx.drawImage(tileImage,
                                  x * TILE_SIZE - cameraX,
                                  y * TILE_SIZE - cameraY,
                                  TILE_SIZE, TILE_SIZE);
                } else {
                    let color = 'pink';
                    if (tileType === 0) color = 'lightgray';
                    else if (tileType === 1) color = 'darkgray';
                    else if (tileType === 2) color = 'gold';
                    ctx.fillStyle = color;
                    ctx.fillRect(x * TILE_SIZE - cameraX, y * Tile_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }
}

function drawPlayer() {
    const playerDrawX = (canvas.width / 2) - (PLAYER_SIZE / 2);
    const playerDrawY = (canvas.height / 2) - (PLAYER_SIZE / 2);

    // This is the actual player being drawn in the center of the screen
    if (images.player && images.player.complete) {
        ctx.drawImage(images.player, playerDrawX, playerDrawY, PLAYER_SIZE, PLAYER_SIZE);
    } else {
        ctx.fillStyle = 'red'; // Fallback to red square if player image not loaded
        ctx.fillRect(playerDrawX, playerDrawY, PLAYER_SIZE, PLAYER_SIZE);
    }

    // Debug: Draw a distinct shape for the player if there's still confusion (optional)
    // ctx.fillStyle = 'lime'; // A very bright, unmistakable color
    // ctx.beginPath();
    // ctx.arc(playerDrawX + PLAYER_SIZE / 2, playerDrawY + PLAYER_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.strokeStyle = 'black';
    // ctx.lineWidth = 2;
    // ctx.stroke();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPlayer();
}

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
    drawGame();
}


// --- Event Listeners ---

document.addEventListener('keydown', (e) => {
    // console.log("Key pressed:", e.key); // Removed for cleaner console
    if (!gameStarted) {
        // console.log("Game not started yet, ignoring key press."); // Removed for cleaner console
        return;
    }

    let newX = player.x;
    let newY = player.y;

    switch (e.key) {
        case 'ArrowUp':
            newY--;
            e.preventDefault();
            break;
        case 'ArrowDown':
            newY++;
            e.preventDefault();
            break;
        case 'ArrowLeft':
            newX--;
            e.preventDefault();
            break;
        case 'ArrowRight':
            newX++;
            e.preventDefault();
            break;
        default:
            // console.log("Non-arrow key pressed, ignoring."); // Removed for cleaner console
            return;
    }

    // console.log("Attempting to move from (" + player.x + "," + player.y + ") to (" + newX + "," + newY + ")"); // Removed for cleaner console

    if (!isColliding(newX, newY)) {
        player.x = newX;
        player.y = newY;
        updateMessage('Moving...');
        // console.log("Player successfully moved to (" + player.x + "," + player.y + ")."); // Removed for cleaner console
        drawGame();
        // console.log("drawGame() called after move."); // Removed for cleaner console
        checkInteraction();
    } else {
        updateMessage("Can't go that way! It's a wall.");
        // console.log("Collision detected. Player did NOT move."); // Removed for cleaner console
    }
});

resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all game progress?')) {
        localStorage.removeItem('onboardingGameSave');
        location.reload();
    }
});


// --- Initial Calls to Start the Game ---
loadImage('floor', 'dungeon_floor_tile.png');
loadImage('wall', 'fences.png');
loadImage('player', 'Player.png');
loadImage('task_icon', 'Chest.png');
