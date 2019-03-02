var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.getElementById('field');
var context = canvas.getContext('2d');


var paddle1X = 20;
var paddle1Y = 230;
var paddle2X = 980;
var paddle2Y = 230;
var paddle_thick = 10;
var paddle_height = 230;
var ball_radius = 10;
var playing = true;

var player1Score = 0;
var player2Score = 0;
var showWinner = false;
var winningScore = 5;
var fontStyle = "30px Arial";
var textColor = "white";

var keysDown = {};

var player1 = new Player(paddle1X, paddle1Y, paddle_thick, paddle_height);
var player2 = new Player(paddle2X, paddle2Y, paddle_thick, paddle_height);
var ball = new Ball(canvas.width / 2, canvas.height / 2);


window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
   };

var step = function() {
    update();
    render();
    animate(step);
  };

  var update = function() {
    player1.update();
    player2.update();
    ball.update(player1.paddle, player2.paddle);
};

var render = function() {
    player1.render();
    player2.render();
    ball.render();
  };

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
  }

 Paddle.prototype.render = function() {
    context.fillStyle = "#fff";
    context.fillRect(this.x, this.y, this.width, this.height);
  };

  function Player(x, y, paddle_thick, paddle_height) {
    this.paddle = new Paddle(x, y, paddle_thick, paddle_height);
 }

 Player.prototype.render = function() {
    this.paddle.render();
  };


Player.prototype.update = function() {
        for(var key in keysDown) {
            var value = Number(key);
            if(value == 37) { // left arrow
                if (player2.paddle.x >= canvas.width / 2) {
                    player2.paddle.move(-4, 0);
                }
            } else if (value == 39) { // right arrow
              player2.paddle.move(4, 0);
            } else if (value == 38) { // up arrow
              player2.paddle.move(0, -4);
            } else if (value == 40) { // down arrow
              player2.paddle.move(0, 4);
            } else if (value == 87) { // W arrow
                player1.paddle.move(0, -4);
            } else if (value == 83) { // S arrow
                player1.paddle.move(0, 4);
            } else if (value == 65) { // A arrow
                player1.paddle.move(-4, 0);
            } else if (value == 68) { // D arrow
                if (player1.paddle.x + player1.paddle.width <= canvas.width / 2)
                player1.paddle.move(4, 0);
            } else {
              player2.paddle.move(0, 0);
            }
          }

    
  };
  
Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.y < 0) { // all the way up
      this.y = 0;
      this.y_speed = 0;
    } else if (this.y + this.height > canvas.height) { // all the way down
      this.y = canvas.height - this.height;
      this.y_speed = 0;
    } else if (this.x + this.width > canvas.width) { // all the way to the right
        this.x = canvas.width - this.width;
        this.x_speed = 0;
    } else if (this.x < 0) { // all the way to the left
        this.x = 0;
        this.x_speed = 0;
    }
  }

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = -3;
    this.y_speed = 3;
    this.radius = ball_radius;
  }
  
Ball.prototype.render = function() {

    if(player1Score >= winningScore || player2Score >= winningScore) {
        showWinner = true;
    }

    if(showWinner) {
        playing = false;
        if(player1Score >= winningScore) {
          var text = "Left Player Wins!";
        } else if(player2Score>= winningScore) {
          var text = "Right Player Wins!";
        }
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = fontStyle;
        var x = (context.measureText(text).width);
        context.fillText(text,(canvas.width-x)/2, 200);
        context.fillStyle = textColor;
        context.fillText("Click To Continue",(canvas.width-x)/2, 400);
        return;
      }



    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#fff";
    context.fill();

    context.font = fontStyle;
    context.fillStyle = textColor;
    context.fillText(player1Score, 100, 100);
    // the player two score text
    context.fillStyle = textColor;
    context.fillText(player2Score, canvas.width-100, 100);

  };

Ball.prototype.update = function(paddle1, paddle2) {

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.x += this.x_speed;
    this.y += this.y_speed;
    var left_x = this.x - ball_radius;
    var left_y = this.y - ball_radius;
    var right_x = this.x + ball_radius;
    var right_y = this.y + ball_radius;

    var paddle1 = player1.paddle;
    var paddle2 = player2.paddle;

    if(this.y < 0 + ball_radius) { // hitting the upper side
        this.y_speed = -this.y_speed;
      } else if(this.y > canvas.height - ball_radius) { // hitting the lower side
        this.y_speed = -this.y_speed;
      }

    if(this.x < 0) { // a point was scored
        this.x_speed = -3;
        this.y_speed = 0;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        player2Score++;
    } else if (this.x > canvas.width) {
        this.x_speed = 3;
        this.y_speed = 0;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        player1Score++;
    }

    if(left_x < (paddle1.x + paddle1.width) && right_x > (paddle1.x + ball_radius) && left_y < (paddle1.y + paddle1.height) && left_y > paddle1.y) {
        // hit the player1's paddle
        this.x_speed = 3;
        this.y_speed += (paddle1.y_speed / 2);
        this.y += this.y_speed;
      } else {
        if(right_x > paddle2.x && left_x < (paddle2.x + paddle2.width) && right_y > paddle2.y && right_y < (paddle2.y + paddle2.height)) {
            // hit the player2's paddle
            this.x_speed = -3;
            this.y_speed += (paddle2.y_speed / 2);
            this.y += this.y_speed;
          }
      }
  };

  window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });
  
  window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });




canvas.addEventListener("mousedown", restartGame);



function restartGame() {
    if (playing == false) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        player1Score = 0;
        player2Score = 0;
        showWinner = false;
        player1 = new Player(paddle1X, paddle1Y, paddle_thick, paddle_height);
        player2 = new Player(paddle2X, paddle2Y, paddle_thick, paddle_height);
        ball = new Ball(canvas.width / 2, canvas.height / 2);
    
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;;
        racket_speed = 30;
        racket1X = 20;
        racket1Y = 230;
        racket2X = 1160;
        racket2Y = 230;
        showWinner = false;
    }
}

