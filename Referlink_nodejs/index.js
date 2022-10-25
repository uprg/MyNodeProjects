const express = require("express")
const app = express()
const { v4: uuidv4 } = require('uuid')
const {MongoClient} = require("mongodb")
const port = process.env.PORT || 8080
require("dotenv").config()

app.use(express.urlencoded({"extended" : true}))
app.set("view engine", "ejs")
app.use(express.json())

const client = new MongoClient(process.env.CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })



connect().catch(e => console.error)

app.get("/users", async (req, res) => {
    try{
        let result = await client.db(process.env.DATABASE).collection(process.env.COLLECTION).find().toArray()
        res.json(result)
    }
    catch (e){
        res.json({message : "error occured"})
    }
})

app.get("/payment/:userid", async (req, res) => {
    try{
        await client.db(process.env.DATABASE).collection(process.env.COLLECTION).updateOne({_id : req.params.userid}, {$set : {isPaymentMade : true}})
        let found = await client.db(process.env.DATABASE).collection(process.env.COLLECTION).findOne({_id : req.params.userid})
        console.log(found.ReferredUser)
        await client.db(process.env.DATABASE).collection(process.env.COLLECTION).updateOne({Name : found.ReferredUser}, { $inc : {TotalEarnings : 10}})
        res.json({message : "Done"})
    }
    catch(e){
        res.json({message : "error occured"})
        //console.error(e)
    }
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", async (req, res) => {
    let ReferredUser = req.body.refer
    if (ReferredUser === ""){
        ReferredUser = null
    }
    let _id = uuidv4()
    let Name = req.body.name
    let Email = req.body.email
    let isPaymentMade = false
    let TotalEarnings = 0
    let user_data = {_id, Name, Email, ReferredUser, isPaymentMade, TotalEarnings}
    try{
        await client.db(process.env.DATABASE).collection(process.env.COLLECTION).insertOne(user_data)
        res.json({message : "Done"})
    }
    catch(e){
        res.json({message : "error occured"})
    }
})

async function connect(){
    await client.connect()
}

app.listen(port)