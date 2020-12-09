const mongoose = require("mongoose");

var vehiculo = new mongoose.Schema({
    id_vehiculo : String,
    marca : String,
    modelo: String,
    color: String,
    year : Number
})

module.exports = mongoose.model("Vehiculo", vehiculo);