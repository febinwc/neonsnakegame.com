const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let snake = [
  { x: 100, y: 100 },
  { x: 80, y: 100 },
  { x: 60, y: 100 },
];
let food = { x: 200, y: 200 };
let direction = { x: 20, y: 0 };
let score = 0;
let gameRunning = false;
let gamePaused = false;
let gameInterval;

const gridSize = 20;

// Generate Food
function generateFood() {
  food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

// Draw Snake with Eyes and Tail
function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.beginPath();
    ctx.fillStyle = index === 0 ? "#ffffff" : "#ff4500"; // Head is white, body is orange
    ctx.arc(segment.x + 10, segment.y + 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Add eyes to the snake's head
    if (index === 0) {
      ctx.fillStyle = "#000"; // Black for eyes
      ctx.beginPath();
      ctx.arc(segment.x + 5, segment.y + 5, 2, 0, Math.PI * 2); // Left eye
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(segment.x + 15, segment.y + 5, 2, 0, Math.PI * 2); // Right eye
      ctx.fill();
      ctx.closePath();
    }
  });
}

// Draw Apple
function drawFood() {
  ctx.beginPath();
  ctx.fillStyle = "#ff0000"; // Red for apple body
  ctx.arc(food.x + 10, food.y + 10, 10, 0, Math.PI * 2); // Draw apple as a circle
  ctx.fill();
  ctx.closePath();

  // Add stem
  ctx.beginPath();
  ctx.strokeStyle = "#00ff00"; // Green for stem
  ctx.lineWidth = 2;
  ctx.moveTo(food.x + 10, food.y); // Start of stem
  ctx.lineTo(food.x + 10, food.y - 5); // End of stem
  ctx.stroke();
  ctx.closePath();
}

// Move Snake
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0) head.x = canvas.width - gridSize;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - gridSize;
  if (head.y >= canvas.height) head.y = 0;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

// Check Collision
function checkCollision() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

// End Game
function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  document.getElementById("game-over").classList.remove("hidden");
}

// Reset Game
function resetGame() {
  snake = [
    { x: 100, y: 100 },
    { x: 80, y: 100 },
    { x: 60, y: 100 },
  ];
  direction = { x: 20, y: 0 };
  score = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("game-over").classList.add("hidden");
  generateFood();
  gameRunning = true;
  gameInterval = setInterval(gameLoop, 100);
}

// Game Loop
function gameLoop() {
  if (gameRunning) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    moveSnake();
    checkCollision();
  }
}

// Change Direction
function changeDirection(x, y) {
  if ((x !== 0 && direction.x === 0) || (y !== 0 && direction.y === 0)) {
    direction = { x, y };
  }
}

// Keyboard Controls
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      changeDirection(0, -gridSize);
      break;
    case "ArrowDown":
      changeDirection(0, gridSize);
      break;
    case "ArrowLeft":
      changeDirection(-gridSize, 0);
      break;
    case "ArrowRight":
      changeDirection(gridSize, 0);
      break;
  }
});

// Touch Controls
document.getElementById("up").addEventListener("click", () => changeDirection(0, -gridSize));
document.getElementById("down").addEventListener("click", () => changeDirection(0, gridSize));
document.getElementById("left").addEventListener("click", () => changeDirection(-gridSize, 0));
document.getElementById("right").addEventListener("click", () => changeDirection(gridSize, 0));

// Start Button
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-btn").style.display = "none";
  document.getElementById("stop-btn").style.display = "block";
  gameRunning = true;
  gameInterval = setInterval(gameLoop, 100);
});

// Stop Button
document.getElementById("stop-btn").addEventListener("click", () => {
  gamePaused = !gamePaused;
  if (gamePaused) {
    clearInterval(gameInterval);
    document.getElementById("stop-btn").textContent = "▶";
  } else {
    document.getElementById("stop-btn").textContent = "❚❚";
    gameInterval = setInterval(gameLoop, 100);
  }
});

// Restart Button
document.getElementById("restart-btn").addEventListener("click", () => {
  clearInterval(gameInterval);
  resetGame();
});

// Initialize Game
generateFood();
