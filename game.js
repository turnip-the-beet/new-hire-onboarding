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

// --- Image Assets ---
const images = {}; // Object to hold all our loaded images
let imagesLoadedCount = 0;
const totalImages = 4; // Expecting all 4 images to be uploaded and loading correctly

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


// --- ALL FUNCTION DEFINITIONS (Moved to Top) ---

function drawMap() {
    let cameraX = player.x * TILE_SIZE - canvas.width / 2 + PLAYER_SIZE / 2;
    let cameraY = player.y * TILE_SIZE - canvas.height / 2 + PLAYER_SIZE / 2;

    const maxCameraX = gameMap[0].length * TILE_SIZE - canvas.width;
    const maxCameraY = gameMap.length * TILE_SIZE - canvas.height;

    cameraX = Math.max(0, Math.min(cameraX, maxCameraX));
    cameraY = Math.max(0, Math.min(cameraY, maxCameraY));

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
                    ctx.fillRect(x * TILE_SIZE - cameraX, y * TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }
}

function drawPlayer() {
    const playerDrawX = (canvas.width / 2) - (PLAYER_SIZE / 2);
    const playerDrawY = (canvas.height / 2) - (PLAYER_SIZE / 2);

    if (images.player && images.player.complete) {
        ctx.drawImage(images.player, playerDrawX, playerDrawY, PLAYER_SIZE, PLAYER_SIZE);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(playerDrawX, playerDrawY, PLAYER_SIZE, PLAYER_SIZE);
    }
}

// Main game drawing loop
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
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
    drawGame(); // Initial draw after loading
}


// --- Event Listeners ---

document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

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
        updateMessage('Moving...');
        drawGame(); // Redraw game after player moves
        checkInteraction(); // Check for interaction at new position
    } else {
        updateMessage("Can't go that way! It's a wall.");
    }
});

resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all game progress?')) {
        localStorage.removeItem('onboardingGameSave');
        location.reload();
    }
});


// --- Initial calls to start the game ---

// This function call starts the image loading process.
// Once all images are loaded (via their onload callbacks), loadGame() will be called,
// which then initiates the first draw of the game.
loadImage('floor', 'dungeon_floor_tile.png'); // Re-initiate image loading now that functions are defined
loadImage('wall', 'fences.png');
loadImage('player', 'Player.png');
loadImage('task_icon', 'Chest.png');
