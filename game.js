// Remove the console.log for the initial blue square test
// The game logic below will take over drawing.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Console logs to confirm canvas and context are ready, but not drawing a test square
console.log("Canvas initialized. Width:", canvas.width, "Height:", canvas.height);
console.log("2D drawing context obtained:", ctx);


const infoPanel = document.getElementById('info-panel');
const objectiveList = document.getElementById('objective-list');
const gameMessage = document.getElementById('game-message');
const resetButton = document.getElementById('resetButton'); // Get the reset button element

const TILE_SIZE = 32; // Size of each tile in pixels
const PLAYER_SIZE = TILE_SIZE - 4; // Player slightly smaller than tile

// --- Image Assets ---
const images = {}; // Object to hold all our loaded images
let imagesLoadedCount = 0;
const totalImages = 4; // Now expecting all 4 images to be uploaded and loading correctly

function loadImage(name, src) {
    const img = new Image();
    img.onload = () => {
        imagesLoadedCount++;
        if (imagesLoadedCount === totalImages) {
            console.log('All required images loaded!');
            loadGame(); // Start the game after all assets are ready
        }
    };
    img.onerror = () => {
        console.error(`Failed to load image: ${src}. Please ensure the file exists and the path is correct (case-sensitive!).`);
        // Note: onerror does NOT increment imagesLoadedCount, so if an image is missing,
        // the game might not start unless totalImages is adjusted or error is handled differently.
    };
    img.src = src;
    images[name] = img;
}

// Load all your specified images (confirming these are the exact names in your repo root)
loadImage('floor', 'dungeon_floor_tile.png');
loadImage('wall', 'fences.png');
loadImage('player', 'Player.png');
loadImage('task_icon', 'Chest.png');


// --- Game state ---
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

// --- Drawing Functions ---

function drawMap() {
    // Calculate the camera's top-left corner based on player position
    // We want the player to be roughly in the center of the canvas.
    let cameraX = player.x * TILE_SIZE - canvas.width / 2 + PLAYER_SIZE / 2;
    let cameraY = player.y * TILE_SIZE - canvas.height / 2 + PLAYER_SIZE / 2;

    // Clamp camera to map boundaries to prevent seeing outside the map
    const maxCameraX = gameMap[0].length * TILE_SIZE - canvas.width;
    const maxCameraY = gameMap.length * TILE_SIZE - canvas.height;

    cameraX = Math.max(0, Math.min(cameraX, maxCameraX));
    cameraY = Math.max(0, Math.min(cameraY, maxCameraY));

    // Determine which tiles are visible on the screen based on camera position
    const startTileX = Math.floor(cameraX / TILE_SIZE);
    const endTileX = Math.ceil((cameraX + canvas.width) / TILE_SIZE);
    const startTileY = Math.floor(cameraY / TILE_SIZE);
    const endTileY = Math.ceil((cameraY + canvas.height) / TILE_SIZE);

    for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
            // Ensure we don't try to draw tiles outside the actual map data
            if (y >= 0 && y < gameMap.length && x >= 0 && x < gameMap[0].length) {
                const tileType = gameMap[y][x];
                let tileImage;

                if (tileType === 1) {
                    tileImage = images.wall;
                } else if (tileType === 2) {
                    tileImage = images.task_icon;
                } else { // tileType === 0 or any other undefined type
                    tileImage = images.floor;
                }

                // Draw the image at its calculated position relative to the camera
                if (tileImage && tileImage.complete) {
                    ctx.drawImage(tileImage,
                                  x * TILE_SIZE - cameraX, // Adjust x position by camera offset
                                  y * TILE_SIZE - cameraY, // Adjust y position by camera offset
                                  TILE_SIZE, TILE_SIZE);
                } else {
                    // Fallback: draw a colored square if image not loaded (for debugging)
                    let color = 'pink'; // Error color if image not found
                    if (tileType === 0) color = 'lightgray'; // Fallback floor
                    else if (tileType === 1) color = 'darkgray'; // Fallback wall
                    else if (tileType === 2) color = 'gold'; // Fallback objective
                    ctx.fillStyle = color;
                    ctx.fillRect(x * TILE_SIZE - cameraX, y * TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }
}

function drawPlayer() {
    // Player is always drawn in the center of the canvas
    const playerDrawX = (canvas.width / 2) - (PLAYER_SIZE / 2);
    const playerDrawY = (canvas.height / 2) - (PLAYER_SIZE / 2);

    if (images.player && images.player.complete) {
        ctx.drawImage(images.player, playerDrawX, playerDrawY, PLAYER_SIZE, PLAYER_SIZE);
    } else {
        // Fallback: draw a colored square if player image not loaded
        ctx.fillStyle = 'red';
        ctx.fillRect(playerDrawX, playerDrawY, PLAYER_SIZE, PLAYER_SIZE);
    }
}

// --- Game Logic ---

function isColliding(targetX, targetY) {
    // Check map boundaries
    if (targetX < 0 || targetX >= gameMap[0].length ||
        targetY < 0 || targetY >= gameMap.length) {
        return true; // Colliding with map edge
    }
    // Check if the target tile is a wall (type 1)
    return gameMap[targetY][targetX] === 1;
}

function updateMessage(message) {
    currentMessage = message;
    gameMessage.textContent = currentMessage;
}

function updateObjectivesPanel() {
    objectiveList.innerHTML = ''; // Clear existing list
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
            setTimeout(() => { // Small delay for message to show
                window.open(obj.link, '_blank'); // Open link in new tab
                obj.completed = true;
                updateObjectivesPanel();
                saveGame(); // Save progress after completing
                checkForGameCompletion();
            }, 500);
        }
    });
}

function checkForGameCompletion() {
    const allCompleted = objectives.every(obj => obj.completed);
    if (allCompleted) {
        updateMessage("Congratulations! You've completed all your onboarding tasks!");
        // You could add a 'game over' screen or more celebrations here
    }
}

// --- Input Handling ---

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return; // Prevent movement before game state is loaded

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
    }

    if (!isColliding(newX, newY)) {
        player.x = newX;
        player.y = newY;
        updateMessage('Moving...'); // Reset message on movement
        drawGame(); // Redraw game after player moves
        checkInteraction(); // Check for interaction at new position
    } else {
        updateMessage("Can't go that way! It's a wall.");
    }
});

// --- Save/Load Game ---

function saveGame() {
    const gameState = {
        playerX: player.x,
        playerY: player.y,
        objectives: objectives.map(obj => ({ id: obj.id, completed: obj.completed })) // Save only necessary parts
    };
    localStorage.setItem('onboardingGameSave', JSON.stringify(gameState));
    console.log('Game saved!');
}

function loadGame() {
    const savedState = localStorage.getItem('onboardingGameSave');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        player.x = gameState.playerX;
        player.y = gameState.playerY; // Corrected typo here (was gameState.y)

        // Update objectives based on loaded state
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
    gameStarted = true; // Allow interaction after loading
    updateObjectivesPanel();
    drawGame(); // Initial draw after loading
}

// --- Reset Logic ---
resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all game progress?')) {
        localStorage.removeItem('onboardingGameSave'); // Deletes the saved data
        location.reload(); // Reloads the page, starting fresh
    }
});

// Initial call to load image assets, which then triggers loadGame
// This is done automatically when the script loads.
