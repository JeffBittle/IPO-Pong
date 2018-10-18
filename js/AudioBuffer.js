class AudioBuffer {
  constructor(_context, _urls) {
    this.context = _context;
    this.urls = _urls;
    this.buffer = [];
    this.loaded_ = false;
    this.loadBuffer();
  }

  loadSound(_url, _index) {
    const request = new XMLHttpRequest();

    request.open("get", _url, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
      this.context.decodeAudioData(request.response,
        function(_buffer) {
          this.buffer[_index] = _buffer;
          if(_index == this.buffer.length - 1) {
            this.loaded();
          }
        }.bind(this));
    }.bind(this);
    request.send();
  }

  loadBuffer() {
    this.urls.forEach((_url, _index) => {
      this.loadSound(_url, _index);
    });
  }

  loaded() {
    this.loaded_ = true;
  }

  get isLoaded() {
    return this.loaded_;
  }

  getSound(_index) {
    return this.buffer[_index];
  }
}