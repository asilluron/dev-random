const INIT_BYTE_SIZE = 32; // 256 bits
const MAX_BLOCKS = 65536; // 2 ^ 16
const EventEmitter = require("events");
var aesjs = require("aes-js");
const crypto = require("crypto");
const LocalCrypto = require('./Crypto');

// @flow
class PRNG extends EventEmitter {
	constructor() {
		super();
		this.localCrypto = new LocalCrypto(INIT_BYTE_SIZE * 4);
		this.localCrypto._accumulate();
		this.key = Buffer.from(new ArrayBuffer(INIT_BYTE_SIZE))
		this.currentCounter = 0;
		this.seed = null;
		this.localCrypto.on('full', () => {
			this.localCrypto.randomFillSync(this.key);
			this.reseed();
			this.emit('ready');
		});
		
		
       
        this.on('closeBlock', () => {
            this.reseed();
            this.random();
        })
       
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
        const randomPool = Buffer.from(new ArrayBuffer(MAX_BLOCKS));
		crypto.randomFillSync(randomPool);
		for (let i = 0; i < MAX_BLOCKS; i++) {
			const bufferSlice = randomPool.slice(i * 16, (i * 16) + 16);
            const arrBlockView = new Uint8Array(bufferSlice);
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
