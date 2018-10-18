"use strict";

class Ball {
  constructor(_x, _y, _radius, _maxSpeed) {
    this.defaultPos = new Vector(_x, _y);
    this.position = new Vector(_x, _y);
    this.velocity = Vector.zero.clone();
    this.acceleration = Vector.zero.clone();
    this.radius = _radius;
    this.halfRadius = Math.round(this.radius / 2);
    this.maxSpeed = _maxSpeed;
  }

  update(_deltaTime, _gameSpeed) {
    this.velocity.add(this.acceleration);
    this.acceleration.multiply(0);
    this.position.add(this.velocity.clone().multiply(_gameSpeed * _deltaTime).limitTo(this.maxSpeed));
  }

  render(_currentColor) {
    return {
      name: this.constructor.name,
      x: Math.round(this.position.x),
      y: Math.round(this.position.y),
      index: _currentColor
    };
  }

  reset() {
    this.position = this.defaultPos.clone();
    this.velocity = Vector.zero.clone();
    this.acceleration = Vector.fromBearing((Math.random() * (Math.PI / 2)) - (Math.PI / 4), 1);
  }

  flipAccelerationX() {
    this.acceleration.x = -this.acceleration.x;
  }

  flipX() {
    this.velocity.x = -this.velocity.x;
  }

  flipY() {
    this.velocity.y = -this.velocity.y;
  }

  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  get location() {
    return {
      x: this.x,
      y: this.y
    };
  }
  get top() {
    return this.y - this.radius;
  }
  get halfTop() {
    return this.y - this.halfRadius;
  }
  get right() {
    return this.x + this.radius;
  }
  get halfRight() {
    return this.x + this.halfRadius;
  }
  get bottom() {
    return this.y + this.radius;
  }
  get halfBottom() {
    return this.y + this.halfRadius;
  }
  get left() {
    return this.x - this.radius;
  }
  get halfLeft() {
    return this.x - this.halfRadius;
  }
}