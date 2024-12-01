let canva = document.getElementById("gameCanvas");
let ctx = canva.getContext("2d");
let box = 25;
let column = canva.width / box;
let row = canva.height / box;

let snake = [];
snake[0] = {
    x: Math.floor(Math.random() * column) * box,
    y: Math.floor(Math.random() * row) * box,
};

let D;
let score = 0;
let blink = true;

let food;
function generateFood() {
    food = {
        x: Math.floor(Math.random() * column) * box,
        y: Math.floor(Math.random() * row) * box
    };
}
generateFood();

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && D !== "DOWN") {
        D = "UP";
    }
    if (event.key === "ArrowDown" && D !== "UP") {
        D = "DOWN";
    }
    if (event.key === "ArrowLeft" && D !== "RIGHT") {
        D = "LEFT";
    }
    if (event.key === "ArrowRight" && D !== "LEFT") {
        D = "RIGHT";
    }
});

function checkSelfCollision() {
    let head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}

let eatSound = document.getElementById("eatSound");
let gameOverSound = document.getElementById("gameOverSound");

function playSoundWithReset(sound) {
    sound.play();
    setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
    }, 100); // Adjust this timeout to be slightly longer than the sound duration
}

function move() { 
    let snakeX = snake[0].x; 
    let snakeY = snake[0].y; 
    if (D === "LEFT") snakeX -= box; 
    if (D === "RIGHT") snakeX += box; 
    if (D === "UP") snakeY -= box; 
    if (D === "DOWN") snakeY += box; 
    if (snakeX < 0) snakeX = canva.width - box; 
    else if (snakeX >= canva.width) snakeX = 0; 
    if (snakeY < 0) snakeY = canva.height - box; 
    else if (snakeY >= canva.height) snakeY = 0; 
    if (snakeX === food.x && snakeY === food.y) { 
        generateFood(); 
        score++; 
        document.getElementById("score").innerText = "Score: " + score; 
        playSoundWithReset(eatSound); 
    } 
    else { snake.pop(); } 
    let newHead = { x: snakeX, y: snakeY }; 
    snake.unshift(newHead); 
    if (checkSelfCollision()) { 
        document.getElementById("gameOver").style.display = "block"; 
        document.getElementById("score").style.display = "block"; 
        gameOverSound.play(); clearInterval(gameLoop); }
    }
function draw() {
    ctx.clearRect(0, 0, canva.width, canva.height); // Clear the canvas

    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            if (blink) {
                ctx.globalAlpha = 0.5;
            } else {
                ctx.globalAlpha = 1.0;
            }
            blink = !blink;
        } else {
            ctx.globalAlpha = 1.0;
        }
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    move();
}

let gameLoop = setInterval(draw, 100)
