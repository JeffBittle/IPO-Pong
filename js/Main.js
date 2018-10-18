"use strict";

let display, audioBuffer, input, game, engine;
const audioContext = new(window.AudioContext || window.webkitAudioContext)(),
      SOUNDS = {
        PaddleHit: 0,
        WallHit: 1
      };

function listenerHandlers(_canvas) {
  input.newListener(_canvas, "click", game.reset.bind(game));
  input.newListener(_canvas, "click", function() {
    if(audioContext.state === "suspended") {
      audioContext.resume();
    }
  });

  const winningGoalElement = document.getElementById("winningGoal");
  input.newListener(winningGoalElement, "change", game.getNewGoalValue.bind(game));
  game.updateScoreGoal(parseInt(winningGoalElement.value));

  const controlTypes = document.getElementsByName("LeftPaddleControl");
  for(let i = 0, len = controlTypes.length; i < len; i++) {
    input.newListener(controlTypes[i], "change", game.getNewControlTypeValue.bind(game));
    if(controlTypes[i].checked) {
      game.updateControlType(controlTypes[i].value);
    }
  }
  input.newListener(document.getElementById("GamePause"), "click", game.togglePause.bind(game));
  input.newListener(document.getElementById("GameReset"), "click", game.hardReset.bind(game));

  input.newListener(document.getElementById("EngineToggle"), "click", engine.toggleEngine.bind(engine));
  const fpsElement = document.getElementById("fpsControl");
  input.newListener(fpsElement, "change", engine.getNewFPSRateFromEvent.bind(engine));
  engine.updateFPSRate(parseInt(fpsElement.value));
  const physicsElement = document.getElementById("upsControl");
  input.newListener(physicsElement, "change", engine.getNewPhysicsRateFromEvent.bind(engine));
  engine.updatePhysicsRate(parseInt(physicsElement.value));
}

function update(_deltaTime) {
  game.update(input.mouseY, _deltaTime);
}

function render() {
  display.updateFPS(parseFloat(engine.fps).toFixed(2) + " fps");
  display.backgroundRect("rgba(0,0,0,1)");
  const renderables = game.render();
  display.drawSpritesByType(renderables.Display);
  display.render();
  if(renderables.Sound.length > 0) {
    let sounds = [];
    for(let i = 0; i < renderables.Sound.length; i++) {
      sounds[i] = new Sound(audioContext, audioBuffer.getSound(SOUNDS[renderables.Sound[i].name]));
      sounds[i].play(renderables.Sound[i].center, renderables.Sound[i].location);
    }
  }
}

window.onload = function() {
  const canvas = document.querySelector("canvas"),
        fpscounter = document.getElementById("fpsdisplay"),
        xWallThickness = 0,
        yWallThickness = 5,
        width = 800,
        height = 600,
        scoreToWin = 3,
        colorArray = [
          '#FFFFFF',
          '#FF3300',
          '#FF6600',
          '#F2EA02',
          '#33FF00',
          '#00FFFF',
          '#0033FF',
          '#FF00FF',
          '#FF0099',
          '#9D00FF'
        ],
        defaultColor = 0,
        maxColors = colorArray.length,
        netSegmentWidth = 2,
        netSegmentHeight = 20,
        blurAmount = 20,
        messages = [
          "You Win!",
          "CPU Wins!",
          "Click to Play"
        ],
        localURLtoSounds = window.location.href + "snds/",
        soundArray = [
          localURLtoSounds + "sound_spark_Laser-Like_Synth_Laser_Sweep_Burst_13.mp3",
          localURLtoSounds + "sound_spark_Laser-Like_Synth_Basic_Laser2_04.mp3"
        ];
  engine = new Engine(60, 60, update, render);
  input = new Input(canvas);
  game = new Game(xWallThickness, yWallThickness, width, height, scoreToWin, defaultColor, maxColors, blurAmount);
  audioBuffer = new AudioBuffer(audioContext, soundArray);
  canvas.addEventListener("click", function() {
    audioContext.resume(); // With a coming Chrome update, user input is needed before an AudioContext created on pageload is allowed to play audio
  });
  const spriteSheets = {
          Net: makeNetSprites(height, netSegmentWidth, netSegmentHeight, blurAmount, colorArray),
          Wall: makeWallSprites(yWallThickness * 2, width, blurAmount, colorArray),
          Paddle: makePaddleSprites(game.paddles.left.width, game.paddles.left.height, blurAmount, colorArray),
          Ball: makeBallSprites(game.ball.radius, blurAmount, colorArray),
          Particle: makeParticleSprites(colorArray),
          Text: makeGameTextSprites(messages, 32, "'Digital-7 Mono', monospace", blurAmount),
          Digit: makeDigitSprites(64, "'Digital-7 Mono', monospace", blurAmount, colorArray)
        };
  display = new Display(canvas, width, height, spriteSheets, fpscounter);
  listenerHandlers(canvas);
  engine.start();
}