const mongoose = require("mongoose");

var cuenta = new mongoose.Schema({
    usuario: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "usuarios"
        }
      ],
    administrador: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "admins"
        }
    ],
    correo : String,
    clave : String,
    rol : Number
})

module.exports = mongoose.model("Cuenta", cuenta);