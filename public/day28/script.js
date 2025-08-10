let score = 0; // Initialize score

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const gameOverText = document.getElementById('game-over');

// Game constants
const tilewidth = 50;
const tileheight = 43;
const columns = 11;
const rows = 12;
const rowoffset = 0;
const bubblecolors = 5;
const level = {
    x: 100,
    y: 50,
    width: columns * tilewidth,
    height: rows * tileheight,
    columns: columns,
    rows: rows,
    radius: tilewidth / 2,
    tiles: []
};

// Game state
const gamestates = { ready: 0, shootbubble: 1, gameover: 2 };
let gamestate = gamestates.ready;
let turncounter = 0;
const turnsafternewrow = 4;

// Player and bubble
const player = { x: level.x + level.width / 2 - tilewidth / 2, y: level.y + level.height - tileheight, angle: 90 };
let bubble = {};
let nextbubble = {};

// Initialize tiles
function initTiles() {
    level.tiles = [];
    for (let i = 0; i < columns; i++) {
        level.tiles[i] = [];
        for (let j = 0; j < rows; j++) {
            level.tiles[i][j] = { type: -1, processed: false, removed: false, x: i, y: j };
            if (j < 5) {
                level.tiles[i][j].type = randRange(0, bubblecolors - 1);
            }
        }
    }
}

// Get tile coordinates
function getTileCoordinate(column, row) {
    let tilex = column * tilewidth;
    if ((row + rowoffset) % 2) {
        tilex += tilewidth / 2;
    }
    let tiley = row * tileheight;
    return { tilex: tilex + level.x, tiley: tiley + level.y };
}

// Draw a tile (bubble)
function drawTile(x, y, type) {
    if (type < 0) return;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    context.beginPath();
    context.arc(x + tilewidth / 2, y + tileheight / 2, level.radius - 2, 0, 2 * Math.PI);
    context.fillStyle = colors[type % bubblecolors];
    context.fill();
    context.strokeStyle = '#000';
    context.stroke();
}

// Render tiles
function renderTiles() {
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < columns; i++) {
            let tile = level.tiles[i][j];
            let coord = getTileCoordinate(i, j);
            drawTile(coord.tilex, coord.tiley, tile.type);
        }
    }
}

// Get grid position from canvas coordinates
function getGridPosition(x, y) {
    let gridy = Math.floor((y - level.y) / tileheight);
    let xoffset = ((gridy + rowoffset) % 2) ? tilewidth / 2 : 0;
    let gridx = Math.floor((x - level.x - xoffset) / tilewidth);
    return { x: gridx, y: gridy };
}

// Convert radians to degrees
function radToDeg(angle) {
    return angle * (180 / Math.PI);
}

// Convert degrees to radians
function degToRad(angle) {
    return angle * (Math.PI / 180);
}

// Get mouse position relative to canvas
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Handle mouse movement
function onMouseMove(e) {
    if (gamestate !== gamestates.ready) return;
    let pos = getMousePos(canvas, e);
    let mouseangle = radToDeg(Math.atan2((player.y + tileheight / 2) - pos.y, pos.x - (player.x + tilewidth / 2)));
    if (mouseangle < 0) {
        mouseangle += 360;
    }
    if (mouseangle > 180) {
        mouseangle = Math.max(180, mouseangle);
    } else {
        mouseangle = Math.max(8, Math.min(172, mouseangle));
    }
    player.angle = mouseangle;
}

// Render mouse angle
function renderMouseAngle() {
    let centerx = player.x + tilewidth / 2;
    let centery = player.y + tileheight / 2;
    context.lineWidth = 2;
    context.strokeStyle = '#0000ff';
    context.beginPath();
    context.moveTo(centerx, centery);
    context.lineTo(centerx + 1.5 * tilewidth * Math.cos(degToRad(player.angle)),
                   centery - 1.5 * tileheight * Math.sin(degToRad(player.angle)));
    context.stroke();
}

// Render player and bubbles
function renderPlayer() {
    context.fillStyle = '#000';
    context.fillRect(player.x, player.y, tilewidth, tileheight);
    drawTile(bubble.x, bubble.y, bubble.tiletype);
    drawTile(player.x + tilewidth + 10, player.y, nextbubble.tiletype);
}

// State: Shoot bubble
function stateShootBubble(dt) {
    bubble.x += dt * bubble.speed * Math.cos(degToRad(bubble.angle));
    bubble.y += dt * bubble.speed * -1 * Math.sin(degToRad(bubble.angle));

    if (bubble.x <= level.x) {
        bubble.angle = 180 - bubble.angle;
        bubble.x = level.x;
    } else if (bubble.x + tilewidth >= level.x + level.width) {
        bubble.angle = 180 - bubble.angle;
        bubble.x = level.x + level.width - tilewidth;
    }

    if (bubble.y <= level.y) {
        bubble.y = level.y;
        snapBubble();
        return;
    }

    for (let i = 0; i < level.columns; i++) {
        for (let j = 0; j < level.rows; j++) {
            let tile = level.tiles[i][j];
            if (tile.type < 0) continue;
            let coord = getTileCoordinate(i, j);
            if (circleIntersection(bubble.x + tilewidth / 2, bubble.y + tileheight / 2, level.radius,
                                  coord.tilex + tilewidth / 2, coord.tiley + tileheight / 2, level.radius)) {
                snapBubble();
                return;
            }
        }
    }
}

// Check if two circles intersect
function circleIntersection(x1, y1, r1, x2, y2, r2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    let len = Math.sqrt(dx * dx + dy * dy);
    return len < r1 + r2;
}

// Snap bubble to grid
function snapBubble() {
    let centerx = bubble.x + tilewidth / 2;
    let centery = bubble.y + tileheight / 2;
    let gridpos = getGridPosition(centerx, centery);

    if (gridpos.x < 0 || gridpos.x >= columns || gridpos.y < 0 || gridpos.y >= rows) {
        gridpos.x = Math.max(0, Math.min(columns - 1, gridpos.x));
        gridpos.y = Math.max(0, Math.min(rows - 1, gridpos.y));
    }

    level.tiles[gridpos.x][gridpos.y].type = bubble.tiletype;

    // Find and remove clusters
    let cluster = findCluster(gridpos.x, gridpos.y, true, true, false);
    if (cluster.length >= 3) {
        for (let tile of cluster) {
            tile.type = -1;
            tile.removed = true;
        }
        // Increment score based on cluster size
        score += cluster.length * 10; // 10 points per bubble in cluster
        updateScoreDisplay();
    }

    // Remove floating clusters
    let floatingclusters = findFloatingClusters();
    for (let cluster of floatingclusters) {
        for (let tile of cluster) {
            tile.type = -1;
            tile.removed = true;
        }
        // Increment score for floating clusters
        score += cluster.length * 10;
        updateScoreDisplay();
    }

    if (checkGameOver()) return;

    turncounter++;
    if (turncounter >= turnsafternewrow) {
        addBubbles();
        turncounter = 0;
    }

    nextBubble();
}

// Update score display in the DOM
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// Find cluster at specified tile
function findCluster(tx, ty, matchtype, reset, skipremoved) {
    if (tx < 0 || tx >= columns || ty < 0 || ty >= rows || !level.tiles[tx] || !level.tiles[tx][ty]) {
        return [];
    }

    if (reset) resetProcessed();
    let targettile = level.tiles[tx][ty];
    let toprocess = [targettile];
    targettile.processed = true;
    let foundcluster = [];

    while (toprocess.length > 0) {
        let currenttile = toprocess.pop();
        if (currenttile.type == -1) continue;
        if (skipremoved && currenttile.removed) continue;
        if (!matchtype || (currenttile.type == targettile.type)) {
            foundcluster.push(currenttile);
            let neighbors = getNeighbors(currenttile);
            for (let neighbor of neighbors) {
                if (!neighbor.processed) {
                    toprocess.push(neighbor);
                    neighbor.processed = true;
                }
            }
        }
    }
    return foundcluster;
}

// Reset processed flags
function resetProcessed() {
    for (let i = 0; i < level.columns; i++) {
        for (let j = 0; j < level.rows; j++) {
            level.tiles[i][j].processed = false;
        }
    }
}

// Neighbor offsets for hexagonal grid
const neighborsoffsets = [
    [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]],
    [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]
];

// Get neighbors of a tile
function getNeighbors(tile) {
    if (!tile || tile.x === undefined || tile.y === undefined) {
        return [];
    }
    let tilerow = (tile.y + rowoffset) % 2;
    let neighbors = [];
    let n = neighborsoffsets[tilerow];
    for (let i = 0; i < n.length; i++) {
        let nx = tile.x + n[i][0];
        let ny = tile.y + n[i][1];
        if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
            neighbors.push(level.tiles[nx][ny]);
        }
    }
    return neighbors;
}

// Find floating clusters
function findFloatingClusters() {
    resetProcessed();
    let foundclusters = [];
    for (let i = 0; i < level.columns; i++) {
        for (let j = 0; j < level.rows; j++) {
            let tile = level.tiles[i][j];
            if (!tile.processed) {
                let foundcluster = findCluster(i, j, false, false, true);
                if (foundcluster.length <= 0) continue;
                let floating = true;
                for (let k = 0; k < foundcluster.length; k++) {
                    if (foundcluster[k].y == 0) {
                        floating = false;
                        break;
                    }
                }
                if (floating) {
                    foundclusters.push(foundcluster);
                }
            }
        }
    }
    return foundclusters;
}

// Add new row of bubbles
function addBubbles() {
    for (let i = 0; i < level.columns; i++) {
        for (let j = 0; j < level.rows - 1; j++) {
            level.tiles[i][level.rows - 1 - j].type = level.tiles[i][level.rows - 1 - j - 1].type;
            level.tiles[i][level.rows - 1 - j].removed = false;
        }
    }
    for (let i = 0; i < level.columns; i++) {
        level.tiles[i][0].type = getExistingColor();
        level.tiles[i][0].removed = false;
    }
}

// Get random integer
function randRange(low, high) {
    return Math.floor(low + Math.random() * (high - low + 1));
}

// Get existing color
function getExistingColor() {
    let existingcolors = findColors();
    return existingcolors.length > 0 ? existingcolors[randRange(0, existingcolors.length - 1)] : randRange(0, bubblecolors - 1);
}

// Find remaining colors
function findColors() {
    let foundcolors = [];
    let colortable = new Array(bubblecolors).fill(false);
    for (let i = 0; i < level.columns; i++) {
        for (let j = 0; j < level.rows; j++) {
            let tile = level.tiles[i][j];
            if (tile.type >= 0 && !colortable[tile.type]) {
                colortable[tile.type] = true;
                foundcolors.push(tile.type);
            }
        }
    }
    return foundcolors;
}

// Check for game over
function checkGameOver() {
    for (let i = 0; i < level.columns; i++) {
        if (level.tiles[i][level.rows - 1].type != -1) {
            gamestate = gamestates.gameover;
            gameOverText.style.display = 'block';
            return true;
        }
    }
    return false;
}

// Prepare next bubble
function nextBubble() {
    bubble = {
        x: player.x,
        y: player.y,
        angle: player.angle,
        speed: 400,
        tiletype: nextbubble.tiletype
    };
    nextbubble = { tiletype: getExistingColor() };
    gamestate = gamestates.ready;
}

// Initialize game
function init() {
    initTiles();
    bubble = { x: player.x, y: player.y, angle: 90, speed: 400, tiletype: randRange(0, bubblecolors - 1) };
    nextbubble = { tiletype: randRange(0, bubblecolors - 1) };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', () => {
        if (gamestate === gamestates.ready) {
            bubble.angle = player.angle;
            gamestate = gamestates.shootbubble;
        }
    });
    gameLoop();
}

// Game loop
function gameLoop() {
    const now = performance.now();
    const dt = (now - (gameLoop.lastTime || now)) / 1000;
    gameLoop.lastTime = now;

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (gamestate === gamestates.shootbubble) {
        stateShootBubble(dt);
    }
    renderTiles();
    renderPlayer();
    if (gamestate === gamestates.ready) {
        renderMouseAngle();
    }

    if (gamestate !== gamestates.gameover) {
        requestAnimationFrame(gameLoop);
    }
}

// Start game
init();