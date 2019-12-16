# /dev/random JS Implementation


## Installation
```
nvm install
```

```
npm install
```

```
npm link
```

## Security
Implementation of this in a real environment should fork and use NPM security audit (at minimum) to monitor aes-js https://www.npmjs.com/package/aes-js

AES-JS does not have any other dependencies, so security audits should be very simple. 

AES-JS is used due to its implementation of CTR mode of AES, which was deprecated in the core NodeJS libraries (crypto).

## Development

```
npm link
```

### Development Usage
```
randomjs
```

After testing, you can rename the `bin` property in `package.json` or re-alias /dev/random (not recommended) 


### Test Entropy (OSX)
```
mkdir tmp
```

```
randomjs > tmp/testoutput
```

```
brew install ent
```

```
cat tmp/testoutput | ent    
```

## Ent Output
Note: there are not strict controls applied to this comparison, but loosely demonstrates a few key readings.

### This implementation

```
Entropy = 7.999994 bits per byte.

Optimum compression would reduce the size
of this 34930688 byte file by 0 percent.

Chi square distribution for 34930688 samples is 274.86, and randomly
would exceed this value 18.76 percent of the times.

Arithmetic mean value of data bytes is 127.4902 (127.5 = random).
Monte Carlo value for Pi is 3.141402262 (error 0.01 percent).
Serial correlation coefficient is 0.000256 (totally uncorrelated = 0.0).
```

### /dev/random/
```
Entropy = 7.999987 bits per byte.

Optimum compression would reduce the size
of this 12798499 byte file by 0 percent.

Chi square distribution for 12798499 samples is 231.68, and randomly
would exceed this value 85.00 percent of the times.

Arithmetic mean value of data bytes is 127.5080 (127.5 = random).
Monte Carlo value for Pi is 3.138638300 (error 0.09 percent).
Serial correlation coefficient is -0.000426 (totally uncorrelated = 0.0).
```


### Going Forward

Given more time, I would move `generate` function to being truly private with Typescript. I'd also add the ability to run this on a browser (using a WASM bridge instead of Crypto lib to source entropy). 