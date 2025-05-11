const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 3000;


const app = express();
app.use(cors());

app.get("/api-key", (req, res) =>{
    res.json({apiKey: process.env.API_KEY});
})


app.listen(3000, () => console.log("servidor rodando na porta 3000!"));
