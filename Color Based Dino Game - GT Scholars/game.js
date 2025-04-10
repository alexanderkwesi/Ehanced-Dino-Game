// Full Dino Game with Level 2 Logic

let selectedDino = null;
const dinoOptions = document.querySelectorAll(".dino");
const characterSelect = document.getElementById("character-select");
const gameContainer = document.getElementById("game-container");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startingMessage = document.getElementById("starting-message");
const gameOver = document.getElementById("game-over");
const keepscore = document.getElementById("score");
const btnStartAgain = document.getElementById("btn");
const UpdateScore = document.getElementById("scores");
const levelUpMessage = document.getElementById("level-up-message");

let level = 1;
let obstacleSpeed = 5;
let gravity = 0.6;

let dinoX = 50;
let dinoY, velocityY, isJumping, score, obstacleX;
let jumpLeft = false;

const dinoWidth = 150;
const dinoHeight = 150;
const obstacleWidth = 50;
const obstacleHeight = 90;

let dinoImage = new Image();
let treeImage = new Image();
treeImage.src = "./src/obstacle-tree.png";

const backgroundImage = new Image();
backgroundImage.src = "./src/background-image.png";

const level2ObstacleImage = new Image();
level2ObstacleImage.src = "./src/pillars.png";
const level2Background = new Image();
level2Background.src = "./src/level-2-background.png";

let currentBackground = backgroundImage;
let currentObstacle = treeImage;

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

let backgroundX = 0;
let gameInterval = null;
let scoreIncrementInterval = null;
let gameIsOver = false;

// Character selection
dinoOptions.forEach((option) => {
  option.addEventListener("click", () => {
    selectedDino = option.getAttribute("data-dino");
    dinoImage.src = option.querySelector("img").src;

    startingMessage.classList.remove("hide");
    characterSelect.classList.add("hidden");

    setTimeout(() => {
      startingMessage.classList.add("hide");
      gameContainer.classList.remove("hidden");
      window.focus();
      initGame();
    }, 2000);
  });
});

function initGame() {
  dinoX = 50;
  dinoY = canvas.height - dinoHeight;
  velocityY = 0;
  isJumping = false;
  score = 0;
  obstacleX = canvas.width;
  backgroundX = 0;
  gameIsOver = false;
  jumpLeft = false;
  level = 1;
  obstacleSpeed = 5;
  currentBackground = backgroundImage;
  currentObstacle = treeImage;

  scoreElement.textContent = "Score: 0";
  gameOver.classList.add("game-hide");
  btnStartAgain.classList.remove("btn-show");
  btnStartAgain.classList.add("btn-hide");

  document.removeEventListener("keydown", handleJump);
  document.addEventListener("keydown", handleJump);

  if (scoreIncrementInterval) clearInterval(scoreIncrementInterval);
  scoreIncrementInterval = setInterval(() => {
    if (!gameIsOver) {
      score += 1;
      scoreElement.textContent = "Score: " + score;
      UpdateScore.textContent = "Score: " + score;
    }
  }, 10);

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, 20);
}

function handleJump(e) {
  if (gameIsOver) return;

  if ((e.code === "Space" || e.code === "ArrowUp") && !isJumping) {
    velocityY = -16;
    isJumping = true;
    jumpLeft = false;
  }

  if ((e.code === "ArrowRight" || e.code === "KeyA") && !isJumping) {
    velocityY = -16;
    dinoX += 30;
    if (dinoX < 0) dinoX = 0;
    isJumping = true;
    jumpLeft = true;
  }
}

function updateGame() {
  if (gameIsOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(currentBackground, 0, 0, canvas.width, canvas.height);

  velocityY += gravity;
  dinoY += velocityY;

  const floor = canvas.height - dinoHeight;
  if (dinoY >= floor) {
    dinoY = floor;
    velocityY = 0;
    isJumping = false;
    jumpLeft = false;
  }

  if (!isJumping && dinoX < 50) {
    dinoX += 2;
    if (dinoX > 50) dinoX = 50;
  }

  ctx.drawImage(dinoImage, dinoX, dinoY, dinoWidth, dinoHeight);

  const obstacleY = canvas.height - obstacleHeight;
  ctx.drawImage(
    currentObstacle,
    obstacleX,
    obstacleY,
    obstacleWidth,
    obstacleHeight
  );

  obstacleX -= obstacleSpeed;

  if (obstacleX + obstacleWidth < 0) {
    obstacleX = canvas.width + Math.random(5) * 300;
  }

  const margin = 30;
  if (
    dinoX + dinoWidth - margin > obstacleX &&
    dinoX + margin < obstacleX + obstacleWidth &&
    dinoY + dinoHeight - margin > obstacleY &&
    dinoY + margin < obstacleY + obstacleHeight
  ) {
    endGame();
  }

  if (score >= 5000 && level === 1) {
    level = 2;
    enterLevelTwo();
  }
}

function enterLevelTwo() {
  console.log("Level 2 started!");
  currentBackground = level2Background;
  currentObstacle = level2ObstacleImage;
  dinoX = 0;
  obstacleSpeed = 8;

  levelUpMessage.classList.remove("hide");
  setTimeout(() => {
    levelUpMessage.classList.add("hide");
  }, 3000);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(scoreIncrementInterval);
  gameIsOver = true;

  gameOver.classList.remove("game-hide");
  keepscore.textContent = "Your score: " + score;

  btnStartAgain.classList.remove("btn-hide");
  btnStartAgain.classList.add("btn-show");

  btnStartAgain.onclick = () => {
    gameContainer.classList.remove("hidden");
    gameOver.classList.add("game-hide");
    initGame();
  };
}
