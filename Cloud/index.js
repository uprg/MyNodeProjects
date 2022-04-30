const express = require("express")
const app = express()
const {v4 : uuidv4} = require('uuid')
const port = process.env.PORT || 8080

app.use(express.urlencoded({"extended" : true}))
app.set("view engine", "ejs")

let data = []

app.get("/", (req, res) => {
    res.render("index", { list : data})
})

app.get("/newentry", (req, res) => {
    res.render("form")
})

app.get("/deleteentry", (req, res) => {
    res.render("form1")
})


app.post("/deleteentryid", (req, res) => {
    let id = req.body.id
    for (let i=0; i < data.length; i++)
    {
        if (data[i].id === id)
        {
            data.splice(i, 1)
        }
    }
    res.redirect("/")
})

app.post("/form", (req, res) => {
    let id = uuidv4()
    let name = req.body.name
    let description = req.body.description
    let size = req.body.size
    let entry = {"id": id,"name" : name, "description" : description, "size" : size}
    data.push(entry)
    console.log(id)
    res.redirect("/")
})

app.listen(port)