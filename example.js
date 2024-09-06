const express = require('express');
const cors = require('cors');
const { 
  generateJwtToken,
  blockPostmanRequests, // optional
  DecryptRequest,
  verifyToken,
  ApplySecretKey,
  ApplyCacheTime
} = require('@shivamycodee/confession')
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 
app.use(verifyToken);
app.use(blockPostmanRequests);

ApplySecretKey('i3ifjnqwfin-2q938in2')
ApplyCacheTime(40); // 40 seconds...

app.get('/generateJWT/:mixer?',(req,res)=>{

    try{
        let input = req?.params;
        let token = generateJwtToken(input);
        if(token?.status == 403) return res.status(403).json({ error: token.message });
        return res.send(token)
    }catch(e){
        console.log(e)
        return res.status(403).json({ error: 'generateJWT requests are not allowed' });
    }
})

app.post('/checkData',(req,res)=>{
    let encryptedData =  req.body.encryptedData;
    let decryptedPayload = DecryptRequest(encryptedData);
    res.send(decryptedPayload)
})


app.get('/', (req, res) => {
    res.send('DEAD WORLD CODE!');
    });

   app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}... 👑`);
  });
  
