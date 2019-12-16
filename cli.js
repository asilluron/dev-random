#!/usr/bin/env node
const PRNG = require('./src/PRNG');

const [,, ...args] = process.argv




byteGenerator = new PRNG();

byteGenerator.on('newBytes', bytes => {
    process.stdout.write(bytes);
});

byteGenerator.random();




