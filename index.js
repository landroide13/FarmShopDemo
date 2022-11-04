const express = require('express');
const app = express();
const path = require('path');
const methodoverride = require('method-override');

const Product = require('./models/product');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/farmShopDB')
        .then(() => {
            console.log("Connection Open")
        })
        .catch(err => console.log(err))


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))
app.use(methodoverride('_method'))

app.get('/products', async(req, res) => {
    const { category } = req.query;
    if(category){
        const products = await Product.find({category: category});
        res.render('products/index', { products, category })
    }else{
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' })
    }
})

//Categories

const categories = ['fruits', 'veggies', 'dairy'];

//Create Methods

app.get('/products/new', (req, res) =>{
    res.render('products/new', { categories });
})

app.post('/products', async(req, res) =>{
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`products/${newProduct._id}`)
})

//Update Methods

app.get('/products/:id/edit', async(req, res) =>{
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories });
})

app.put('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/products/${product._id}`)
})

//Get One Product

app.get('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show', {product})
})

//Delete Product

app.delete('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})


//Runner

app.listen(8080, ()=> {
    console.log('App running at 8080')
})




















