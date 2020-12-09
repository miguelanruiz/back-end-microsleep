const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const md5 = require('md5')
const cuenta = require('./models/cuenta')
const usuario = require('./models/usuario')
const manilla = require('./models/manilla')
const vehiculo = require('./models/vehiculo')
const administrador = require('./models/administrador')
const registro = require('./models/registro')

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

//BD Miguel
var connectionString = "mongodb+srv://class:None2933@cluster0.9olyl.mongodb.net/db1?retryWrites=true&w=majority"
//BD Leonardo
//var connectionString = "mongodb+srv://Leonardo:leonr_27@cluster0.shjh0.mongodb.net/db1?retryWrites=true&w=majority"

mongoose.connect(connectionString, {useUnifiedTopology : true, useNewUrlParser : true}, function(err,res){
    if(err){
        console.log(err)
    }
    else{
        console.log("Conectado...")
    }
})

var Account = cuenta
var User = usuario
var Manillas = manilla
var Vehiculos = vehiculo
var Registros = registro
var Admin = administrador
/*
router.use(function(req,res,next){
    if(req.originalUrl == '/api/login/' || req.originalUrl == '/api/register/' || req.originalUrl == '/fill/device/bracelet'){
        next();
    }
    else{
        var token = req.headers['authorization']
        if(!token){
            console.log("Sin token")
            res.status(401).send({
            error: "Es necesario el token de autenticación"
            })
            return
        }
        else{
            token = token.replace('Bearer ', '')

            jwt.verify(token, 'Secret Password', function(err, user) {
                if (err) {
                    console.log("token invalido")
                    res.status(401).send({
                    error: 'Token inválido'
                    })
                } else {
                    console.log("Token valido")
                    next();
            }
            })
        }
    }
})*/

router.post("/register/", (req,res,next) => {
    console.log("Solicitado registrar en: /register/users "+req.body.correo)
    /*Account.find({
        "correo" : req.body.correo
    }).then( data => {
        if(data.length > 0){
            //console.log(data)
            res.send("Cuenta ya registrada")
            console.log("Cuenta ya registrada")
        }
        else {
            req.body.clave = md5(req.body.clave)
            //console.log(req.body.clave);
            var newAccount = new Account(req.body)
            newAccount.save().then(item => {
            console.log("Registro exitoso de cuenta")
            res.send("Registro exitoso de cuenta")
            }).catch(err => {
            console.log("No se pudo registrar la cuenta")
            res.send("No se pudo registrar la cuenta")
            })
        }
    }).catch(err => {
        console.log("Error en consulta")
        res.send("Error en consulta")
    })*/
    Account.find({
        "correo" : req.body.correo
    }).then( data => {
        console.log("entramos")
        if(data.length > 0){
            //console.log(data)
            res.send("Cuenta ya registrada")
            console.log("Cuenta ya registrada")
        }
        else {
            req.body.clave = md5(req.body.clave)
            var tokenData = {
                user: req.body.correo
            }
            console.log("Login Exitoso")
            var token = jwt.sign(tokenData, 'Secret Password', {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            })
            //console.log(req.body.clave);
            var newAccount = new Account(req.body)
            newAccount.save().then(item => {
            console.log("Registro exitoso de cuenta")
            res.send({
                "message": 0,
                id_account: newAccount._id,
                token
            })
            }).catch(err => {
            console.log("No se pudo registrar la cuenta")
            res.send({
                "message": -1
            })
            })
        }
    }).catch(err => {
        console.log("Error en consulta usuario")
        res.send("Error en consulta")
    })
})

router.post("/login/", (req,res,next) => {
    console.log("Solicitado login en: /login/users "+req.body.correo)
    Account.find({
        "correo" : req.body.correo
    }).then( data => {
        if(data.length > 0){
            var password = md5(req.body.clave)
            if(data[0].clave==password)
            {
                var tokenData = {
                    user: req.body.correo
                }
                
                var token = jwt.sign(tokenData, 'Secret Password', {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                 })
                if(data[0].administrador.length == 0){
                    User.findOne({_id : data[0].usuario[0]._id}).then(responseUser => {
                        console.log("Login USER")
                        console.log(data[0].usuario[0]._id)
                        console.log(responseUser)
                        res.status(200).send({
                            user : responseUser.nombre + " " + responseUser.apellido,
                            id : responseUser._id,
                            mail : data[0].correo,
                            rol : data[0].rol,
                            messageOut : 0,
                            token
                        })
                    }).catch(err => {
                            console.log("Hubo un error en la obtencion del usuario::Type")
                            console.log(err)
                            res.send({ 
                                messageOut : 1,
                            message : "Hubo un error en la obtencion del usuario"
                        })
                    })
                }
                else{
                    Admin.findOne({_id : data[0].administrador[0]._id}).then(responseUser => {
                        console.log("Login Admin")
                        console.log(responseUser)
                        res.status(200).send({
                            user : responseUser.nombre + " " + responseUser.apellido,
                            id : responseUser._id,
                            mail : data[0].correo,
                            rol : data[0].rol,
                            messageOut : 0,
                            token
                        })
                    }).catch(err => {
                            console.log("Hubo un error en la obtencion del usuario::Type")
                            console.log(err)
                            res.send({ 
                                messageOut : 1,
                            message : "Hubo un error en la obtencion del usuario"
                        })
                    })
                }
                //res.send("Login Exitoso")
            }else{
                console.log("Error de contraseña")
                res.send("Error de contraseña")
            }  
        }
        else {
            console.log("Cuenta no Existente")
            res.send("Cuenta no Existente")
        }
    }).catch(err => {
        console.log("Error en login")
        res.send("Error en login")
    })
})

router.post("/fill/account/user", (req,res,next) => {
    console.log("Solicitado update en: /fill/account "+req.body.correo)
    //console.log(req.body.correo)
    var responseWS = ""
    var info = req.body
    Account.find({
        "correo" : req.body.correo
    }).then( data => {
        if(data.length > 0){
            var vehiculo_temp = {
                "id_vehiculo" : info.id_vehiculo,
                "marca" : info.marca,
                "modelo": info.modelo,
                "color": info.color,
                "year" : info.year
            }

            var newVehiculo = new Vehiculos(vehiculo_temp)

            newVehiculo.save().then(vehiculoItem => {
            console.log("Registro vehiculo exitoso")
            //res.send("Registro vehiculo exitoso")
            }).catch(err => {
                console.log("No se pudo registrar vehiculo")
                res.send("No se pudo registrar vehiculo")
                return
            })

            var user = {
                "nombre": info.nombre,
                "apellido": info.apellido,
                "telefono" : info.telefono,
                "edad": info.edad,
                "vehiculo": newVehiculo._id,
                "estado" : info.estado,
                "pais" : info.pais
            }

            var newUser = new User(user)
            newUser.save().then(userItem => {
            console.log("Registro exitoso de Usuario")
            //res.send("Registro de Usuario")
            }).catch(err => {
                console.log("No se pudo registrar el usuario")
                res.send("No se pudo registrar el usuario")
                return
            })
            Account.updateOne({"correo":info.correo}, {$set:{"usuario": newUser._id}},function(err, response){
                if (err){
                    console.log("Error en Update")
                    res.send({ "message" : 1})
                }
                else{
                    console.log("Update Exitoso")
                    res.send({ "message" : 0})
                }
                })
        }
        else {
            console.log("No se encontró el usuario")
            res.send("No se encontró el usuario")
        }
    }).catch(err => {
        console.log("Error en consulta")
        res.send("Error en consulta")
    })
})

router.post("/fill/account/admin", (req,res,next) => {
    console.log("Solicitado update en: /fill/account "+req.body.correo)
    //console.log(req.body.correo)
    var responseWS = ""
    var info = req.body
    Account.find({
        "correo" : req.body.correo
    }).then( data => {
        if(data.length > 0){

            var user = {
                "nombre": info.nombre,
                "apellido": info.apellido,
                "telefono" : info.telefono,
                "edad": info.edad,
                "pais": info.pais
            }

            var newUser = new Admin(user)
            newUser.save().then(userItem => {
            console.log("Registro exitoso de Usuario")
            //res.send("Registro de Usuario")
            }).catch(err => {
                console.log("No se pudo registrar el usuario")
                res.send("No se pudo registrar el usuario")
                return
            })

            Account.updateOne({"correo":info.correo}, {$set:{"administrador": newUser._id}},function(err, response){
                if (err){
                    console.log("Error en Update")
                    res.send({ "message" : 1})
                }
                else{
                    console.log("Update Exitoso")
                    res.send({ "message" : 0})
                }
                })
        }
        else {
            console.log("No se encontró el usuario")
            res.send("No se encontró el usuario")
        }
    }).catch(err => {
        console.log("Error en consulta")
        res.send("Error en consulta")
    })
})

router.post("/fill/device/bracelet", (req,res,next) => {
    console.log("Solicitado update en: /fill/device/bracelet "+req.body)
    var info = req.body
    console.log(info.id)
    var when = new Date()
    var registro_temp = {
        "id_manilla" : info.id,
        "acelerometro" : info.acelerometro,
        "ppm": info.ppm,
            "cuando" : Math.floor((Math.random() * 12) + 1)+" "+ monthNames[when.getMonth()],
            "duracion": info.duracion,
            "ubicacion" : info.ubicacion,
            "bateria" : info.bateria,
        "lat": info.lat,
        "lon": info.lon
            }
    console.log( when.getDay()+" "+ when.getMonth())
    var newRegistro = new Registros(registro_temp)
    newRegistro.save().then(braceletItem => {
        console.log("Registro exitoso")
        res.send("Registro exitoso")
    }).catch(err => {
        console.log(err)
        console.log("No se pudo manilla")
        res.send("No se pudo manilla")
    })
})

router.post("/fill/account/bracelet",(req,res,next) =>{
    var requested = req.body;
    console.log(requested)
    /*******************AQUIIII TIENE QUE IR LA COMPROBACION DE LA MANILLA EXISTENTE */
    Manillas.findOne({"acelerometro":"xyz"}).then(bracelet =>{
        console.log(JSON.stringify(bracelet))
        if(bracelet != null){
            res.status(401).send({
                message: "Esta manilla ya se encuentra registrada."
            })
        }else{
            var manilla_temp = {
                "id_manilla" : requested.id_manilla,
            }

            var newManilla = new Manillas(manilla_temp)
           
            newManilla.save().then(braceletItem => {
                console.log("Registro manilla exitoso")
            }).catch(err => {
                console.log("No se pudo registrar manilla")
                res.send("No se pudo registrar manilla")
            })

            User.updateOne({_id : requested.id}, {$push:{"manilla": newManilla._id}},function(err, response){
                if (err){
                    console.log("Error en Update")
                    res.send("Error en Update")
                }
                else{
                    console.log("Update Exitoso")
                    res.send("Update Exitoso")
                }
            })
        }
    }).catch(err =>{
        console.log(err)
        res.send("aqui")
    })
})

router.post("/fill/account/admin/suscribe", async (req,res,next) =>{
    var requested = req.body;
    var users = []
    requested.cars.array.forEach(async (element) => {
        var user = await suscribeUser(element)
        users.push(user)
        console.log(user)
    });
    /*const promises = []
    for(let i ; i < requested.cars.length; i++){
        const mail = i
        promises.push(suscribeUser(mail))
    }
    const users = await Promise.all(promises)*/
    console.log(users);
    console.log("!DONE")
    res.send(requested.cars)
    /*******************AQUIIII TIENE QUE IR LA COMPROBACION DE LA MANILLA EXISTENTE */
})

router.post("/getAccountData/user",(req,res,next) =>{
    var requested = req.body;
    Account.find({"correo": requested.correo}).then(data => {
        if(data.length > 0){
            var id = data[0].usuario;
            var rol = data[0].rol;
            console.log(id)
            User.findOne({_id :id}).then(responseUser => {
                console.log(responseUser)
                res.status(200).send({
                    user : responseUser.nombre + " " + responseUser.apellido,
                    id : responseUser._id,
                    mail : requested.correo,
                    rol : rol
                })
            }).catch(err => {
                    console.log("Hubo un error en la obtencion del usuario::Type")
                    console.log(err)
                    res.send({ 
                    message : "Hubo un error en la obtencion del usuario"
                })
            })
        }
        else{
            res.status(200).send({
                message : "No existen datos de esta cuenta aun."
            })
        }
    }).catch(err =>{
        console.log("Hubo un error en la obtencion cuenta::Type")
        console.log(err)
        res.send({ 
            message : "Hubo un error en la obtencion cuenta"
        })
    })
})

router.post("/getAccountData/admin",(req,res,next) =>{
    var requested = req.body;
    Account.find({"correo": requested.correo}).then(data => {
        if(data.length > 0){
            var id = data[0].administrador;
            var rol = data[0].rol;
            console.log(id)
            Admin.findOne({_id :id}).then(responseUser => {
                console.log(responseUser)
                res.status(200).send({
                    user : responseUser.nombre + " " + responseUser.apellido,
                    id : responseUser._id,
                    mail : requested.correo,
                    rol : rol
                })
            }).catch(err => {
                    console.log("Hubo un error en la obtencion del usuario::Type")
                    console.log(err)
                    res.send({ 
                    message : "Hubo un error en la obtencion del usuario"
                })
            })
        }
        else{
            res.status(200).send({
                message : "No existen datos de esta cuenta aun."
            })
        }
    }).catch(err =>{
        console.log("Hubo un error en la obtencion cuenta::Type")
        console.log(err)
        res.send({ 
            message : "Hubo un error en la obtencion cuenta"
        })
    })
})

router.get('/secure', (req, res) => {
    var token = req.headers['authorization']
    if(!token){
        res.status(401).send({
          error: "Es necesario el token de autenticación"
        })
        return
    }

    token = token.replace('Bearer ', '')

    jwt.verify(token, 'Secret Password', function(err, user) {
      if (err) {
        res.status(401).send({
          error: 'Token inválido'
        })
      } else {
        res.send({
          message: 'You are free'
        })
      }
    })
})

router.get("/tools/bracelet/report/user/:name",(req, res, next) => {
    var payload = {
        "mensaje":"ok"
    }
    Account.find({}).then(data => {
        console.log(data)
        res.send(data)
    }).catch(err =>{
        payload.mensaje("Hubo un error en la obtencion de los datos")
        console.log(payload.mensaje)
        res.send(payload.mensaje)
    })
})

router.get("/tools/bracelet/report/admin/:name",(req, res, next) => {
    var payload = {
        "mensaje":"ok"
    }
    Admin.findOne({_id : req.params.name}).then(data => {
        if(data != null){
            console.log("data")
            User.find({_id : { $in: data.usuarios}}).then(users =>{
                if(users != null){
                    console.log("Vamos bien")
                    console.log(users)
                    res.send(users)
                }else{
                    console.log("no existe")
                    console.log(users)
                    res.send(users)
                }
            }).catch(err =>{
                console.log("mal")
            })
        }else{   
            console.log("Aqui")
            res.send(data.usuarios)
        }
    }).catch(err =>{
        payload.mensaje("Hubo un error en la obtencion de los datos")
        console.log(payload.mensaje)
        res.send(payload.mensaje)
    })
})

router.get("/tools/bracelet/report/developer/:name",(req, res, next) => {
    let payload = []
    Registros.find({}).then(data => {
        console.log(data.length)
        for(var i = 0; i < data.length; i++){
            payload.push({
                "ppm": data[i].ppm,
                "duracion": data[i].duracion,
                "lat": data[i].lat,
                "lon": data[i].lon,
                //"fecha": getDateTime(data[i].fecha)
                "fecha": data[i].cuando
            })
            if(payload.length == data.length){
                res.send(payload)
            }
        }
    }).catch(err =>{
        payload.mensaje("Hubo un error en la obtencion de los registros.")
        console.log(payload.mensaje)
        res.send(payload.mensaje)
    })
})

router.get("/tools/bracelet/report/quantity/:name",(req, res, next) => {
    var payload = {
        "mensaje":"ok"
    }
    User.findOne({_id : req.params.name}).then(data => {
        if(data != null){
            console.log("data")
            Manillas.find({_id : { $in: data.manilla}}).then(manillas =>{
                if(manillas != null){
                    console.log("Vamos bien")
                    console.log(manillas)
                    res.send(manillas)
                }else{
                    console.log("no existe")
                    console.log(manillas)
                    res.send(manillas)
                }
            }).catch(err =>{
                console.log("mal")
            })
        }else{   
            console.log("Aqui")
            res.send(data.manilla)
        }
    }).catch(err =>{
        payload.mensaje("Hubo un error en la obtencion de los datos")
        console.log(payload)
        res.send(payload)
    })
})

router.post("/tools/create/bracelet/",(req, res, next) => {
    console.log("POST ON: /tools/create/bracelet/ with: " + req.body)
    var payload = {
        "mensaje":"ok"
    }
    Manillas.findOne({"id_manilla" : req.body.id_manilla}).then(data => {
        if(data != null){
            console.log("Esta manilla ya se encuentra registrada")
            res.send({
               "message":"Esta manilla ya se encuentra registrada"
            })
        }else{   
            var manilla_temp = {
                "id_manilla" : req.body.id_manilla,
                "color" : req.body.color,
                "modelo" : req.body.modelo
            }

            var newManilla = new Manillas(manilla_temp)
           
            newManilla.save().then(braceletItem => {
                console.log("Registro manilla exitoso")
            }).catch(err => {
                console.log("No se pudo registrar manilla")
                res.send({"message":"No se pudo registrar la manilla."})
            })

            User.updateOne({_id : req.body.user}, {$push:{"manilla": newManilla._id}},function(err, response){
                if (err){
                    console.log("Error en Update")
                    res.send({"message":"No se pudo agregar la manilla al usuario."})
                }
                else{
                    console.log("Update Exitoso")
                    res.send({"message":"Manilla agregada."})
                }
            })
        }
    }).catch(err =>{
        payload.mensaje("Hubo un error en la obtencion de los datos")
        console.log(payload)
        res.send(payload)
    })
})

router.post("/tools/delete/bracelet/",(req, res, next) => {
    console.log("POST ON: /tools/create/bracelet/ with: " + req.body)
    var payload = {
        "mensaje":"ok"
    }
    Manillas.findOne({"id_manilla" : req.body.id_manilla}).then(data => {
        if(data != null){
            User.updateOne({_id : req.body.user}, {$pull:{"manilla": data._id}},function(err, response){
                if (err){
                    console.log("Error en Update")
                    res.send({"message":"No se pudo eliminar la manilla al usuario."})
                }
                else{
                    console.log("Update Exitoso")
                    res.send({"message":"Manilla Eliminada."})
                }
            })
            
        }else{
            console.log("Esta manilla no existe.")   
            res.send({
                "message":"Esta manilla no existe."
             })
        }
    }).catch(err =>{
        payload.mensaje("Hubo un error en la obtencion de los datos")
        console.log(payload)
        res.send(payload)
    })
})

router.get("/tools/bracelet/report/vehicles/:name",(req, res, next) => {
    var payload = {
        "mensaje":"ok"
    }
    User.findOne({_id : req.params.name}).then(data => {
        if(data != null){
            console.log("data")
            console.log(data)
            Vehiculos.find({_id : { $in: data.vehiculo}}).then(vehiculo =>{
                if(vehiculo != null){
                    console.log("Vamos bien")
                    console.log(vehiculo)
                    res.send(vehiculo)
                }else{
                    console.log("no existe")
                    console.log(vehiculo)
                    res.send(vehiculo)
                }
            }).catch(err =>{
                console.log("mal")
            })
        }else{   
            console.log("Aqui")
            res.send(data.vehiculo)
        }
    }).catch(err =>{
        console.log(payload)
        res.send(payload)
    })
})

router.post("/tools/create/vehicle/",(req, res, next) => {
    console.log("POST ON: /tools/create/bracelet/ with: " + req.body)
    var payload = {
        "mensaje":"ok"
    }
    Vehiculos.findOne({"id_vehiculo" : req.body.id_vehiculo}).then(data => {
        if(data != null){
            console.log("Esta vehiculo ya se encuentra registrada")
            res.send({
               "message":"Esta vehiculo ya se encuentra registrada"
            })
        }else{   
            var manilla_temp = {
                "marca":req.body.marca,
                "modelo":req.body.modelo,
                "color":req.body.color,
                "id_vehiculo":req.body.id_vehiculo,
                "year":req.body.year
            }

            var newVehicle = new Vehiculos(manilla_temp)
           
            newVehicle.save().then(braceletItem => {
                console.log("Registro vehiculo exitoso")
            }).catch(err => {
                console.log("No se pudo registrar vehiculo")
                res.send({"message":"No se pudo registrar la vehiculo."})
            })

            User.updateOne({_id : req.body.user}, {$push:{"vehiculo": newVehicle._id}},function(err, response){
                if (err){
                    console.log("Error en Update")
                    res.send({"message":"No se pudo agregar el vehiculo al usuario."})
                }
                else{
                    console.log("Update Exitoso")
                    res.send({"message":"Vehiculo agregado."})
                }
            })
        }
    }).catch(err =>{
        console.log(payload)
        res.send(payload)
    })
})

router.post("/tools/delete/vehicle/",(req, res, next) => {
    console.log("POST ON: /tools/delete/bracelet/ with: " + req.body)
    var payload = {
        "mensaje":"ok"
    }
    Vehiculos.findOne({"id_vehiculo" : req.body.id_vehiculo}).then(data => {
        if(data != null){
            User.updateOne({_id : req.body.user}, {$pull:{"vehiculo": data._id}},function(err, response){
                if (err){
                    console.log("Error en Update")
                    res.send({"message":"No se pudo eliminar el vehiculo al usuario."})
                }
                else{
                    console.log("Update Exitoso")
                    res.send({"message":"Vehiculo eliminado."})
                }
            })
            
        }else{
            console.log("Esta Vehiculo no existe.")   
            res.send({
                "message":"Esta Vehiculo no existe."
             })
        }
    }).catch(err =>{
        payload.mensaje("Hubo un error en la obtencion de los datos")
        console.log(payload)
        res.send(payload)
    })
})

function getDateTime(when){
    var date = new Date(when)
    return date
}

async function suscribeUser(ms) {
    return new Promise( resolve => {
          setTimeout(() => {
              resolve(console.log(ms))
          },1000*3)
      }
    );
}

module.exports = router
