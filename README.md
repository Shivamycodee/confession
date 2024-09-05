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
- Request encryption and decryption
- Protection against Postman requests (optional)
- Configurable secret key and cache time
- Easy integration with Express.js applications

## Usage

Here's an example of how to use the `@shivamycodee/confession` package in an Express.js application:

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
app.use(verifyToken);
app.use(blockPostmanRequests); // Optional: Remove if you want to allow Postman requests

// Configure the package
ApplySecretKey('i3ifjnqwfin-2q938in2')
ApplyCacheTime(40);

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

// Route to check and decrypt data
app.post('/checkData', (req, res) => {
    let encryptedData = req.body.encryptedData;
    let decryptedPayload = DecryptRequest(encryptedData);
    res.send(decryptedPayload)
})

// Example route
app.get('/', (req, res) => {
    res.send('DEAD WORLD CODE!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}... 👑`);
});
```

## API Reference

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

## License

This project is licensed under the MIT License.