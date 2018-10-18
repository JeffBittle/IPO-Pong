"use strict";

class Input {
  constructor(_canvas) {
    this.canvas = _canvas;
    this.canvas.addEventListener("mousemove", this.getMouseY.bind(this));
    this.mouseY_ = 0;
  }

  newListener(_object, _eventType, _callback) {
    _object.addEventListener(_eventType, _callback);
  }

  getMouseY(evt) {
    const clientRect = this.canvas.getBoundingClientRect(),
          root = document.documentElement;

    this.mouseY_ = evt.clientY - clientRect.top - root.scrollTop;
  }

  get mouseY() {
    return this.mouseY_;
  }
}