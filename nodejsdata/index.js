const express = require("express")
const app = express()

// express.json() parses incoming data in json if it is in json object
// means you can't send data in form data format
app.use(express.json()).post("/data", (req, res) => {
    let a = req.body
    return res.json(a)
}).listen(8080)