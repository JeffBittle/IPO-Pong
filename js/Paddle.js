"use strict";

class Paddle {
  constructor(_x, _width, _height, _yMin, _yMax, _maxSpeed) {
    this.width = _width;
    this.height = _height;
    this.halfWidth = Math.round(this.width / 2);
    this.halfHeight = Math.round(this.height / 2);
    this.yMin = _yMin + this.halfHeight;
    this.yMax = _yMax - this.halfHeight;
    this.position = new Vector(_x, Math.round((this.yMin + this.yMax) / 2));
    this.goalPosition = this.position.clone();
    this.maxSpeed = _maxSpeed;
  }

  update(_newY, _deltaTime, _gameSpeed, _direct = false) {
    if(_direct) {
      this.directY = _newY;
      return;
    }
    this.goalY = _newY;
    this.position.add(this.goalPosition.clone().subtract(this.position)
                      .multiply(_deltaTime * (_gameSpeed / (this.height / 3)))
                      .limitTo(this.maxSpeed + (_gameSpeed / 200)));
  }

  render(_currentColor) {
    return {
      name: this.constructor.name,
      x: Math.round(this.position.x),
      y: Math.round(this.position.y),
      index: _currentColor
    };
  }

  set directY(_newY) {
    this.position.y = this.clampWithinBounds(_newY);
  }

  set goalY(_newY) {
    this.goalPosition.y = Math.round(this.clampWithinBounds(_newY));
  }

  clampWithinBounds(_value) {
    return Math.min(Math.max(_value, this.yMin), this.yMax)
  }

  get top() {
    return this.position.y - this.halfHeight;
  }
  get bottom() {
    return this.position.y + this.halfHeight;
  }
  get left() {
    return this.position.x - this.halfWidth;
  }
  get right() {
    return this.position.x + this.halfWidth;
  }
}