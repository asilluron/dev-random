const INIT_BYTE_SIZE = 32; // 256 bits
const MAX_BLOCKS = 65536; // 2 ^ 16
const EventEmitter = require("events");
var aesjs = require("aes-js");
const crypto = require("crypto");

// @flow
class PRNG extends EventEmitter {
	constructor() {
		super();
		// Using dataview to avoid Endian problems
		this.key = new DataView(new ArrayBuffer(INIT_BYTE_SIZE));
		crypto.randomFillSync(this.key);
        this.seed = null;
        this.reseed();
        this.on('closeBlock', () => {
            this.reseed();
            this.random();
        })
        this.currentCounter = 0;
	}

	reseed() {
		this.seed = crypto
			.createHash("sha256")
			.update(this.key)
            .digest();
        
            this.currentCounter++;
    }
    
    random() {
        this._generate()
    }

	_generate() {

		var aesCtr = new aesjs.ModeOfOperation.ctr(
			this.seed,
			new aesjs.Counter(this.currentCounter)
		);
        const randomPool = new DataView(new ArrayBuffer(MAX_BLOCKS));
        // From Node.JS, methods like keyboard events, mouse events and file system events
        // can be hard to secure. Using "randomFill", we start off with a cryptographically strong
        // pool of entropy managed at the Kernel level
		crypto.randomFillSync(randomPool);
		for (let i = 0; i < MAX_BLOCKS; i++) {
            const blockView = new DataView(randomPool.buffer, i * 16, 16)
            const arrBlockView = new Uint8Array(blockView.buffer);
			this.emit('newBytes', aesCtr.encrypt(arrBlockView));
        }
        this.emit('closeBlock');
	}

	_read() {
		let chunk;
		while (null !== (chunk = this.cipher.read())) {
			this.emit("newBytes", chunk.toString());
		}
	}
}

module.exports = PRNG;
