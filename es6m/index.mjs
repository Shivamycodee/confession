// es6m/index.js
import CryptoJS from 'crypto-js';

let SECRET_KEY = null;

const ApplySecretKey = (key) => {
  if(!key) throw new Error('Key is required');
  SECRET_KEY = key;
};

const encryptPayload = (payload) => {
  if(!SECRET_KEY) throw new Error('Please set a secret key first using ApplySecretKey()');
  if(!payload) throw new Error('Payload is required');
  let timestamp = new Date().getTime();
  payload = { payload, timestamp };
  if (typeof payload !== 'object') payload = JSON.stringify(payload);
  let encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), SECRET_KEY).toString();
  encryptedPayload = encodeURIComponent(encryptedPayload);
  return encryptedPayload;
};

export {
  encryptPayload,
  ApplySecretKey,
};
