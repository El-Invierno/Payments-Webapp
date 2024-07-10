const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors()); 
app.use(express.json()); // body-parser that allows the server to parse the JSON.

const rootRouter = require('./routes/index')

app.use('/api/v1',rootRouter);


app.listen(3000,(req,res)=>{
    console.log("Server listening on port 5000.");
});