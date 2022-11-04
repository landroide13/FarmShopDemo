
const Product = require('./models/product');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/farmShopDB')
        .then(() => {
            console.log("Connection Open")
        })
        .catch(err => console.log(err))

const proArr = [
    {name: 'Green Grapes', price: 5.6, category: 'fruits'},
    {name: 'Bananas', price: 6, category: 'fruits'},
    {name: 'Celery', price: 5.4, category: 'veggies'}
]

/*
const p = new Product({name: 'Ruby Grapes', price: 50, category: 'fruits'})

p.save().then(data => console.log(data))
*/

//Product.insertMany(proArr).then(res =>  console.log(res))








