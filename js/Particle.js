"use strict";

class Particle {
  constructor(_x, _y, _dir, _minSpeed, _speedFactor, _lifetime, _color) {
    this.position;
    this.velocity;
    this.acceleration;
    this.speed;
    this.lifetime = -1;
    this.color;
    this.initialize(_x, _y, _dir, _minSpeed, _speedFactor, _lifetime, _color);
  }

  initialize(_x, _y, _dir, _minSpeed, _speedFactor, _lifetime, _color) {
    this.position = {
      x: _x,
      y: _y
    };
    this.velocity = {
      x: 0,
      y: 0
    }
    this.acceleration = this.randomAccelerationByDirection(_dir);
    this.speed = Math.round(Math.random() * _speedFactor + _minSpeed);
    this.lifetime = Math.random() * _lifetime + (_lifetime / 2);
    this.color = _color;
  }

  randomAccelerationByDirection(_dir) {
    switch(_dir) {
      case "UP":
        return {
          x: Math.random() * 2 - 1,
          y: Math.random() - 1
        };
      case "RIGHT":
        return {
          x: Math.random(),
          y: Math.random() * 2 - 1
        };
      case "DOWN":
        return {
          x: Math.random() * 2 - 1,
          y: Math.random()
        };
      case "LEFT":
        return {
          x: Math.random() - 1,
          y: Math.random() * 2 - 1
        };
      default:
        return {
          x: 0,
          y: 0
        };
    }
  }

  get active() {
    return this.lifetime > 0;
  }

  update(_deltaTime) {
    if(!this.active) {
      return;
    }
    const SPEED_FACTOR = this.speed * _deltaTime;

    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.acceleration.x *= 0.75;
    this.acceleration.y *= 0.75;
    this.position.x += this.velocity.x * SPEED_FACTOR;
    this.position.y += this.velocity.y * SPEED_FACTOR;
    this.lifetime -= _deltaTime;
  }

  render() {
    return {
      name: this.constructor.name,
      x: this.position.x,
      y: this.position.y,
      index: this.color
    }
  }
}