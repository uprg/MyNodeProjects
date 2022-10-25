const express = require("express")
const app = express()
const validator = require("email-validator")
const { v4: uuidv4 } = require('uuid')
const nodeoutlook = require('nodejs-nodemailer-outlook')
const jwt = require("jsonwebtoken")
const { MongoClient } = require("mongodb")
const port = process.env.PORT || 8080
require('dotenv').config()



app.use(express.urlencoded({"extended" : true}))
app.set("view engine", "ejs")

const uri = process.env.URI 
const client = new MongoClient(uri)


app.get("/", (req, res) => {
    res.render("instructions")
})

app.get("/create", (req, res) => {
    res.render("index")
})





app.get("/all/:token", async (req, res) => {
    try {
        jwt.verify(req.params.token, process.env.SECRETKEY)
        try{
            await client.connect()
            const d = await client.db(process.env.DB).collection(process.env.COLLECTION).find({}).toArray()
            res.json(d)
        }
        catch (e){
            console.error(e)
        }
        res.json()
    } catch (error) {
        res.json({"error" : "invalid token"})
    }
})


app.post("/form", async (req, res) => {
    let email = req.body.email
    if (validator.validate(email))
    {
        let id = uuidv4()
        let name = req.body.name
        let password = req.body.password
        let radio = req.body.radio
        let checkbox = req.body.checkbox
        let date = req.body.date
        let time = req.body.time 
        let number = req.body.number
        let numberslide = req.body.numberslide
        let select = req.body.select
        let file = req.body.file 
        let data = {id, name, email, password, radio, checkbox, date, time, number, numberslide, select, file}
        let token = jwt.sign({ name, email, password }, process.env.SECRETKEY)
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD
            },
            from: process.env.USER,
            to: email,
            subject: 'token',
            text: token,
        })
        try{
            await client.connect()
            await client.db(process.env.DB).collection(process.env.COLLECTION).insertOne(data) 
        }
        catch (e){
            console.error(e)
        }
        res.json({"msg" : "success"})
    }
    else
    {
        res.json({"error" : "invalid email"})
    }
})

app.get("/delete/:id/:token", async (req, res) => {
    try {
        jwt.verify(req.params.token, process.env.SECRETKEY)
        await client.connect()
        await client.db(process.env.DB).collection(process.env.COLLECTION).deleteOne({id : req.params.id})

        res.json({"msg" : "success"})
    } catch (e) {
        res.json({"error" : "invalid token"})
    }
})

app.get("/update/:token", (req, res) => {
    try {
        jwt.verify(req.params.token, process.env.SECRETKEY)
        res.render("form")
    } catch (error) {
        res.json({"error" : "invalid token"})
    }
})



app.post("/form1", async (req, res) => {
    let id = req.body.id
    if (id === "")
    {
        res.json({"error" : "no id provided"})
    }

    let email = req.body.email
    if (validator.validate(email))
    {
        let name = req.body.name
        let radio = req.body.radio
        let checkbox = req.body.checkbox
        let date = req.body.date
        let time = req.body.time 
        let number = req.body.number
        let numberslide = req.body.numberslide
        let select = req.body.select
        let file = req.body.file 
        let data = {name, email, radio, checkbox, date, time, number, numberslide, select, file}
        await client.connect()

        await client.db(process.env.DB).collection(process.env.COLLECTION).updateOne({"id" : id}, {$set : data})
        
        res.json({"msg" : "success"})
    }
    else
    {
        res.json({"error" : "invalid email"})
    }
})



app.listen(port)