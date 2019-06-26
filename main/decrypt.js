var crypto = require('crypto');
var algorithm = 'aes-256-cbc';
var key;
var iv;

function sizes(cipher) {
  for (let nkey = 1, niv = 0;;) {
    try {
      crypto.createCipheriv(cipher, '.'.repeat(nkey), '.'.repeat(niv));
      return [nkey, niv];
    } catch (e) {
      if (/invalid iv length/i.test(e.message)) niv += 1;
      else if (/invalid key length/i.test(e.message)) nkey += 1;
      else throw e;
    }
  }
}

function compute(cipher, passphrase) {
  let [nkey, niv] = sizes(cipher);
  for (let key = '', iv = '', p = '';;) {
    const h = crypto.createHash('md5');
    h.update(p, 'hex');
    h.update(passphrase);
    p = h.digest('hex');
    let n, i = 0;
    n = Math.min(p.length-i, 2*nkey);
    nkey -= n/2, key += p.slice(i, i+n), i += n;
    n = Math.min(p.length-i, 2*niv);
    niv -= n/2, iv += p.slice(i, i+n), i += n;
    if (nkey+niv === 0) return [key, iv];
  }
}

function decrypt(text, secret) {
  if (!key) {
    var results = compute(algorithm, secret);
    console.log('**** jwtHandler decrypt: key = ' + results[0]);
    console.log('**** jwtHandler decrypt: iv = ' + results[1]);
    key = Buffer.from(results[0], 'hex');
    iv = Buffer.from(results[1], 'hex');
  }
  var dec;
  try {
    var decipher = crypto.createDecipheriv(algorithm, key, iv)
    dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
  }
  catch(err) {
    dec = 'Error: ' + err;
  }
  return dec;
}

var encrypted = 'dec161044376954ca1c55cf0e9857b4a22458a93fdce9bf69ba4cc1d319ab9a548cf11ccc8ac89764cc5a399fc2251855678360f47cc5ef41b6feab4b7778911ad79fc18e41fa7b1395b1b5c46e4483f3a244675d94f491f8400b53f511c8082';

var secret = '3413e684-615d-4391-97c4-60aa17a5ed3e';

console.log(decrypt(encrypted, secret));
