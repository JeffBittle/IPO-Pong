class Sound {
  constructor(_context, _buffer) {
    this.context = _context;
    this.buffer = _buffer;
  }

  init(_center, _soundX) {
    this.gainNode = this.context.createGain();
    this.pannerNode = this.context.createStereoPanner();
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.detune.value = (Math.random() * 600) - 300;
    this.pannerNode.pan.value = -1 + (_soundX / _center);
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.pannerNode);
    this.pannerNode.connect(this.context.destination);
    this.gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
  }

  play(_center, _soundX) {
    this.init(_center, _soundX);
    this.source.start(this.context.currentTime);
  }
}