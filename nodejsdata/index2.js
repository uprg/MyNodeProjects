const express = require("express")
const app = express()

// when urlencoded has extended = true it uses qs library 
// when urlencoded has extended = false it uses querystring library 
// qs and querystring are mostly similar . its just qs library parse data better
// when we use express.urlencoded() we parse application/x-www-form-urlencoded data
// application/x-www-form-urlencoded data is form data like strings (also I think its includes array and objects)
// I think multipart/form-data requires different library for now not sure
// but multipart/form-data is file upload data and also can be used for form data
// but requires a sperating string . a special type of string 
// which is required in formatting text data when using multipart/form-data
// it might also be used in files upload data too

app.use(express.urlencoded({extended : true})).post("/data", (req, res) => {
    let a = req.body
    console.log(a)
    return res.json(a)
}).listen(8080)