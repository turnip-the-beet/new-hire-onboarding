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

// --- Camera Dead Zone Constants ---
// Player can move within this many pixels from the edge of the screen before camera moves
const DEADZONE_X_PX = canvas.width / 4; // Example: Player moves within the central 50% horizontally
const DEADZONE_Y_PX = canvas.height / 4; // Example: Player moves within the central 50% vertically

// --- Image Assets Variables ---
const images = {}; // Object to hold all our loaded images
let imagesLoadedCount = 0;
const totalImages = 4; // Expecting all 4 images to be uploaded and loading correctly

// --- Game state Variables ---
const player = {
    x: 2, // Player's current x position on the MAP grid (grid coordinates)
    y: 2, // Player's current y position on the MAP grid (grid coordinates)
};

// Camera state: stores the top-left pixel coordinates of the currently visible map area
const camera = {
    x: 0,
    y: 0
};

// Map definition (0: path, 1: wall, 2: interaction point)
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
        triggerTile: { x: 6, y: 5 },
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
        id: 'new_task_3',
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

// **** NEW: updateCamera() for Dead Zone Camera ****
function updateCamera() {
    // Convert player's tile position to pixel position on the overall map
    const playerMapPxX = player.x * TILE_SIZE + (TILE_SIZE / 2); // Center of player tile
    const playerMapPxY = player.y * TILE_SIZE + (TILE_SIZE / 2); // Center of player tile

    // Player's position relative to the current camera view (0,0 is top-left of canvas)
    let playerScreenX = playerMapPxX - camera.x;
    let playerScreenY = playerMapPxY - camera.y;

    // Adjust camera X based on dead zone
    if (playerScreenX < DEADZONE_X_PX) {
        camera.x -= (DEADZONE_X_PX - playerScreenX);
    } else if (playerScreenX > canvas.width - DEADZONE_X_PX) {
        camera.x += (playerScreenX - (canvas.width - DEADZONE_X_PX));
    }

    // Adjust camera Y based on dead zone
    if (playerScreenY < DEADZONE_Y_PX) {
        camera.y -= (DEADZONE_Y_PX - playerScreenY);
    } else if (playerScreenY > canvas.height - DEADZONE_Y_PX) {
        camera.y += (playerScreenY - (canvas.height - DEADZONE_Y_PX));
    }

    // Clamp camera to map boundaries (0 to max map size minus canvas size)
    const mapPixelWidth = gameMap[0].length * TILE_SIZE;
    const mapPixelHeight = gameMap.length * TILE_SIZE;

    const maxCameraX = Math.max(0, mapPixelWidth - canvas.width);
    const maxCameraY = Math.max(0, mapPixelHeight - canvas.height);

    camera.x = Math.max(0, Math.min(camera.x, maxCameraX));
    camera.y = Math.max(0, Math.min(camera.y, maxCameraY));
}


// **** UPDATED: drawMap() - Uses camera offsets ****
function drawMap() {
    // Only draw tiles that are currently visible on the screen
    const startTileX = Math.floor(camera.x / TILE_SIZE);
    const endTileX = Math.ceil((camera.x + canvas.width) / TILE_SIZE);
    const startTileY = Math.floor(camera.y / TILE_SIZE);
    const endTileY = Math.ceil((camera.y + canvas.height) / TILE_SIZE);

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

                if (tileImage && tileImage.complete) {
                    // Draw each tile relative to the camera's position
                    ctx.drawImage(tileImage,
                                  x * TILE_SIZE - camera.x,
                                  y * TILE_SIZE - camera.y,
                                  TILE_SIZE, TILE_SIZE);
                } else {
                    let color = 'pink';
                    if (tileType === 0) color = 'lightgray';
                    else if (tileType === 1) color = 'darkgray';
                    else if (tileType === 2) color = 'gold';
                    ctx.fillStyle = color;
                    ctx.fillRect(x * TILE_SIZE - camera.x, y * TILE_SIZE - camera.y, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }
}

// **** UPDATED: drawPlayer() - Draws relative to camera position ****
function drawPlayer() {
    // Player is drawn at their absolute map position, offset by the camera
    const playerDrawX = player.x * TILE_SIZE - camera.x + (TILE_SIZE - PLAYER_SIZE) / 2;
    const playerDrawY = player.y * TILE_SIZE - camera.y + (TILE_SIZE - PLAYER_SIZE) / 2;

    if (images.player && images.player.complete) {
        ctx.drawImage(images.player, playerDrawX, playerDrawY, PLAYER_SIZE, PLAYER_SIZE);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(playerDrawX, playerDrawY, PLAYER_SIZE, PLAYER_SIZE);
    }
}

// Main game drawing loop (now includes updateCamera)
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera(); // Update camera position before drawing
    drawMap();
    drawPlayer();
}

// isColliding function (should be correct now)
function isColliding(targetX, targetY) {
    // console.log(`isColliding check for target: (${targetX}, ${targetY})`); // Removed for cleaner console

    if (targetX < 0 || targetX >= gameMap[0].length ||
        targetY < 0 || targetY >= gameMap.length) {
        // console.log("isColliding: Target is outside map boundaries."); // Removed for cleaner console
        return true;
    }
    const tileValue = gameMap[targetY][targetX];
    // console.log(`isColliding: Tile at (${targetX}, ${targetY}) has value ${tileValue}.`); // Removed for cleaner console
    return tileValue === 1;
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
    if (!gameStarted) return;

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
