"use strict";

const canvas = document.getElementById('tetris'); //access the canvas
const context = canvas.getContext('2d'); //draw the context

function startGame(){ //add start button
	document.getElementById ('container').style.display = "block";
	document.getElementById ('startButton').remove();
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "#202028"
	playerReset();
    updateScore();
    update();
}

context.scale(20,20);

function clearLine() { //clearing lines
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        
        player.score += rowCount * 10; //counting score
        rowCount *= 2;
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y){
        for (let x = 0; x < m[y].length; ++x ) {
            if (m[y][x] !== 0 && 
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) { //creating matrix
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createShape(type) { //creating shapes
    if (type === 'T') {
        return [
                [0,0,0],
                [1,1,1],
                [0,1,0],
               ];
        } else if (type === 'O') {
        return [
                [2,2],
                [2,2],
               ];
        } else if (type === 'L') {
        return [
                [0,3,0],
                [0,3,0],
                [0,3,3],
               ];
        } else if (type === 'J') {
        return [
                [0,4,0],
                [0,4,0],
                [4,4,0],
               ];
        } else if (type === 'I') {
        return [
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
               ];
        } else if (type === 'Z') {
        return [
                [6,6,0],
                [0,6,6],
                [0,0,0],
               ];
        } else if (type === 'S') {
        return [
                [0,7,7],
                [7,7,0],
                [0,0,0],
               ];
        }
}

function draw() { //general draw function
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset){
        matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value] ;
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1,1);
            }
        });
    });
}

function merge(arena, player) { //copy all the values from the player into arena at correct position
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++; //down arrow
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        clearLine();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

function playerReset() {
    const shapes = 'IOSZJLT';
    player.matrix = createShape(shapes[shapes.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = 
            [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000; //ms
let lastTime = 0;

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    dropCounter += deltaTime;
    if (dropCounter > dropInterval){
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}


const colors = [ //colors of shapes
    null,
    'purple',
    'yellow',
    'blue',
    'orange',
    'cyan',
    'red',
    'green',
];

const arena = createMatrix(12, 20);

const player ={
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0, 
}

document.addEventListener('keydown', event => { //key controls
    if (event.keyCode === 37) { 
        playerMove(-1); //left arrow
    } else if (event.keyCode === 39){
        playerMove(1); //right arrow
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 38) {
        playerRotate(-1);
    } else if (event.keyCode === 27) {
        alert("paused");
    }
});




