class ImageManager {
  constructor() {
    this._imageLib = {};
  }
  
  load(name, src) {
    let record = {
      image: new Image()
    }
    record.promise = new Promise((resolve, reject) => {
      record.image.addEventListener('load', e => {
        resolve(record.image);
      }, { capture: false, once: true });
    });
    record.image.src = src;
    this._imageLib[name] = record;
  }
  
  async getImage(name) {
    let record = this._imageLib[name];
    if (record == undefined) return null; // image record not found
    else return record.promise;
  }
}


class Singleton {
  constructor() {
    this._instance = null;
  }
  
  get instance() {
    if (this._instance == null) this._instance = new ImageManager();
    return this._instance;
  }
}

export default (new Singleton()).instance;
