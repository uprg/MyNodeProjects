const express = require("express")
const app = express()
const { MongoClient } = require("mongodb")
const uri = "Your mongo connection string"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

app.get("/", async (req, res) => {
    const connet = await connect()
    res.json(connet)
})

connect()

async function connect(){
    try{
        await client.connect()
        const collection = client.db("db").collection("collection")
        const result = await collection.find({}).toArray()
        //console.log(result)
        return result
    }
    catch (e){
        console.error(e)
    }
    finally{
        client.close()
    }
}

app.listen(8080)
