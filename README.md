# @shivamycodee/confession

A secure communication package for Express.js applications to prevent replay attacks.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the package using npm:

```bash
npm install @shivamycodee/confession
```

## Features

- JWT token generation and verification
- Request encryption and decryption of post request only.
- Protection against Postman requests (optional)
- Configurable secret key and cache time
- Easy integration with Express.js applications
- Built using [bun](https://bun.sh/)

## Usage

Here's an example of how to use the `@shivamycodee/confession` package in Node.js application:

# Install this packges for your server code...

```javascript
const express = require('express');
const cors = require('cors');
const { 
  generateJwtToken,
  blockPostmanRequests,
  DecryptRequest,
  verifyToken,
  ApplySecretKey,
  ApplyCacheTime
} = require('@shivamycodee/confession')

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(express.json()); 


app.use(verifyToken);  // middleware to protect from Replay attack, DOS and DDOS attack.
app.use(blockPostmanRequests); // Optional: Remove if you want to allow Postman requests

// Configure the package
ApplySecretKey('i3ifjnqwfin-2q938in2') // Set a private key (mandatory)
ApplyCacheTime(40); // set time (in seconds) for JWT expire time.

// Route to generate JWT token
app.get('/generateJWT/:mixer?', (req, res) => {
    try {
        let input = req?.params;
        let token = generateJwtToken(input);
        if (token?.status == 403) return res.status(403).json({ error: token.message });
        return res.send(token)
    } catch (e) {
        console.log(e)
        return res.status(403).json({ error: 'generateJWT requests are not allowed' });
    }
})

// exampler post request.
app.post('/checkData', (req, res) => {
    let encryptedData = req.body.encryptedData;
    let decryptedPayload = DecryptRequest(encryptedData);
    res.send(decryptedPayload)
})

// Example route
app.get('/', (req, res) => {
    res.send('WELCOME TO CONFESSION!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
```


Here is how you have to wrap your call from client side for JWT TOKEN & Payload Encryption:

```javascript

import {encryptPayload,ApplySecretKey} from '@shivamycodee/confession'

const SECRET_KEY = 'i3ifjnqwfin-2q938in2';
ApplySecretKey(SECRET_KEY);


  const getJWTToken = async(str)=>{
    try{
        const response = await axios.get(`http://localhost:3000/generateJWT/${str}`);
        let token = response.data;
        return token;
    }catch(e){
        console.error('getJWTToken err : ',e)
    }

}

// exmpalry call to server...

const payload = {
            name:'major',
            value: '12.233.545.65',
}

const checkData = async()=>{
    try{
        let str = new Date().getTime().toString();
        let response = await getJWTToken(str); // fetch jwt token.
        let token = response.token;

        let encryptedData = encryptPayload(payload);  // encrypt your payload.

       await axios.post('http://localhost:3000/checkData',{encryptedData},{
            headers:{
                'Authorization':`Bearer ${token}`,
            }
        })
    }catch(e){
        console.error('err in checkData...',e)
    }
}


```
### Middleware

- `verifyToken`: Middleware to verify JWT tokens in incoming requests.
- `blockPostmanRequests`: Middleware to block requests from Postman (optional).

### Functions

- `generateJwtToken(input)`: Generates a JWT token based on the provided input.
- `DecryptRequest(encryptedData)`: Decrypts the encrypted data sent in requests.
- `ApplySecretKey(key)`: Sets the secret key used for encryption/decryption.
- `ApplyCacheTime(seconds)`: Sets the cache time for generated tokens.

## Best Practices

1. Always use HTTPS in production to ensure encrypted communication.
2. Keep your secret key secure and don't expose it in your codebase.
3. Regularly rotate your secret keys.
4. Adjust the cache time based on your security requirements.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Upcomming updates

1. Support to both CommonJS and ES6 modules. (✅)
2. More type of request security if needed.

## License

This project is licensed under the MIT License.