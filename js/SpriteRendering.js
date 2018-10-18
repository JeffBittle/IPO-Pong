"use strict";

function makeNetSprites(_playfieldHeight, _netSegmentWidth, _netSegmentHeight, _blur, _colorArray) {
  const netContext = document.createElement("canvas").getContext("2d"),
        netSegmentWidth = _netSegmentWidth,
        netSegmentHeight = _netSegmentHeight,
        netSegmentHalfHeight = Math.round(_netSegmentHeight / 2),
        netSegmentSpacing = _netSegmentHeight * 2,
        spriteWidth = _netSegmentWidth + _blur * 2,
        spriteHeight = _playfieldHeight,
        spriteHalfWidth = Math.round(spriteWidth / 2) - Math.round(netSegmentWidth / 2),
        spriteCols = _colorArray.length,
        spriteRows = Math.round(spriteHeight / netSegmentHeight),
        spriteArray = [];

  netContext.canvas.width = spriteWidth * spriteCols;
  netContext.canvas.height = spriteHeight;
  netContext.shadowBlur = _blur;

  for(let i = 0; i < spriteCols; i++) {
    netContext.fillStyle = _colorArray[i];
    netContext.shadowColor = _colorArray[i];
    for(let j = 0; j < spriteRows; j++) {
      netContext.fillRect(spriteHalfWidth + (spriteWidth * i), netSegmentHalfHeight + (netSegmentSpacing * j), netSegmentWidth, netSegmentHeight);
    }
    spriteArray.push({
      x: spriteWidth * i,
      y: 0,
      w: spriteWidth,
      h: spriteHeight
    });
  }

  return combinedSpriteMap(netContext.canvas, spriteArray);
}

function makeWallSprites(_thickness, _width, _blur, _colorArray) {
  const wallContext = document.createElement("canvas").getContext("2d"),
        spriteWidth = _width,
        spriteHeight = _thickness + (2 * _blur),
        colorNumber = _colorArray.length,
        spriteArray = [];

  wallContext.canvas.width = spriteWidth;
  wallContext.canvas.height = spriteHeight * colorNumber;
  wallContext.shadowBlur = _blur;

  for(let i = 0; i < colorNumber; i++) {
    wallContext.fillStyle = _colorArray[i];
    wallContext.shadowColor = _colorArray[i];
    wallContext.fillRect(0, _blur + (spriteHeight * i), spriteWidth, _thickness);

    spriteArray.push({
      x: 0,
      y: spriteHeight * i,
      w: spriteWidth,
      h: spriteHeight
    });
  }

  return combinedSpriteMap(wallContext.canvas, spriteArray);
}

function makePaddleSprites(_width, _height, _blur, _colorArray) {
  const paddleContext = document.createElement("canvas").getContext("2d"),
        spriteWidth = _width + (2 * _blur),
        spriteHeight = _height + (2 * _blur),
        spriteCols = Math.floor(_colorArray.length / 2),
        spriteRows = Math.ceil(_colorArray.length / spriteCols),
        spriteArray = [];
  let spriteX, spriteY;

  paddleContext.canvas.width = spriteWidth * spriteCols;
  paddleContext.canvas.height = spriteHeight * spriteRows;
  paddleContext.shadowBlur = _blur;

  for(let i = 0, colorIndex = 0; i < spriteRows; i++) {
    for(let j = 0; j < spriteCols; j++) {
      paddleContext.fillStyle = _colorArray[colorIndex];
      paddleContext.shadowColor = _colorArray[colorIndex];

      spriteX = spriteWidth * j;
      spriteY = spriteHeight * i;
      paddleContext.fillRect(spriteX + _blur, spriteY + _blur, _width, _height);
      spriteArray.push({
        x: spriteX,
        y: spriteY,
        w: spriteWidth,
        h: spriteHeight
      });
      colorIndex++;
    }
  }

  return combinedSpriteMap(paddleContext.canvas, spriteArray);
}

function makeBallSprites(_radius, _blur, _colorArray) {
  const ballContext = document.createElement("canvas").getContext("2d"),
        spriteSize = 2 * (_radius + _blur),
        TWO_PI = Math.PI * 2,
        spriteCols = Math.floor(_colorArray.length / 2),
        spriteRows = Math.ceil(_colorArray.length / spriteCols),
        spriteArray = [];
  let spriteX, spriteY, spriteXcenter, spriteYcenter;

  ballContext.canvas.width = spriteSize * spriteCols;
  ballContext.canvas.height = spriteSize * spriteRows;
  ballContext.shadowBlur = _blur;

  for(let i = 0, colorIndex = 0; i < spriteRows; i++) {
    for(let j = 0; j < spriteCols; j++) {
      ballContext.fillStyle = _colorArray[colorIndex];
      ballContext.shadowColor = _colorArray[colorIndex];
      spriteX = spriteSize * j;
      spriteY = spriteSize * i;
      spriteXcenter = spriteX + Math.round(spriteSize / 2);
      spriteYcenter = spriteY + Math.round(spriteSize / 2);
      ballContext.beginPath();
      ballContext.arc(spriteXcenter, spriteYcenter, _radius, 0, TWO_PI);
      ballContext.fill();
      spriteArray.push({
        x: spriteX,
        y: spriteY,
        w: spriteSize,
        h: spriteSize
      });
      colorIndex++;
    }
  }

  return combinedSpriteMap(ballContext.canvas, spriteArray);
}

function makeParticleSprites(_colorArray) {
  const particleContext = document.createElement("canvas").getContext("2d"),
        particleSize = 3,
        colorNumber = _colorArray.length,
        spriteArray = [];

  particleContext.canvas.width = particleSize * colorNumber;
  particleContext.canvas.height = particleSize;

  for(let i = 0; i < colorNumber; i++) {
    particleContext.fillStyle = _colorArray[i];

    particleContext.globalAlpha = 1;
    particleContext.fillRect(1 + particleSize * i, 1, 1, 1);
    particleContext.globalAlpha = 0.75;
    particleContext.fillRect(0 + particleSize * i, 0, 1, 1);
    particleContext.fillRect(2 + particleSize * i, 0, 1, 1);
    particleContext.fillRect(0 + particleSize * i, 2, 1, 1);
    particleContext.fillRect(2 + particleSize * i, 2, 1, 1);
    particleContext.globalAlpha = 0.5;
    particleContext.fillRect(1 + particleSize * i, 0, 1, 1);
    particleContext.fillRect(0 + particleSize * i, 1, 1, 1);
    particleContext.fillRect(2 + particleSize * i, 1, 1, 1);
    particleContext.fillRect(1 + particleSize * i, 2, 1, 1);

    spriteArray.push({
      x: particleSize * i,
      y: 0,
      w: particleSize,
      h: particleSize
    })
  }

  return combinedSpriteMap(particleContext.canvas, spriteArray);
}

function makeDigitSprites(_fontSize, _fontFace, _blur, _colorArray) {
  const digitContext = document.createElement("canvas").getContext("2d");
  digitContext.font = _fontSize + "px " + _fontFace;
  const spriteWidth = Math.floor(digitContext.measureText("8").width + (2 * _blur)),
        spriteHeight = _fontSize + (2 * _blur),
        halfSpriteWidth = Math.round(spriteWidth / 2),
        halfSpriteHeight = Math.round(spriteHeight / 2),
        colorNumber = _colorArray.length,
        spriteArray = [];

  digitContext.canvas.width = spriteWidth * 10;
  digitContext.canvas.height = spriteHeight * colorNumber;
  digitContext.font = _fontSize + "px " + _fontFace;
  digitContext.textAlign = "center";
  digitContext.textBaseline = "middle";
  digitContext.shadowBlur = _blur;

  for(let i = 0; i < colorNumber; i++) {
    digitContext.fillStyle = _colorArray[i];
    digitContext.shadowColor = _colorArray[i];
    for(let j = 0; j < 10; j++) {
      digitContext.fillText(j.toString(), halfSpriteWidth + (spriteWidth * j), halfSpriteHeight + (spriteHeight * i));

      spriteArray.push({
        x: spriteWidth * j,
        y: spriteHeight * i,
        w: spriteWidth,
        h: spriteHeight
      });
    }
  }

  return combinedSpriteMap(digitContext.canvas, spriteArray);
}

function makeGameTextSprites(_array, _fontSize, _fontFace, _blur) {
  const textContext = document.createElement("canvas").getContext("2d"),
        longestText = _array.reduce((longest, text) => (text.length > longest.length) ? text : longest, '');
  textContext.font = _fontSize + "px " + _fontFace;
  const spriteWidth = Math.floor(textContext.measureText(longestText).width) + (2 * _blur),
        spriteHeight = _fontSize + (2 * _blur),
        halfSpriteWidth = Math.round(spriteWidth / 2),
        halfSpriteHeight = Math.round(spriteHeight / 2),
        spriteArray = [];

  textContext.canvas.width = spriteWidth;
  textContext.canvas.height = spriteHeight * _array.length;
  textContext.font = _fontSize + "px " + _fontFace;
  textContext.fillStyle = "#FFFFFF";
  textContext.shadowColor = "#FFFFFF";
  textContext.shadowBlur = _blur;
  textContext.textAlign = "center";
  textContext.textBaseline = "middle";

  for(let i = 0, len = _array.length; i < len; i++) {
    textContext.fillText(_array[i], halfSpriteWidth, halfSpriteHeight + (spriteHeight * i));

    spriteArray.push({
      x: 0,
      y: spriteHeight * i,
      w: spriteWidth,
      h: spriteHeight
    });
  }

  return combinedSpriteMap(textContext.canvas, spriteArray);
}

function combinedSpriteMap(_canvas, _spriteMap) {
  let image = _canvas;
  image.sprites = _spriteMap;
  return image;
}