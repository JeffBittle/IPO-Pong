"use strict";

class Game {
  constructor(_x, _y, _width, _height, _goal, _defaultColor, _maxColors, _offsetFromEdge) {
    this.x = _x;
    this.y = _y;
    this.width = _width - (this.x * 2);
    this.height = _height - (this.y * 2);
    this.centerX = Math.round(this.width / 2) + this.x;
    this.centerY = Math.round(this.height / 2) + this.y;
    this.currentColor = _defaultColor;
    this.colorNumber = _maxColors;
    this.gameOver = true;
    this.running = false;
    this.scores = {
      left: 0,
      right: 0,
      goal: _goal,
      winner: -1,
      render: function(_player) {
        let xOffset = 64;
        if(_player === "left") {
          xOffset = -xOffset;
        }

        return {
          name: "Digit",
          x: this.centerX + xOffset,
          y: this.y + 64,
          index: (this.currentColor * this.colorNumber) + this.scores[_player]
        };
      }.bind(this)
    };
    this.initialGameSpeed = 400;
    this.gameSpeed = 400;
    this.maxGameSpeed = 2000;
    this.paddles = this.initPaddles(16, 100, 7.5, _offsetFromEdge);
    this.leftControlType = "";
    this.ball = this.initBall(10, 2 * this.paddles.left.width);
    this.initialDirection = Math.round(Math.random());
    this.soundQueue = [];
    this.particles = new ObjectPool(Particle);
  }

  update(_newPlayer1Y, _deltaTime) {
    if(this.running) {
      this.ball.update(_deltaTime, this.gameSpeed);
      this.horizontalCollisionHandling();
      this.verticalCollisionHandling();
    }
    this.particles.update(_deltaTime);
    this.paddles.right.update(this.findNewCPUGoalY("right"), _deltaTime, this.gameSpeed);
    switch(this.leftControlType) {
      case "Direct Mouse":
        this.paddles.left.update(_newPlayer1Y, _deltaTime, this.gameSpeed, true); //Direct mouse control for player 1
      break;
      case "Smoothed Mouse":
        this.paddles.left.update(_newPlayer1Y, _deltaTime, this.gameSpeed); //Smoothed mouse control for player 1
      break;
      case "CPU":
        this.paddles.left.update(this.findNewCPUGoalY("left"), _deltaTime, this.gameSpeed); //CPU Control for player 1
      break;
    }
  }

  render() {
    const renderObjs = [
      this.net,
      this.topWall,
      this.bottomWall,
      this.paddles.left.render(this.currentColor),
      this.paddles.right.render(this.currentColor),
      this.scores.render("left"),
      this.scores.render("right"),
      this.ball.render(this.currentColor)
    ],
          soundObjs = this.soundQueue.splice(0);
    if(this.scores.winner !== -1) {
      renderObjs.push(this.getWinnerText());
    }
    if(this.gameOver) {
      renderObjs.push({
        name: "Text",
        x: this.centerX,
        y: this.centerY - 39,
        index: 2
      });
    }
    renderObjs.push(...this.particles.render());

    return {
      Display: renderObjs,
      Sound: soundObjs
    }
  }

  pointAABBCheck(_px, _py, _bbtop, _bbright, _bbbottom, _bbleft) {
    return (_px >= _bbleft && _px <= _bbright) && (_py >= _bbtop && _py <= _bbbottom);
  }

  pointInBounds(_px, _py) {
    return this.pointAABBCheck(_px, _py, this.y, this.x + this.width, this.y + this.height, this.x);
  }

  pointInPaddle(_px, _py, _paddle) {
    switch(_paddle) {
      case "left":
        return this.pointAABBCheck(_px, _py,
          this.paddles.left.top, this.paddles.left.right,
          this.paddles.left.bottom, this.paddles.left.left);
      case "right":
        return this.pointAABBCheck(_px, _py,
          this.paddles.right.top, this.paddles.right.right,
          this.paddles.right.bottom, this.paddles.right.left);
    }
  }

  increaseGameSpeed() {
    if((this.gameSpeed += 40) >= this.maxGameSpeed) {
      this.gameSpeed = this.maxGameSpeed;
    }
  }

  particleBurst(_x, _y, _dir) {
    for(let i = 0; i < 50; i++) {
      this.particles.create(_x, _y, _dir, 37, 75, 0.3, this.currentColor);
    }
  }

  paddleHit(_paddle) {
    this.ball.velocity = Vector.fromBearing(_paddle.angleFrom(this.ball.position), 1);
    if(this.ball.velocity.x > 0) {
      this.ball.velocity.x = Math.max(this.ball.velocity.x, 0.25);
    } else if(this.ball.velocity.x < 0) {
      this.ball.velocity.x = Math.min(this.ball.velocity.x, -0.25);
    }
    this.ball.velocity = this.ball.velocity.unitVector;
    this.increaseGameSpeed();
    let direction = "";
    if(this.ball.velocity.x > 0) {
      direction = "RIGHT";
    } else {
      direction = "LEFT";
    }
    this.particleBurst(this.ball.x, this.ball.y, direction);
    this.changeColor();
    this.soundQueue.push(this.getSoundObject("PaddleHit"));
  }

  wallHit() {
    this.ball.flipY();
    let direction = "";
    if(this.ball.velocity.y > 0) {
      direction = "DOWN";
    } else {
      direction = "UP";
    }
    this.particleBurst(this.ball.x, this.ball.y, direction);
    this.changeColor();
    this.soundQueue.push(this.getSoundObject("WallHit"));
  }

  getSoundObject(_type) {
    return {
      name: _type,
      center: this.centerX,
      location: this.ball.position.x
    }
  }

  ballScored(_scorer) {
    switch(_scorer) {
      case 0:
        if(++this.scores.left >= this.scores.goal) {
          this.declareWinner(_scorer);
        }
      break;
      case 1:
        if(++this.scores.right >= this.scores.goal) {
          this.declareWinner(_scorer);
        }
      break;
    }
    this.initialDirection = _scorer === 0 ? 1 : 0;
    if(this.scores.winner === -1) {
      this.resetBall();
    } else {
      this.running = false;
      this.gameOver = true;
    }
  }

  declareWinner(_winner) {
    this.scores.winner = _winner;
  }

  getWinnerText() {
    let xOffsetMultiplier = 0.25;
    if(this.scores.winner === 1) {
      xOffsetMultiplier = 0.75;
    }

    return {
      name: "Text",
      x: Math.round(this.x + (this.width * xOffsetMultiplier)),
      y: Math.round(this.y + (this.height * 0.25)),
      index: this.scores.winner
    };
  }

  changeColor() {
    let newColor;

    do {
      newColor = Math.floor(Math.random() * (this.colorNumber - 1) + 1);
    } while(newColor === this.currentColor);

    this.currentColor = newColor;
  }

  findNewCPUGoalY(_paddle) {
    let newGoal = this.centerY;
    switch(_paddle) {
      case "left":
        if(this.ball.velocity.x < 0) {
          newGoal = this.ball.position.y;
        }
      break;
      case "right":
        if(this.ball.velocity.x > 0) {
          newGoal = this.ball.position.y;
        }
      break;
    }

    return newGoal;
  }

  horizontalCollisionHandling() {
    if((this.ball.velocity.x < 0) && (this.ball.left <= this.paddles.left.position.x + this.paddles.left.width)) {
      if(this.pointInPaddle(this.ball.left, this.ball.y, "left") ||
         this.pointInPaddle(this.ball.halfLeft, this.ball.halfTop, "left") ||
         this.pointInPaddle(this.ball.halfLeft, this.ball.halfBottom, "left") ||
         this.pointInPaddle(this.ball.x, this.ball.top, "left") ||
         this.pointInPaddle(this.ball.x, this.ball.bottom, "left")) {
          this.paddleHit(this.paddles.left.position);
      } else if(this.ball.left < this.x) {
        this.ballScored(1);
      }
    } else if((this.ball.velocity.x > 0) && (this.ball.right >= this.paddles.right.position.x - this.paddles.right.width)) {
      if(this.pointInPaddle(this.ball.right, this.ball.y, "right") ||
      this.pointInPaddle(this.ball.halfRight, this.ball.halfTop, "right") ||
      this.pointInPaddle(this.ball.halfRight, this.ball.halfBottom, "right") ||
      this.pointInPaddle(this.ball.x, this.ball.top, "right") ||
      this.pointInPaddle(this.ball.x, this.ball.bottom, "right")) {
        this.paddleHit(this.paddles.right.position);
      } else if(this.ball.right > this.x + this.width) {
        this.ballScored(0);
      }
    }
  }

  verticalCollisionHandling() {
    if(this.ball.velocity.y < 0) {
      if(!this.pointInBounds(this.ball.position.x, this.ball.top)) {
        this.wallHit();
      }
    } else if(this.ball.velocity.y > 0) {
      if(!this.pointInBounds(this.ball.position.x, this.ball.bottom)) {
        this.wallHit();
      }
    }
  }

  updateControlType(_value) {
    this.leftControlType = _value;
  }

  getNewControlTypeValue(_event) {
    this.updateControlType(_event.target.value);
  }

  updateScoreGoal(_value) {
    this.scores.goal = _value;
  }

  getNewGoalValue(_event) {
    this.updateScoreGoal(parseInt(_event.target.value));
  }

  togglePause() {
    this.running = !this.running;
  }

  reset() {
    if(this.gameOver) {
      this.currentColor = 0;
      this.scores.left = 0;
      this.scores.right = 0;
      this.scores.winner = -1;
      this.resetBall();
    }
  }

  hardReset() {
    this.currentColor = 0;
    this.scores.left = 0;
    this.scores.right = 0;
    this.scores.winner = -1;
    this.gameOver = true;
    this.resetBall();
    this.running = false;
    this.gameOver = true;
  }

  resetBall() {
    this.gameSpeed = this.initialGameSpeed;
    this.ball.reset();
    if(this.initialDirection === 0) {
      this.ball.flipAccelerationX();
    }
    if(!this.gameOver) {
      this.running = false;
      setTimeout(() => this.running = true, 1000);
    } else {
      this.running = true;
      this.gameOver = false;
    }
  }

  get net() {
    return {
      name: "Net",
      x: this.centerX,
      y: this.centerY,
      index: this.currentColor
    };
  }

  get topWall() {
    return {
      name: "Wall",
      x: this.centerX,
      y: 0,
      index: this.currentColor
    }
  }

  get bottomWall() {
    return {
      name: "Wall",
      x: this.centerX,
      y: this.height + (2 * this.y),
      index: this.currentColor
    }
  }

  initBall(_radius, _maxSpeed) {
    return new Ball(this.centerX, this.centerY, _radius, _maxSpeed);
  }

  initPaddles(_width, _height, _maxSpeed, _offsetFromEdge) {
    return {
      left: new Paddle(this.x + _offsetFromEdge + Math.round(_width / 2), _width, _height, this.y, this.y + this.height, _maxSpeed),
      right: new Paddle(this.x + this.width - _offsetFromEdge - Math.round(_width / 2), _width, _height, this.y, this.y + this.height, _maxSpeed)
    };
  }
}