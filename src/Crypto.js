var aesjs = require("aes-js");
const cp = require("child_process");
const EventEmitter = require("events");

class Crypto extends EventEmitter {
  constructor(initSize) {
    super();
    this.maxSize = initSize;
    this.bufferView = Buffer.from(new ArrayBuffer(initSize));

    this.currentSize = 0;
  }

  randomFillSync(fillBuff) {
    // This should be a blocking operation if the pool is not full, but since we are operating like /dev/random, we may produce less bits if entropy is not ready.
    this.bufferView.copy(fillBuff, 0, 0, fillBuff.length);
    this.currentSize -= fillBuff.length;
    this._accumulate();
  }

  _accumulate() {
    this._sourceEntropy("iostat -Iw 3 ");
    this._sourceEntropy("top -l 1 ");
    this._sourceEntropy("ls -RlacH  /var/log ");
  }

  _sourceEntropy(command) {
    new Promise(resolve => {
      if (this.currentSize >= this.maxSize) {
        this.emit("full");
        return;
      }
      const child = cp.exec(`${command} | shasum -a 256`);
      child.stdout.on("data", data => {
        const dataBytes = aesjs.utils.hex.toBytes(data);
        const dataArray32 = dataBytes.slice(0, 32);
        const buffer = Buffer.from(dataArray32);
        buffer.copy(this.bufferView, this.currentSize);
        this.currentSize += 32;
        resolve();
      });
    }).then(() => this._sourceEntropy(command));
  }
}

module.exports = Crypto;
