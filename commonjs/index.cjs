const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const cacheFilePath = path.join(__dirname, 'cache-confession', 'cache.json');
const cacheFolderPath = path.join(__dirname, 'cache-confession');


let SECRET_KEY = null;
let JWT_TOKEN_EXPIRE = 0; // time in seconds && cache clean time...

function blockPostmanRequests(req, res, next) {
  const userAgent = req.get("User-Agent");
  if (userAgent && userAgent.includes("Postman")) {
    return res.status(403).json({ error: "Postman requests are not allowed" });
  }
  next();
}

const StoreCache = (hash) => {

  try{

    let currentTime = new Date().getTime();
    let doExist = fs.existsSync(cacheFilePath);
    if (doExist) {
      let fileData = fs.readFileSync(cacheFilePath);
      let data;
      if (fileData?.length > 0) data = JSON.parse(fileData);
      else data = [];
      data.push({ hash: hash, time: currentTime });
      fs.writeFileSync(cacheFilePath, JSON.stringify(data));
    } else {
      fs.mkdirSync(cacheFolderPath);
      fs.writeFileSync(
        cacheFilePath,
        JSON.stringify([
          {
            hash: hash,
            time: currentTime,
          },
        ])
        );

      }
      
    }catch(e){
      console.log('store cache err : ',e)
    }
      
};

const ApplySecretKey = (key) => {
  SECRET_KEY = key;
};

const ApplyCacheTime = (time) => {
  JWT_TOKEN_EXPIRE = time;
};

async function verifyToken(req, res, next) {
  let requestEndpoint = req.originalUrl.split("/")[1].toLowerCase();

  if (
    // requestEndpoint === "generatejwt" ||
    // requestEndpoint == "favicon.ico" ||
    !requestEndpoint ||
    req.method === "GET"
  )
    return next();

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Unauthorized request");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    let hash = req.body.encryptedData;
    let response = doHashExist(hash);
    if (response.flag) return res.status(404).send({ error: response.message });
    StoreCache(hash);
    req.decoded = decoded;
    next();
  } catch (err) {
    res.status(403).send("Forbidden");
  }
}

const doHashExist = (hash) => {
  let doExist = fs.existsSync(cacheFilePath);

  let decryptHash = DecryptRequest(hash);
  let reqTime = decryptHash.timestamp;
  let currentTime = new Date().getTime();
  if (currentTime - reqTime > JWT_TOKEN_EXPIRE * 1000) {
    return { flag: true, message: "Hacker Using Old EncryptPayload Hash" };
  }

  if (doExist) {
    let fileData = fs.readFileSync(cacheFilePath);
    let data = JSON.parse(fileData);
    if (data?.length == 0) return false;
    let doExist = data.find((item) => {
      return item.hash === hash;
    });

    if (doExist) return { flag: true, message: "Replay Attack Detected" };
    else return { flag: false };
  }

  return false;
};

const DecryptRequest = (encryptedPayload) => {
  let bytes = CryptoJS.AES.decrypt(
    decodeURIComponent(encryptedPayload),
    SECRET_KEY
  );
  let payload0 = bytes.toString(CryptoJS.enc.Utf8);
  payload0 = JSON.parse(payload0);
  return payload0;
};

function generateJwtToken(payload) {
  let payloadObject;

  if (!SECRET_KEY)
    return {
      status: 403,
      message: "Please Set Secret Key First",
    };

  if (JWT_TOKEN_EXPIRE == 0)
    return {
      status: 403,
      message: "Please Set Cache Time First",
    };

  if (!payload) payload = { payload: "No payload provided" };

  if (typeof payload === "string") {
    try {
      payloadObject = JSON.parse(payload);
    } catch (error) {
      payloadObject = { payload: payload };
    }
  } else {
    payloadObject = payload;
  }

  const token = jwt.sign(payloadObject, SECRET_KEY, {
    expiresIn: JWT_TOKEN_EXPIRE,
  });

  return {
    status: 200,
    message: "Token Generated",
    token,
  };
}

const DeleteOldCache = () => {
  let currentTime = new Date().getTime();
  let doExist = fs.existsSync(cacheFilePath);

  if (doExist) {
    let fileData = fs.readFileSync(cacheFilePath);
    let data = JSON.parse(fileData);
    let newData = data.filter((item) => {
      return currentTime - item.time < JWT_TOKEN_EXPIRE * 1000;
    });
    fs.writeFileSync(cacheFilePath, JSON.stringify(newData));
  }
};

setInterval(DeleteOldCache, 1000);

module.exports = {
  DeleteOldCache,
  generateJwtToken,
  blockPostmanRequests,
  DecryptRequest,
  doHashExist,
  verifyToken,
  ApplySecretKey,
  SECRET_KEY,
  ApplyCacheTime,
};
