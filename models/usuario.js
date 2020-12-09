const mongoose = require("mongoose");

var user= new mongoose.Schema({
    nombre: String,
    apellido: String,
    pais: String,
    manilla : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "manillas"
        }
      ],
    telefono : String,
    edad: Number,
    vehiculo: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "vehiculos"
        }
      ],
    estado : String,
    informes: Object
})

module.exports = mongoose.model("Usuario", user);
