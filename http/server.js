const http = require("http")

http
 .createServer()
 .on("request", (req, res) => {
     res.writeHead(200, {'Content-Type' : 'Application/json'})
     res.write(JSON.stringify({"message" : "successful"}))
     res.end()
 })
 .listen(8080, () => console.log("Listening on 8080"))
