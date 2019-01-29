/*
  This concept for a fixed step game loop came primarily from http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
  I have since rewritten it into an ES6 style, self-contained class that is reusable and has a few additional features, such as making the framerate throttle completely independent of the physics rate, as well as a couple of functions to enable changing the framerate or physics rate on the fly while the engine is running and an easy way of retrieving the current FPS of the engine.
*/

"use strict";

class Engine {
  constructor(_fpsRate, _physicsTickRate, _updateCallback, _renderCallback) {
    this.fpsInterval = 1000 / _fpsRate;
    this.physicsInterval = 1000 / _physicsTickRate;
    this.fps_ = _fpsRate;

    this.loopStarted = this.loopRunning = false;
    this.lastPhysicsTime;
    this.elapsedPhysicsTime;
    this.accumulator;
    this.lastFrameTime;
    this.elapsedFrameTime;
    this.lastFPSUpdate;
    this.framesThisSecond;
    this.numUpdateSteps;
    this.frameID;

    this.updateCallback = _updateCallback;
    this.renderCallback = _renderCallback;
    this.mainLoop = this.mainLoop.bind(this);
  }

  start() {
    if(!this.loopRunning) {
      this.loopStarted = true;
      this.frameID = requestAnimationFrame((_currentTime) => {
        this.renderCallback();
        this.loopRunning = true;
        this.lastFrameTime = this.lastPhysicsTime = this.lastFPSUpdate = _currentTime;
        this.framesThisSecond = 0;
        this.accumulator = 0;
        this.frameID = requestAnimationFrame(this.mainLoop);
      });
    }
  }

  stop() {
    this.loopStarted = this.loopRunning = false;
    cancelAnimationFrame(this.frameID);
  }

  mainLoop(_currentTime) {
    if(!this.loopRunning) {
      return;
    }

    if(_currentTime > this.lastFPSUpdate + 1000) {
      this.fps_ = 0.25 * this.framesThisSecond + (1 - 0.25) * this.fps_;
      this.lastFPSUpdate = _currentTime;
      this.framesThisSecond = 0;
    }

    this.elapsedFrameTime = _currentTime - this.lastFrameTime;
    this.elapsedPhysicsTime = _currentTime - this.lastPhysicsTime;
    this.accumulator += this.elapsedPhysicsTime;

    this.numUpdateSteps = 0;
    while(this.accumulator > this.physicsInterval) {
      this.updateCallback(this.physicsInterval / 1000);
      this.accumulator -= this.physicsInterval;

      if(this.numUpdateSteps++ >= 240) {
        this.panic();
        break;
      }
    }
    this.lastPhysicsTime = _currentTime;

    if(this.elapsedFrameTime > this.fpsInterval) {
      this.lastFrameTime = _currentTime - (this.elapsedFrameTime % this.fpsInterval);
      this.framesThisSecond++;

      this.renderCallback();
    }

    this.frameID = requestAnimationFrame(this.mainLoop);
  }

  panic() {
    this.accumulator = 0;
  }

  getNewFPSRateFromEvent(_event) {
    this.updateFPSRate(parseInt(_event.target.value));
  }

  updateFPSRate(_newRate) {
    this.fpsInterval = 1000 / _newRate;
  }

  getNewPhysicsRateFromEvent(_event) {
    this.updatePhysicsRate(parseInt(_event.target.value));
  }

  updatePhysicsRate(_newRate) {
    this.physicsInterval = 1000 / _newRate;
  }

  toggleEngine() {
    if(this.loopRunning && this.loopStarted) {
      this.stop();
    } else {
      this.start();
    }
  }

  get fps() {
    return this.fps_;
  }
}