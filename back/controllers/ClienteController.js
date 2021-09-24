'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_cliente = async (req, res)=>{

    var data = req.body;

    var clientes_arr =[];
    clientes_arr = await Cliente.find({email: data.email});

    //TODO: llevar los textos a minuscula antes de registrar en base de dato para no permitir duplicados al poner una mayuscula

    if(clientes_arr.length == 0){


        if(data.password){
            bcrypt.hash(data.password, null, null, async (err, hash)=>{
                if(hash){
                    data.password = hash
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(403).send({message:'Error server', data:undefined});
                }
            })
        }else{
            res.status(402).send({message:'envio de datos sin contraseña', data:undefined});
        }

    }else{
        res.status(402).send({message:'correo registrado en la base de dato', data:undefined});
    }

}

const login_cliente = async (req, res) =>{
    var data = req.body;

    var clientes_arr =[];
    clientes_arr = await Cliente.find({email: data.email});
    if(clientes_arr.length == 0){
        res.status(404).send({message:'no se encuentra correo', data:undefined});
    }else{
        var user = clientes_arr[0];

        bcrypt.compare(data.password, user.password, async (err, check)=>{
            if(check){
                res.status(200).send({data:user, token:jwt.createToken(user)})
            }else{
                res.status(404).send({message:'error de datos de logueo', data:undefined});
            }
        })
    }


}

module.exports = {
    registro_cliente,
    login_cliente
}