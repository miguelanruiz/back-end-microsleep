const mongoose = require("mongoose");

var admin = new mongoose.Schema({
    id: Number,
    nombre: String,
    apellido: String,
    pais: String,
    usuarios :[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "usuarios"
        }
      ],
    telefono : String,
    edad: Number,
    estado: String,
    informes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "informes"
        }
      ],
})

module.exports = mongoose.model("Admin", admin);