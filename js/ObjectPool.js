"use strict";

class ObjectPool {
  constructor(_class, ) {
    this.class = _class;
    this.poolArray = new Array();
    this.activeObjects = 0;
  }

  create(_x, _y, _dir, _minSpeed, _speedFactor, _lifetime, _color) {
    if(this.poolArray.length === this.activeObjects) {
      this.poolArray.push(new this.class(_x, _y, _dir, _minSpeed, _speedFactor, _lifetime, _color));
      this.activeObjects++;
    } else {
      this.poolArray.unshift(this.poolArray.pop());
      this.poolArray[0].initialize(_x, _y, _dir, _minSpeed, _speedFactor, _lifetime, _color);
      this.activeObjects++;
    }
  }

  update(_deltaTime) {
    if(this.activeObjects > 0) {
      for(let i = this.activeObjects - 1; i >= 0; i--) {
        this.poolArray[i].update(_deltaTime);
        if(!this.poolArray[i].active) {
          this.poolArray.push(this.poolArray.splice(i, 1)[0]);
          this.activeObjects--;
        }
      }
    }
  }

  render() {
    if(this.activeObjects > 0) {
      let tempArray = new Array();
      for(let i = 0; i < this.activeObjects; i++) {
        tempArray.push(this.poolArray[i].render());
      }
      return tempArray;
    }
    return [];
  }
}