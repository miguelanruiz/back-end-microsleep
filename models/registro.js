const mongoose = require("mongoose");

var registro =  new mongoose.Schema({
    id_manilla : String,
    acelerometro : String,
    ppm: Number,
    cuando: String,
    lat: Number,
    lon: Number,
    fecha : Date,
    duracion: Number,
    ubicacion : String,
    bateria : Number
})

module.exports = mongoose.model("Registro", registro);