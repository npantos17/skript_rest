const express = require('express');
const { sequelize, User } = require('./models');
const cors = require('cors');//da dozvolimo sa druge adrese da pristupamo rutama
const users = require('./routes/users');//ovde se impl router iz endPoints ubacuje
const orders = require('./routes/orders');
const sellers = require('./routes/sellers');
const cars = require('./routes/cars');
const history = require('connect-history-api-fallback');
require('dotenv').config();
const path = require('path');

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));


app.use('/admin/users', users);
app.use('/admin/orders', orders);
app.use('/admin/sellers', sellers);
app.use('/admin/cars', cars);

const staticMdl = express.static(path.join(__dirname, 'dist'));
app.use(staticMdl);
app.use(history({ index: '/index.html' }));
app.use(staticMdl);


app.listen({ port: process.env.PORT || 8500 }, async () => {
    await sequelize.authenticate();
    console.log("rest povezan");
});