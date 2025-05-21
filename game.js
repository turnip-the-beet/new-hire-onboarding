// Get the canvas and its 2D drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// **** CRITICAL TEST: Fill the entire canvas with a solid color immediately ****
if (ctx) {
    ctx.fillStyle = 'blue'; // Let's try blue this time
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas
    console.log("Canvas drawing test: Attempted to draw a big blue square.");
    console.log("Canvas width:", canvas.width, "height:", canvas.height);
    console.log("Canvas context:", ctx);
} else {
    console.error("Failed to get 2D rendering context from canvas! 'ctx' is null or undefined.");
}

// You won't see anything else from the game yet, as we're just testing the canvas.
// The rest of the game logic will go below this.
// For now, these are just placeholders to avoid errors:
const infoPanel = document.getElementById('info-panel');
const objectiveList = document.getElementById('objective-list');
const gameMessage = document.getElementById('game-message');
const resetButton = document.getElementById('resetButton');

// Placeholder functions to avoid errors while we build step-by-step
function loadGame() { console.log('loadGame placeholder'); }
function drawGame() { console.log('drawGame placeholder'); }
function updateObjectivesPanel() { console.log('updateObjectivesPanel placeholder'); }

// Dummy call to loadGame to match our previous structure later
// but for this test, we just want the initial blue square.
// We'll call this after image loading later, but not now.
// For now, let's ensure the initial blue square is shown before any image loading attempts.
// (No actual image loading in this test version of game.js yet)
