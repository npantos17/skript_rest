const express = require('express');
const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const a = null

// var corsOptions = {
//     origin: 'http://127.0.0.1:8000',
//     optionsSuccessStatus: 200
// }
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));


app.post('/api_register', (req, res) => {

    const obj = {
        name: req.body.name,
        email: req.body.email,
        admin: req.body.admin,
        password: bcrypt.hashSync(req.body.password, 10)
    };
    const Joi = require('joi')

     const sema = Joi.object().keys({
         name : Joi.string().min(3).required(),
         email : Joi.string().trim().email().required(),
         password: Joi.string().required(),
         admin: Joi.required()
     });


     let { error } = Joi.validate(req.body, sema);
     if(error){
        res.status(400).json({ msg : error.details[0].message});
     }else{
        User.create(obj).then( rows => {
        
            const usr = {
                userId: rows.id,
                user: rows.name
            };
   
            const token = jwt.sign(usr, process.env.ACCESS_TOKEN_SECRET);
   
            console.log(token);
           
            res.json({ token: token });
   
        }).catch( err => res.status(500).json(err) );
     }
});

app.post('/api_login', (req, res) => {

    User.findOne({ where: { name: req.body.name } })
        .then( usr => {
            
            if(!usr){
                res.status(400).json({ msg: "User not found"});
               
            }
            else if (bcrypt.compareSync(req.body.password, usr.password)) {
                const obj = {
                    userId: usr.id,
                    user: usr.name
                };
        
                const token = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET);
                res.json({ token: token });
                
            } else {
                res.status(400).json({ msg: "Invalid credentials"});
            }
        })
        .catch( err => res.status(500).json(err) );
});

app.listen({ port: 9000 }, async () => {
    await sequelize.authenticate();
});