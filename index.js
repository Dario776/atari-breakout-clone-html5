const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const FPS = 60;
canvas.height = 800;
canvas.width = 800;

class Player {
  constructor(x, y, width, height, color, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
    this.velocityX = 0;
  }

  draw() {
    let gradient = c.createLinearGradient(
      this.x,
      this.y,
      this.x,
      this.y + this.height
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, this.color);
    c.fillStyle = gradient;
    c.fillRect(this.x, this.y, this.width, this.height);

    c.strokeStyle = "rgba(255, 255, 255, 1)";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(this.x, this.y + this.height);
    c.lineTo(this.x, this.y);
    c.lineTo(this.x + this.width, this.y);
    c.stroke();

    c.strokeStyle = "rgba(0, 0, 0, 0.3)";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(this.x, this.y + this.height);
    c.lineTo(this.x + this.width, this.y + this.height);
    c.lineTo(this.x + this.width, this.y);
    c.stroke();
  }

  update() {
    this.x += this.velocityX;

    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }
  }
}

class Ball {
  constructor(
    x,
    y,
    size,
    color,
    startVelocity,
    startVelocityDirectionX,
    minVelocity,
    maxVelocity
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.velocity = {
      x: startVelocity * startVelocityDirectionX,
      y: -startVelocity,
    };
    this.minVelocity = minVelocity;
    this.maxVelocity = maxVelocity;
  }

  CheckCollision() {
    const ballTop = this.y;
    const ballBottom = this.y + this.size;
    const ballLeft = this.x;
    const ballRight = this.x + this.size;

    //Bricks
    let brickToRemove = null;
    bricks.forEach((brick) => {
      const brickTop = brick.y;
      const brickBottom = brick.y + brick.height;
      const brickLeft = brick.x;
      const brickRight = brick.x + brick.width;
      if (
        ballRight > brickLeft &&
        ballLeft < brickRight &&
        ballBottom > brickTop &&
        ballTop < brickBottom
      ) {
        const overlapX = Math.min(ballRight - brickLeft, brickRight - ballLeft);
        const overlapY = Math.min(ballBottom - brickTop, brickBottom - ballTop);

        if (overlapX < overlapY) {
          this.velocity.x = -this.velocity.x;
        } else {
          this.velocity.y = -this.velocity.y;
        }

        const hitCorner = Math.abs(overlapX - overlapY) < 15;

        if (hitCorner) {
          let diff=0;
          if(bricks.length<40)
            diff = 0.2;
          if(bricks.length<30)
            diff = 0.3;
          if(bricks.length<20)
            diff = 0.4;
          if(bricks.length<10)
            diff = 0.6;
          if(bricks.length<3)
            diff = 0.9;

          // console.log("DIF  "+diff);
          // console.log("VEL1  "+this.velocity.x );

          const randomVelocity =
            Math.random() * (this.maxVelocity - this.minVelocity) +
            this.minVelocity+diff*this.maxVelocity;

          const speed = Math.hypot(this.velocity.x, this.velocity.y);
          this.velocity.x = (this.velocity.x / speed) * randomVelocity;
          this.velocity.y = (this.velocity.y / speed) * randomVelocity;

          // console.log("VEL2  "+this.velocity.x );
        }

        brickToRemove = brick;
      }
    });

    if (brickToRemove) {
      const len = bricks.length;

      bricks = bricks.filter((b) => b !== brickToRemove);

      if (len != bricks.length) points++;
    }

    // Canvas borders
    if (this.x < 0) {
      this.x = 0;
      this.velocity.x = -this.velocity.x;
    }
    if (this.x + this.size > canvas.width) {
      this.x = canvas.width - this.size;
      this.velocity.x = -this.velocity.x;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity.y = -this.velocity.y;
    }

    // Player collision
    const playerTop = player.y;
    const playerBottom = player.y + player.height;
    const playerLeft = player.x;
    const playerRight = player.x + player.width;

    if (
      ballRight > playerLeft &&
      ballLeft < playerRight &&
      ballBottom > playerTop &&
      ballTop < playerBottom
    ) {
      const overlapX = Math.min(ballRight - playerLeft, playerRight - ballLeft);
      const overlapY = Math.min(ballBottom - playerTop, playerBottom - ballTop);

      if (overlapX < overlapY) {
        this.velocity.x = -this.velocity.x;
        if (this.x + this.size / 2 < player.x + player.width / 2) {
          this.x = playerLeft - this.size;
        } else {
          this.x = playerRight;
        }
      } else {
        this.velocity.y = -this.velocity.y;
        if (this.y + this.size / 2 < player.y + player.height / 2) {
          this.y = playerTop - this.size;
        } else {
          this.y = playerBottom;
        }
      }
    }

    // Bottom of canvas
    if (this.y > canvas.height) GameOver();
  }

  draw() {
    let gradient = c.createLinearGradient(
      this.x,
      this.y,
      this.x,
      this.y + this.size
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, this.color);
    c.fillStyle = gradient;
    c.fillRect(this.x, this.y, this.size, this.size);

    c.strokeStyle = "rgba(255, 255, 255, 1)";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(this.x, this.y + this.size);
    c.lineTo(this.x, this.y);
    c.lineTo(this.x + this.size, this.y);
    c.stroke();

    c.strokeStyle = "rgba(0, 0, 0, 0.3)";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(this.x, this.y + this.size);
    c.lineTo(this.x + this.size, this.y + this.size);
    c.lineTo(this.x + this.size, this.y);
    c.stroke();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.CheckCollision();
  }
}

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    let gradient = c.createLinearGradient(
      this.x,
      this.y,
      this.x,
      this.y + this.height
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, this.color);
    c.fillStyle = gradient;
    c.fillRect(this.x, this.y, this.width, this.height);

    c.strokeStyle = "rgba(255, 255, 255, 1)";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(this.x, this.y + this.height);
    c.lineTo(this.x, this.y);
    c.lineTo(this.x + this.width, this.y);
    c.stroke();

    c.strokeStyle = "rgba(0, 0, 0, 0.3)";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(this.x, this.y + this.height);
    c.lineTo(this.x + this.width, this.y + this.height);
    c.lineTo(this.x + this.width, this.y);
    c.stroke();
  }
}

function Animate(timestamp) {
  frameId = requestAnimationFrame(Animate);

  //cap fps
  if (timestamp - lastTime < interval) return;
  lastTime = timestamp;

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  ball.update();

  player.draw();
  ball.draw();

  c.fillStyle = "white";
  c.font = "bold 36px Helvetica";
  c.textAlign = "left";
  c.textBaseline = "top";
  c.fillText(points, 20, 20);

  c.font = "bold 36px Helvetica";
  c.textAlign = "right";
  c.fillText(maxPoints, canvas.width - 100, 20);

  if (bricks.length == 0) {
    isWinner = true;
    GameOver();
  }
  bricks.forEach((brick) => {
    brick.draw();
  });
}

let interval = 1000 / FPS;
let lastTime = 0;

PLAYER_WIDTH = 0.2 * canvas.width;
PLAYER_HEIGHT = 0.02 * canvas.height;
PLAYER_COLOR = "grey";
PLAYER_SPEED = canvas.height / 100;

BRICK_COLOR = [
  "rgb(153, 51, 0)",
  "rgb(255, 0, 0)",
  "rgb(255, 153, 204)",
  "rgb(0, 255, 0)",
  "rgb(255, 255, 153)",
];
BRICK_WIDTH = 0.05875 * canvas.width;
BRICK_HEIGHT = 0.04 * canvas.height;
BRICK_SPACING = 30;

BALL_SIZE = 0.04 * canvas.height;
BALL_COLOR = "grey";
BALL_START_SPEED = canvas.height / 180;
BALL_MIN_SPEED = canvas.height / 230;
BALL_MAX_SPEED = canvas.height / 110;

TOPDOWN_SPACING = 80;

let maxPoints;
let points = 0;
let isWinner = false;
let isGameRunning = false;
let player;
let ball;
let bricks = [];
let pressed;
let frameId;

function Init() {
  frameId = null;
  maxPoints = window.localStorage.getItem("points") || 0;
  points = 0;
  isWinner = false;
  bricks = []; 

  player = new Player(
    canvas.width / 2 - PLAYER_WIDTH / 2,
    canvas.height - TOPDOWN_SPACING,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_COLOR,
    PLAYER_SPEED
  );

  ball = new Ball(
    canvas.width / 2,
    canvas.height - TOPDOWN_SPACING - BALL_SIZE,
    BALL_SIZE,
    BALL_COLOR,
    BALL_START_SPEED,
    Math.random() < 0.5 ? -1 : 1,
    BALL_MIN_SPEED,
    BALL_MAX_SPEED
  );

  const startPos = {
    x: 30,
    y: TOPDOWN_SPACING,
  };

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 10; j++) {
      bricks.push(
        new Brick(
          startPos.x + j * (BRICK_WIDTH + BRICK_SPACING),
          startPos.y * i + 100 - BRICK_HEIGHT,
          BRICK_WIDTH,
          BRICK_HEIGHT,
          BRICK_COLOR[i]
        )
      );
    }
  }

  pressed = new Set();
}

function GameOver() {
  cancelAnimationFrame(frameId);
  isGameRunning = false;

  if (points > maxPoints) window.localStorage.setItem("points", points);

  if (isWinner) {
    c.fillStyle = "yellow";
    c.font = "bold 40px Helvetica";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(
      "CONGRATULATIONS! YOU WON!",
      canvas.width / 2,
      canvas.height / 2
    );
  } else {
    c.fillStyle = "yellow";
    c.font = "bold 40px Helvetica";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  c.font = "italic bold 18px Helvetica";
  c.fillText(
    "Press SPACE to restart",
    canvas.width / 2,
    canvas.height / 2 + 40 / 2 + 10
  );
}

function RestartGame() {
  if (!isGameRunning) {
    Init();     
    Animate();   
    isGameRunning = true;
  }
}


window.addEventListener("keydown", (event) => {
  if (isGameRunning)
    if (event.key === "a") {
      player.velocityX = -player.speed;
      pressed.add(event.key);
    } else if (event.key === "d") {
      player.velocityX = player.speed;
      pressed.add(event.key);
    }
});

window.addEventListener("keypress", (event) => {
  if (event.key === " " && !isGameRunning) {
    RestartGame();
  }
});

window.addEventListener("keyup", (event) => {
  if (isGameRunning)
    if (event.key === "a" || event.key === "d") {
      pressed.delete(event.key);

      if (pressed.size == 0) player.velocityX = 0;
      else if (pressed.has("a")) player.velocityX = -player.speed;
      else player.velocityX = player.speed;
    }
});

function HomeScreen() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "white";
  c.font = "bold 36px Helvetica";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("BREAKOUT", canvas.width / 2, canvas.height / 2);

  c.font = "italic bold 18px Helvetica";
  c.fillText(
    "Press SPACE to begin",
    canvas.width / 2,
    canvas.height / 2 + 36 / 2 + 10
  );
}

HomeScreen();
