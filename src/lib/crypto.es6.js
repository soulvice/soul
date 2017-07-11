/*
  Soul v2

  @author: Soulvice
  @date: 10-07-2017

*/
import crypto from 'crypto'
import moment from 'moment'

import utils from './utils'

const internal = {};
const external = {};


/*
  constants
*/
/* Defaults */
external.Defaults = {
  encryption: {
    algorithm: 'aes-256-cbc',
    saltBits: 256,
    iterations: 1,
    minPasswordLength: 32,
    pkcs7Padding: true
  },
  integrity: {
    algorithm: 'sha256',
    saltBits: 256,
    iterations: 1,
    minPasswordLength: 32
  },
  ttl: 0,
  timestampSkewSec: 60,
  localtimeOffsetMsec: 0,
};

/* Supported Algorithms */
external.algorithms = {
  'aes-128-ctr': { keyBits: 128, ivBits: 128 },
  'aes-256-cbc': { keyBits: 256, ivBits: 128 },
  'sha256': { keyBits: 256 }
}

external.version = 0x01; // 1
// Aztk.c1
external.header = [ 0x41, 0x7a, 0x74, 0x6b, 0x2e, 0x63, external.version ];

/*
  key generation
*/
external.generateKey = (password, options, callback) => {
  const callbackTick = utils.nextTick(callback);

  if (!password) {
    // error: missing password
    return callbackTick(new Error('missing password'));
  }

  if (!options || typeof options !== 'object') {
    // error: bad options
    return callbackTick(new Error('bad options'));
  }

  const algorithm = external.algorithms[options.algorithm];
  if (!algorithm) {
    // error: unsupported algorithm
    return callbackTick(new Error('unsupported algorithm'));;
  }

  const generate = () => {
    if (Buffer.isBuffer(password)) {
      if (password.length < algorithm.keyBits/8) {
        // error: password to short
        return callbackTick(new Error('key buffer too small'));
      }
      const result = {
        key: password,
        salt: ''
      };
      return generateIv(result);
    }

    if (password.length < options.minPasswordLength) {
      // error: password to short
      return callbackTick(new Error('password string to short'));
    }

    if (options.salt) {
      return generateKey(options.salt);
    }

    if (options.saltBits) {
      return generateSalt()
    }
    // error: missing salt or saltbits
    return callback(new Error('missing salt of saltBits options'));
  }

  const generateSalt = () => {
    const randomSalt = utils.randomBits(options.saltBits);
    if (randomSalt instanceof Error) {
      // error: bad salt generation
      return callbackTick(randomSalt);
    }

    const salt = randomSalt;
    return generateKey(salt);
  }

  const generateKey = (salt) => {
    crypto.pbkdf2(password, salt, options.iterations, algorithm.keyBits/8, 'sha1', (err, devKey) => {
      if (err) {
        console.log('derp')
        return callback(err);
      }

      const result = {
        key: devKey,
        salt
      }

      return generateIv(result);
    });
  }

  const generateIv = (result) => {
    if (algorithm.ivBits && !options.iv) {
      const randomIv = utils.randomBits(algorithm.ivBits);
      if (randomIv instanceof Error) {
        return callbackTick(randomIv);
      }

      result.iv = randomIv;
      return callbackTick(null, result);
    }

    if (options.iv) {
      result.iv = options.iv;
    }

    return callbackTick(null, result);
  }

  generate();
}

/*
  PKCS #7 Padding
*/
external.pkcs7 = {};
external.pkcs7.pad = (data) => {
  let remainder = 16 - (data.length % 16);
  const buff = Buffer.alloc(data.length+remainder, data);
  for (let i=0; i<remainder; i++) {
    buff.writeInt8(remainder, data.length+i);
  }
  return buff;
}

external.pkcs7.unpad = (data) => {
  const trimChar = data.readInt8(data.length-1);
  if (trimChar > 16) { return null; }
  const trimLength = data.length - trimChar;
  return data.slice(0, trimLength);
}


/*
  encryption
*/
external.encrypt = (password, options, data, cb) => {
  external.generateKey(password, options, (err, key) => {
    if (err) {
      return cb(err);
    }

    const cipher = crypto.createCipheriv(options.algorithm, key.key, key.iv);
    let tmpData = data;
    if (options.pkcs7Padding) {
      tmpData = external.pkcs7.pad(data);
    }
    const encBuf = Buffer.concat([ cipher.update(tmpData), cipher.final() ]);

    cb(null, encBuf, key);
  });
}


/*
  decryption
*/
external.decrypt = (password, options, data, cb) => {
  external.generateKey(password, options, (err, key) => {
    if (err) {
      return cb(err);
    }

    const decipher = crypto.createDecipheriv(options.algorithm, key.key, key.iv);
    let decBuf = Buffer.concat([ decipher.update(data), decipher.final() ]);

    if (options.pkcs7Padding) {
      decBuf = external.pkcs7.unpad(decBuf);
    }

    cb(null, decBuf);
  });
}

/*
  HMAC
*/
external.hmacWithPassword = (password, options, data, cb) => {
  external.generateKey(password, options, (err, key) => {
    if (err) {
      return cb(err);
    }

    const hmac = crypto.createHmac(options.algorithm, key.key).update(data);

    const result = {
      digest: hmac.digest(),
      salt: key.salt
    }

    return cb(null, result);
  });
}

/*
  normalize password
*/
internal.normalizePassword = (password) => {

    const obj = {};

    if (password instanceof Object &&
        !Buffer.isBuffer(password)) {

        obj.id = password.id;
        obj.encryption = password.secret || password.encryption;
        obj.integrity = password.secret || password.integrity;
    }
    else {
        obj.encryption = password;
        obj.integrity = password;
    }

    return obj;
};

/*
  seal
*/
external.seal = (object, password, options, callback) => {
  const now = parseInt(moment().format('X') + (options.localtimeOffsetMsec || 0), 10);
  const callbackTick = utils.nextTick(callback);

  // serialize object
  const objectString = internal.stringify(object);
  if (objectString instanceof Error) {
    return callbackTick(objectString);
  }

  // obtain password, move towards key-exchanged password style
  let passwordId = '';
  password = internal.normalizePassword(password);
  if (password.id) {
    if (!/^\w+$/.test(password.id)) {
      return callbackTick(new Error('Invalid Password id'));
    }
    passwordId = password.id;
  }

  // encrypt object string
  external.encrypt(password.encryption, options.encryption, objectString, (err, encrypted, key) => {
    if (err) {
      return callback(err);
    }

    const expiration = (options.ttl ? now + options.ttl: 0);

    let optionsBit = Buffer.alloc(1);
    // 1
    // 2
    optionsBit[0] |= (passwordId !== '') ? 4 : 0;
    optionsBit[0] |= (expiration !== 0) ? 8 : 0;
    // 16
    // 32
    // 64
    // 128
    let passwordIdBuf = null;
    if (passwordId !== '') {
      passwordIdBuf = Buffer.alloc(passwordId.length+1);
      passwordIdBuf.writeInt8(passwordId.length);
      passwordIdBuf.write(passwordId, 1, passwordId.length, 'utf8');
    }else{ passwordIdBuf = Buffer.alloc(0); }

    let expirationBuf = null;
    if (expiration !== 0) {
      expirationBuf = Buffer.alloc(8);
      expirationBuf.writeDoubleLE(expiration);
      console.log('set expiration:', expiration);
    }else{ expirationBuf = Buffer.alloc(0); }

    const macBaseBuffer = Buffer.concat([
      Buffer.from(external.header),     // header
      optionsBit,                       // options
      passwordIdBuf,                    // passwordId
      key.salt,                         // encryption-salt
      key.iv,                           // encryption-iv
      encrypted,                        // encrypted data
      expirationBuf                     // expiration
    ]);

    external.hmacWithPassword(password.integrity, options.integrity, macBaseBuffer, (err, mac) => {
      if (err) {
        return callback(err);
      }

      // [prefix][options][password-id][encryption-salt][encryption-iv][encrypted-data][expiration][hamc-salt][hmac]
      const sealed = Buffer.concat([ macBaseBuffer, mac.salt, mac.digest ]);
      return callback(null, sealed);
    });
  })
}

/*
  unseal

  NOTE: Assume data is always a buffer
*/
external.unseal = (data, password, options, callback) => {
  const now = parseInt(moment().format('X') + (options.localtimeOffsetMsec || 0), 10);
  const callbackTick = utils.nextTick(callback);

  const encryptionAlgorithm = external.algorithms[options.encryption.algorithm];
  const integrityAlgorithm = external.algorithms[options.integrity.algorithm];

  let pos = 0;
  const prefix = data.slice(pos, pos+7);
  pos+= 7;
  const optionBit = data.slice(pos, pos+1);
  pos += 1;

  let passwordId = null;
  if ((optionBit[0] & 4) === 4) { // has password ID
    // maybe a passwordId length byte?.... max length 255 characters?....
    const passwordIdSize = data.readInt8(pos);
    pos += 1;
    passwordId = data.slice(pos, pos+passwordIdSize); //i have no idea how long the password ID is?.....
    pos += passwordId.length;
  }else{ passwordId = Buffer.alloc(0) ;}

  const salt = data.slice(pos, pos+options.encryption.saltBits/8);
  pos += options.encryption.saltBits/8
  const iv = data.slice(pos, pos+encryptionAlgorithm.ivBits/8);
  pos += encryptionAlgorithm.ivBits/8;

  let oldPos = pos;
  // Changes to end
  pos = data.length;
  // HMAC is last and always has the same size  depending on the algorithm
  const hmac = data.slice(pos-integrityAlgorithm.keyBits/8, pos);
  pos -= integrityAlgorithm.keyBits/8;
  const hmacSalt = data.slice(pos-integrityAlgorithm.keyBits/8, pos);
  pos -= integrityAlgorithm.keyBits/8;

  let expiration = null;
  if ((optionBit[0] & 8) === 8) { // has expiration
    expiration = data.slice(pos-8, pos);
    pos -= 8;
  }else{ expiration = Buffer.alloc(0); }

  const encrypted = data.slice(oldPos, pos); // once decrypted can verify the data is a with mod 16  || mod 16 + 1 with the last val zero

  // begins validation tests
  const macBaseBuffer = data.slice(0, data.length-(hmac.length+hmacSalt.length));

  // prefix check
  if (Buffer.compare(prefix, Buffer.from(external.header))) {
    return callbackTick(new Error('wrong prefix header'));
  }

  // check expiration
  if ((optionBit[0] & 8) === 8) {
    expiration = expiration.readDoubleLE(0);
    console.log('is expired:', expiration <= now, expiration, now);
    if (expiration <= (now - (options.timestampSkewSec * 1000))) {
      return callbackTick(new Error('Expired seal'));
    }
  }

  // Obtain password
  if (password instanceof Object &&
      !(Buffer.isBuffer(password))) {

      password = password[passwordId.toString('utf8') || 'default'];
      if (!password) {
          return callbackTick(new Error('Cannot find password: ' + passwordId));
      }
  }
  password = internal.normalizePassword(password);

  // check hmac
  const macOptions = utils.clone(options.integrity);
  macOptions.salt = hmacSalt;
  external.hmacWithPassword(password.integrity, macOptions, macBaseBuffer, (err, mac) => {
    if (err) {
      return callback(err);
    }

    if (!utils.fixedTimeComparisonBuffer(mac.digest, hmac)) {
      return callback(new Error('bad hmac value'))
    }

    // decryption
    const decryptOptions = utils.clone(options.encryption);
    decryptOptions.salt = salt;
    decryptOptions.iv = iv;

    external.decrypt(password.encryption, decryptOptions, encrypted, (err, decrypted) => {
      const decUTF8 = decrypted.toString('utf8');

      let object = null;
      try {
        object = JSON.parse(decUTF8);
      }catch(e) {
        return callback(new Error('Failed parsing seal object JSON: '+e.message));
      }

      return callback(null, object);
    });
  });
}

/*
  internals
*/
internal.stringify = (object) => {
  try {
    return JSON.stringify(object);
  }catch(e) {
    return new Error('Failed to stringify object: ' + e.message);
  }
}

Object.keys(external).forEach(e => {
  Object.defineProperty(exports, e, {
    value: external[e]
  });
});

export default external;
