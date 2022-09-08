const express = require('express');
const { sequelize, User,Car } = require('../models');
const jwt = require('jsonwebtoken');
const { redirect } = require('express/lib/response');
require('dotenv').config();

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

const Joi = require('joi')

 const sema = Joi.object().keys({
     name: Joi.string().required(),
     email: Joi.string().email().required(),
     password: Joi.string().required(),
     admin: Joi.required()
 })

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: 'err' });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: 'err' });
    
        req.user = user;
    
        next();
    });
}

// route.use(authToken);

route.get('/all', (req, res) => {
    // User.findOne({ where: { id: req.user.id } })
    // .then(usr => {
    //     if(usr.admin){
            User.findAll()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        // }else{
        //     //res.status(301).redirect('/index.html');
        //     res.status(403).json({ msg: "Invalid credentials"});
        //     //window.location.href = "index.html";
            
        // }
    // })
    
});

route.get('/:id', (req, res) => {

    // User.findOne({ where: { id: req.user.userId } })
    // .then(usr => {
    //     if(usr.admin){

    //     }else{
    //         res.status(403).json({ msg: "You are not an admin"});
    //     }
    // })

    User.findOne({ where: { id: req.params.id } })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );

});

route.post('/', authToken, (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
    .then(usr => {
        if(usr.admin){
            let { error } = Joi.validate(req.body, sema);
            if(error){
                res.status(400).json({ msg : error.details[0].message});
            }else{
            User.create({ name: req.body.name, email: req.body.email, password: req.body.password })
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
            }
        }else{
            //res.status(301).redirect('/login');
            //window.location.href = "index.html";
            res.status(403).json({ msg: "You are not an admin"});
        }
    })
    // User.create({ name: req.body.name, email: req.body.email, email: req.body.email, password: req.body.password })
    //     .then( rows => res.json(rows) )
    //     .catch( err => res.status(500).json(err) );

});

route.put('/:id', authToken, (req, res) => {
    User.findOne({ where: { id: req.user.userId } })
    .then(usr => {
        if(usr.admin){
            let { error } = Joi.validate(req.body, sema);
            if(error){
                res.status(400).json({ msg : error.details[0].message});
            }else{
            User.findOne({ where: { id: req.params.id }})
            .then( usr => {
                usr.name = req.body.name;
                usr.email = req.body.email;
                usr.save()
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
            })
            .catch( err => res.status(500).json(err) );
            }
        }else{
            res.status(403).json({ msg: "You are not an admin"});
        }
    })
    // User.findOne({ where: { id: req.params.id }})
    //     .then( usr => {
    //         usr.name = req.body.name;
    //         usr.email = req.body.email;
    //         usr.save()
    //             .then( rows => res.json(rows) )
    //             .catch( err => res.status(500).json(err) );
    //     })
    //     .catch( err => res.status(500).json(err) );

});

route.delete('/:id', authToken, (req, res) => {

    User.findOne({ where: { id: req.user.userId } })
    .then(usr => {
        if(usr.admin){
            User.findOne({ where: { id: req.params.id }})
        .then( usr => {
            usr.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
        }else{
            res.status(403).json({ msg: "You are not an admin"});
        }
    })

    // User.findOne({ where: { id: req.params.id }})
    //     .then( usr => {
    //         usr.destroy()
    //             .then( rows => res.json(rows) )
    //             .catch( err => res.status(500).json(err) );
    //     })
    //     .catch( err => res.status(500).json(err) );
});

module.exports = route;