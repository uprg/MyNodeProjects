const { MongoClient } = require("mongodb")
const express = require("express")
const { json } = require("express")
const app = express()


const url = "#"

app.get("/", async (req, res) => {
    const client = new MongoClient(url)
    try{
        await client.connect()
        const collection = client.db("#").collection("#")
        const result = await collection.find({"#" : "#"})
        const result1 = await result.toArray()
        res.json(result1)
    }
    catch(e){
        console.error(e)
    }
    finally{
        await client.close()
    }
})

app.listen(8080)