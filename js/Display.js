"use strict";

class Display {
  constructor(_canvas, _width, _height, _spriteSheets, _fpsDisplay) {
    this.buffer = document.createElement("canvas").getContext("2d");
    this.screen = _canvas.getContext("2d");
    this.screen.canvas.width = _width;
    this.screen.canvas.height = _height;
    this.buffer.canvas.width = _width;
    this.buffer.canvas.height = _height;
    this.spriteSheets = _spriteSheets;
    this.fpsDisplay = _fpsDisplay;
    this.init();
  }

  backgroundRect(_color) {
    this.buffer.fillStyle = _color;
    this.buffer.setTransform(1,0,0,1,0,0);
    this.buffer.fillRect(0,0, this.buffer.canvas.width, this.buffer.canvas.height);
  }

  drawSpritesByType(_groupArray) {
    for(let i = 0, len = _groupArray.length; i < len; i++) {
      if(!(_groupArray[i].name in this.spriteSheets)) {
        console.log(_groupArray[i].name + " does not exist in spriteSheets");
        continue;
      }
      this.drawSprite(this.spriteSheets[_groupArray[i].name], _groupArray[i].index, _groupArray[i].x, _groupArray[i].y, _groupArray[i].a);
    }
  }

  drawSprite(_image, _spriteInd, _x, _y, _a = 1){
    const spr = _image.sprites[_spriteInd],
          w = spr.w,
          h = spr.h,
          halfW = Math.round(w / 2),
          halfH = Math.round(h / 2);
    this.buffer.setTransform(1,0,0,1,_x,_y);
    this.buffer.globalAlpha = _a;
    this.buffer.drawImage(_image, spr.x, spr.y, w, h, -halfW, -halfH, w, h);
  }

  updateFPS(_newFPS) {
    if(this.fpsDisplay.innerHTML !== _newFPS) {
      this.fpsDisplay.innerHTML = _newFPS;
    }
  }

  render() {
    /* const sheet = "Text";
    this.buffer.setTransform(1,0,0,1,0,0);
    this.buffer.drawImage(this.spriteSheets[sheet], 0, 0, this.spriteSheets[sheet].width, this.spriteSheets[sheet].height); */
    this.screen.drawImage(this.buffer.canvas, 0,0, this.buffer.canvas.width,this.buffer.canvas.height, 0,0, this.screen.canvas.width,this.screen.canvas.height);
  }

  init() {
    this.screen.imageSmoothingEnabled = false;
    this.buffer.imageSmoothingEnabled = false;
  }
}