const express = require('express');
const { sequelize, User,Car } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

 const Joi = require('joi')

 const sema = Joi.object().keys({
     //SellerId: Joi.number().required(),
     brand: Joi.required(),
     model: Joi.required(),
     year: Joi.number().max(2022),
     price: Joi.required(),
     OrderId: Joi.number()
 })

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
        return res.status(401).json({ msg: 'Token je null' });
        redirect
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: 'err' });
    
        req.user = user;
    
        next();
    });
}

// route.use(authToken);

// route.get('/cars', (req, res) => {
route.get('/all', (req, res) => {

    Car.findAll()
        .then( rows => 
            // console.log(rows),
            res.json(rows) )
        .catch( err => res.status(500).json(err) );
    
});

// route.get('/cars/:id', (req, res) => {
route.get('/:id', (req, res) => {

    Car.findOne({ where: { id: req.params.id } })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );

});

// route.post('/cars', (req, res) => {
route.post('/', authToken, (req, res) => {
    let { error } = Joi.validate(req.body, sema);
    if(error){
        res.status(400).json({ msg : error.details[0].message});
    }else{

    Car.create({ brand: req.body.brand, model: req.body.model, year: req.body.year, price: req.body.price, OrderId: req.body.OrderId })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
    }
});

// route.put('/cars/:id', (req, res) => {
route.put('/:id', authToken, (req, res) => {
    let { error } = Joi.validate(req.body, sema);
    if(error){
        res.status(400).json({ msg : error.details[0].message});
        //res.status(400).json({ msg : "lolara"});
    }else{
    Car.findOne({ where: { id: req.params.id }})
        .then( car => {
            //car.SellerId = req.body.SellerId;
            car.brand = req.body.brand;
            car.model = req.body.model;
            car.year = req.body.year;
            car.price = req.body.price;
            car.OrderId = req.body.OrderId;

            car.save()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
    }
});

// route.delete('/cars/:id', (req, res) => {
route.delete('/:id', authToken, (req, res) => {

    Car.findOne({ where: { id: req.params.id }})
        .then( car => {
            car.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});

module.exports = route;
