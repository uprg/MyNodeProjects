// mongodb connection example through promises
// lib defined
// express app created 
const {MongoClient} = require("mongodb")
const express = require("express")
const app = express()


// a simple get request
app.get("/", async (req, res) => {
    // call connection function
    // connection function returns a promise
    const db = await connection()
    // get the collection
    const collection = db.collection("collection name")
    // the find method gives a db cursor 
    // on that cursor with get methods that returns promise
    // like next, toArray
    const result = collection.find({})
    //with next
    //console.log(await result.next())
    //console.log(await result.next())
    //with toArray
    //console.log(await result.toArray())
    // also can be written as
    // if we want to use find and toArray at a time
    //console.log(await collection.find().toArray())
    const final_result = await result.toArray()
    res.json({all_collections : final_result})
}
)

// listening on port 8080
app.listen(8080)


// connection function define 
async function connection(){
    const client = new MongoClient("uri of connection")
    try{
        await client.connect()
        const db = client.db("db name")
        return db
    }
    catch (e){
        console.error(e)
    }
}

// in this example we never close db connection
// because we are returning it and using it
// if we close it . we won't be able to do it

// other possiblity is we can get collection from db
// in connection function and return collections
// after we use find and toArray on the collection
// in this case we can close connection 
// as we dont need it now .
// as we got all data/collections