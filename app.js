const express = require("express");
const { sequelize } = require('./models');
const cars = require('./routes/cars');
const orders = require('./routes/orders')
const sellers = require('./routes/sellers')
const users = require('./routes/users')
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const history = require('connect-history-api-fallback');
require('dotenv').config();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { raw } = require('express');

const app = express();
// const a;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: 'http://127.0.0.1:8080',
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
        credentials: true
    },
    allowEIO3: true
});

// var corsOptions = {
//     origin: 'http://127.0.0.1:8080',
//     optionsSuccessStatus: 200
// }

// app.use(express.json())
// app.use(cors(corsOptions))

// app.use('/admin', cars)
// app.use('/admin', orders)
// app.use('/admin', sellers)
// app.use('/admin', users)

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];
  
    if (token == null) return res.redirect(301, '/login');
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(301, '/login');
    
        req.user = user;
    
        next();
    });
}

function authSocket(msg, next) {
    if (msg[1].token == null) {
        next(new Error("Not authenticated"));
    } else {
        jwt.verify(msg[1].token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                next(new Error(err));
            } else {
                msg[1].user = user;
                next();
            }
        });
    }
}

// app.get('/register', (req, res) => {
//     res.sendFile('register.html', { root: './static' });
// });

// app.get('/login', (req, res) => {
//     res.sendFile('login.html', { root: './static' });
// });

// app.get('/', authToken, (req, res) => {
//     res.sendFile('index.html', { root: './static' });
// });


// app.use(express.static(path.join(__dirname, 'static')));


const staticMdl = express.static(path.join(__dirname, 'dist'));
app.use(staticMdl);
app.use(history({ index: '/index.html' }));
app.use(staticMdl);


// app.listen({ port: 8000 }, async () => {
//     await sequelize.authenticate();
// });

server.listen({ port: 8000 }, async () => {
    await sequelize.authenticate();
    console.log("startovan app");
});