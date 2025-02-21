import crypto from 'crypto';

// generating temp jwt token string
console.log(crypto.randomBytes(64).toString('hex'));