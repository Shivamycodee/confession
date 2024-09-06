// es6m/index.js
import CryptoJS from 'crypto-js';

let SECRET_KEY = null;

const ApplySecretKey = (key) => {
  SECRET_KEY = key;
};

const encryptPayload = (payload) => {
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
