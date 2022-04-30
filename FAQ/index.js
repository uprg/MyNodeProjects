const express = require("express")
const app = express()
const { v4: uuidv4 } = require('uuid')
const {MongoClient} = require("mongodb")
const jwt = require("jsonwebtoken")
const port = process.env.PORT || 8080
//require('dotenv').config()


app.use(express.urlencoded({"extended" : true}))
app.set("view engine", "ejs")

//const client = new MongoClient(process.env.CONNECT)




app.get("/", (req, res) => {
    res.render("home")
})


app.get("/createfaq", (req, res) => {
    res.render("form")
})

app.post("/result", async (req, res) => {
    let id = uuidv4()
    let question = req.body.question
    let answer = req.body.answer
    if (question === "" || answer === ""){
        res.json({error : "invalid input"})
    }
    else{
        let token = jwt.sign({ question, answer}, process.env.SECRETKEY)
        let newfaq = {_id : id, question , answer}
        try{
            await client.connect()
            let result = await client.db(process.env.DATABASE).collection(process.env.COLLECTION).insertOne(newfaq)
            res.json({token})
        }
        catch (e){
            console.error(e)
        }
    }
})

app.get("/faq/:token", async (req, res) =>{
    try{
        jwt.verify(req.params.token, process.env.SECRETKEY)
        try{
            await client.connect()
            let result = await client.db(process.env.DATABASE).collection(process.env.COLLECTION).find().toArray()
            res.json(result)
        }
        catch (e){
            console.error(e)
        }
    }
    catch (e){
        res.json({"error" : "Invalid Token"})
    }
})

app.get("/update", (req, res) => {
    res.render("update")
})

app.post("/updated", async (req, res) => {
    let id = req.body.id
    let question = req.body.question
    let answer = req.body.answer
    let token = req.body.token
    if (id === "" || question === "" || answer === "" || token === ""){
        res.json({error : "invalid input"})
    }
    else{
        let updated = {question, answer}
        try{
            jwt.verify(token, process.env.SECRETKEY)
            try{
                await client.connect()
                let result = await client.db(process.env.DATABASE).collection(process.env.COLLECTION).updateOne({"_id" : id}, {$set : updated})
                res.json({"msg" : "success"})
            }
            catch (e){
                console.error(e)
            }
        }
        catch (e){
            res.json({"error" : "Invalid Token"})
        }
    }
})

app.get("/delete", (req, res) => {
    res.render("delete")
})

app.post("/deleted", async (req, res) => {
    let token = req.body.token
    let id = req.body.id
    if (token === "" || id === ""){
        res.json({"error" : "Invalid Token"})
    }
    else{
        try{
            jwt.verify(token, process.env.SECRETKEY)
            try{
                await client.connect()
                let result = await client.db(process.env.DATABASE).collection(process.env.COLLECTION).deleteOne({_id : id})
                res.json({"msg" : "success"})
            }
            catch (e){
                console.error(e)
            }
        }
        catch(e){
            res.json({"error" : "Invalid Token"})
        }
    }
})

app.listen(port)