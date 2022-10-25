const express = require("express")
const app = express()

// /get one has data from query parameters
// /get1/:name has data path variables or path parameters
app.get("/get",(req, res) => {
    // get query parameters . which starts with ? . example : /?name=john
    // "&" can be used in sending multiple query strings. example : /?name=john&age=22
    let a = req.query 
    return res.json({msg : a})
}).get("/get1/:name", (req, res) => {
    // get the url variable with ":". example /:name .
    let a = req.params
    return res.json(a)
}).listen(8080)