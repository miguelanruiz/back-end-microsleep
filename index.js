/*const axios = require("axios")
axios.get("https://api.openbrewerydb.org/breweries")
.then(response => {
    console.log(response)
    console.log(response.data.url)
    console.log(response.data.explaniation)
}).catch(error =>{
    console.log("Error")
})*/
/*const https = require('https');
https.get('https://api.openbrewerydb.org/breweries', (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    console.log(data);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});*/
/*var fs = require("fs") 
console.log("Hola dede Node")
fs.readFile("package.json",function(err,data){
    if(err){
        return console.log("Error")
    }
    console.log(data.toString())
    console.log("Exito de lectura")
})
var a = 10
console.log(a)
a = a + 10

for(var i = 0; i<10 ;i++){
    a++
    //console.log(a)
}

console.log("Terminado")*/
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require('cors')

const PORT = process.env.PORT || 5002

app.use(bodyParser.json())
app.use(cors())

const router = require("./router.js")
app.use("/api", router)
app.listen(PORT, () => console.log("Server listen on: "+PORT))