const mongoose = require("mongoose");

var manilla = new mongoose.Schema({
    id_manilla : String,
    modelo: String,
    color: String,
    registros : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "registros"
        }
      ],
})

module.exports = mongoose.model("Manilla", manilla);