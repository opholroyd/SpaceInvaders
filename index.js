var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 0;
var dy = 10;
var paddleHeight = 75;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var brickRowCount = 8;
var brickColumnCount = 1;
var brickWidth = 40;
var brickHeight = 40;
var brickPadding = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var z = 2;
var dz = 0.5;
var bz = 0;
var time = 0;
var bricksLeft = 0;
var cow = new Image();
cow.src = "./images/cow.png";
var chicken = new Image();
chicken.src = "./images/chicken.png";
var chick = new Image();
chick.src = "./images/chick.png";

canvas.width = innerWidth;
canvas.height = innerHeight;

var balls = [];
var bricks = [];

for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1,
      id: 0
    };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  } else if (e.keyCode == 32) {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  } else if (e.keyCode == 32) {
    spacePressed = false;
  }
}

function collisionDetection() {
  balls.forEach(function (e) {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if (b.status == 1) {
          if (
            e.x > b.x &&
            e.x < b.x + brickWidth &&
            e.y > b.y &&
            e.y < b.y + brickHeight
          ) {
            dz *= 1.35;
            b.status = 0;
            e.status = 0;
            score++;
            if (score == brickRowCount * brickColumnCount) {
              ``
              alert("YOU WIN, CONGRATS!");
              document.location.reload();
              clearInterval(interval); // Needed for Chrome to end game
            }
          }
        }
      }
    }
  });
}

function drawPaddle() {
  ctx.beginPath();
  ctx.drawImage(
    chicken,
    paddleX,
    canvas.height - paddleHeight - 15,
    paddleWidth,
    paddleHeight
  );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft + z;
        var brickY = c * (brickHeight + brickPadding) + brickOffsetTop + bz;
        var brickId = r;

        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        bricks[c][r].id = brickId;

        z += dz;


        if (bricks[c][r].x + dz > canvas.width - brickWidth) {
          dz = -dz;
          bz += 30;
        }

        if (bricks[c][r].x + dz < 0) {
          dz = -dz;
          bz += 30;
        }


        if (bz >= 600) {

          alert("YOU LOSE, All Chickens will be crushed");
          document.location.reload();
          clearInterval(interval); // Needed for Chrome to end game
        }

        ctx.beginPath();
        ctx.drawImage(cow, brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawBalls(ballsY, paddleXPosition) {
  ctx.beginPath();
  ctx.drawImage(chick, paddleXPosition, ballsY, 30, 30);
  ctx.fillStyle = "background-image: url('./images/chick.png')";
  ctx.fill();
  ctx.closePath();
}

function createBall() {
  let ball = {
    x: paddleX + 35,
    y: canvas.height - 60,
    status: 1
  };
  balls.unshift(ball);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawPaddle();

  if (y + dy < ballRadius) {} else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
  }

  if (spacePressed && (time === 0 || time >= 50)) {
    createBall();
    time = 0;
  }
  balls.forEach(function (e) {
    drawBalls(e.y, e.x);
  });

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  balls.forEach(function (e) {
    e.y -= 5;
  });

  collisionDetection();

  balls.forEach(function (e) {
    if (e.status === 0) {
      e.y = undefined;
      e.x = undefined;
    }
  })



  bricksLeft = bricks.length;

  x += dx;
  y += dy;
  time += 1;


}

var interval = setInterval(draw, 10);