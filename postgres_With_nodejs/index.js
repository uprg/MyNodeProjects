const express = require('express')
const app = express()

const {Client} = require('pg')

app.use(express.json())

const client = new Client({
    'user' : 'postgres',
    'password' : '1234',
    'host' : 'localhost',
    'port' : 5432,
    'database' : 'postgres'
})

connect()

app.get("/todos", async (req, res) => {
    const result = await client.query("select * from Todo")
    res.json(result.rows)
})

app.post("/todos", async (req, res) => {
    try{
        await client.query("insert into Todo (todo) values ($1)", [req.body.todo])
        res.json({"msg" : "success"})
    }
    catch(e){
        console.error(e)
    }
})

app.delete("/todos", async (req, res) => {
    try{
        await client.query("delete from Todo where id = $1" , [req.body.id])
        res.json({"msg" : "success"})
    }
    catch(e){
        console.error(e)
    }
})

// put will search for given identifier and update it
// if the identifier not found . it will create one with provided data
app.put("/todos" , async (req, res) => {
    try{
        await client.query("update Todo set todo=$1 where id = $2" , [req.body.todo, req.body.id])
        res.json({"msg" : "success"})
    }
    catch(e){
        console.error(e)
    }
})

// patch will search for given identifier and update it
// if the identifier not found . it will through exception
app.patch("/todos", async (req, res) => {
    try{
        await client.query("update Todo set todo=$1 where id = $2" , [req.body.todo, req.body.id])
        res.json({"msg" : "success"})
    }
    catch(e){
        console.error(e)
    }
})


async function connect(){
    await client.connect()
}

app.listen(8080)