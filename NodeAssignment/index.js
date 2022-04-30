const express = require("express")
const app = express()
const validator = require("email-validator")
const { v4: uuidv4 } = require('uuid')
const nodeoutlook = require('nodejs-nodemailer-outlook')
const { MongoClient } = require("mongodb")
const bcrypt = require('bcrypt')
const port = process.env.PORT || 8080
require("dotenv").config()

app.use(express.json())


const client = new MongoClient(process.env.URI)






app.get("/users", async (req, res) => {
    try{
        await client.connect()
        let users = await client.db(process.env.DB).collection(process.env.COLLECTION).find({}).toArray()
        res.json(users)
    }
    catch (e){
        console.error(e)
    }
})


app.post("/login", async (req, res) => {
    if (validator.validate(req.body.email || req.body.email === " " || req.body.password === " ")){
        let id = uuidv4()
        let email = req.body.email
        let password = req.body.password
        let salt = await bcrypt.genSalt()
        let hash_password = await bcrypt.hash(password, salt)
        let data = {"_id" : id, email, password : hash_password}

        nodeoutlook.sendEmail({
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            },
            from: process.env.USER,
            to: email,
            subject: 'Welcome Message',
            text: "Welcome to User API",  
        })

        try{
            await client.connect()
            await client.db(process.env.DB).collection(process.env.COLLECTION).insertOne(data)
            res.json({"message" : "success"})
        }
        catch (e){
            console.error(e)
        }
    }
    else{
        res.json({"error":"Invalid email"})
    }
})

app.listen(port)