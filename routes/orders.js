const express = require('express');
const { sequelize, User,Order } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

const Joi = require('joi')

 const sema = Joi.object().keys({
     CarId: Joi.number().required(),
     sellerID: Joi.number().required(),
     buyerID: Joi.number().required(),
     
 })

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
        return res.status(401).json({ msg: 'Token je null' });
        
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: 'err' });
    
        req.user = user;
    
        next();
    });
}

// route.use(authToken);

route.get('/all', (req, res) => {

    Order.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
    
});

route.get('/:id', (req, res) => {

    Order.findOne({ where: { id: req.params.id } })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );

});

route.post('/', authToken,(req, res) => {
    let { error } = Joi.validate(req.body, sema);
    if(error){
        res.status(400).json({ msg : error.details[0].message});
    }else{
    //Order.create({ CarId: req.body.CarId, sellerID: req.body.sellerID, buyerID: req.body.buyerID, date: req.body.date })
    Order.create({ CarId: req.body.CarId, SellerId: req.body.SellerId, buyerID: req.body.buyerID})
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
    }
});

route.put('/:id', authToken,(req, res) => {
    
    let { error } = Joi.validate(req.body, sema);
    if(error){
        res.status(400).json({ msg : error.details[0].message});
    }else{
    Order.findOne({ where: { id: req.params.id }})
        .then( order => {
            order.CarId = req.body.CarId;
            order.sellerID = req.body.sellerID;
            order.buyerID = req.body.buyerID;
            order.date = req.body.date;

            order.save()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
    }

});

route.delete('/:id', authToken, (req, res) => {

    Order.findOne({ where: { id: req.params.id }})
        .then( order => {
            order.destroy()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
});

module.exports = route;
