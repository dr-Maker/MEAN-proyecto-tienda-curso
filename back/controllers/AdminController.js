'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_admin = async (req, res)=>{

    var data = req.body;

    var admin_arr =[];
    admin_arr = await Admin.find({email: data.email});
    
    //TODO: llevar los textos a minuscula antes de registrar en base de dato para no permitir duplicados al poner una mayuscula

    if(admin_arr.length == 0){
       
        if(data.password){
            bcrypt.hash(data.password, null, null, async (err, hash)=>{
                if(hash){
                    data.password = hash
                    var reg = await Admin.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(403).send({message:'Error server', data:undefined});
                }
            })
        }else{
            res.status(402).send({message:'Debe ingresar una contraseña', data:undefined});
        }
      
    }else{
        res.status(402).send({message:'El correo ya esta registrado en la base de dato', data:undefined});
    }

}

const login_admin = async (req, res) =>{


    var data = req.body;

    var admin_arr =[];
    admin_arr = await Admin.find({email: data.email});
    if(admin_arr.length === 0){
        res.status(200).send({message:'no se encuentra correo', data:undefined});
    }else{
        var user = admin_arr[0];

        bcrypt.compare(data.password, user.password, async (err, check)=>{
            if(check){
                res.status(200).send({data:user, token:jwt.createToken(user)})
            }else{
                res.status(200).send({message:'error de datos de logueo', data:undefined});
            }
        })
    }
}

module.exports = {
    registro_admin,
    login_admin
}