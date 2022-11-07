const express = require('express');
const app = express();
const path = require('path');
const methodoverride = require('method-override');

const Product = require('./models/product');
const Farm = require('./models/farm');

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

//Farm Routes

app.get('/farms', async (req, res) => {
 const farms = await Farm.find();
 res.render('farms/index', { farms })
})

//Find Farm
app.get('/farms/:id', async(req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id).populate('products');
    res.render('farms/show', { farm })
})

//Create Farm
app.get('/farms/new', (req, res) =>{
    res.render('farms/new');
})

app.post('/farms', async(req, res) => {
    const farm = new Farm(req.body)
    await farm.save()
    res.redirect('/farms')
})

//Add new Product to a Farm
app.get('/farms/:id/products/new', async(req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id)
    res.render('products/new', { categories, farm})
})

app.post('/farms/:id/products', async(req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id)
    const { name , price, category } = req.body;
    const product = new Product({ name , price, category })
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect(`/farms/${id}`);
})

//Delete Farm
app.delete('/farms/:id', async (req, res) =>{
    const { id } = req.params;
    const farm = await Farm.findByIdAndDelete(id)
    res.redirect('/farms')
})

//Products Routes
//////////////////////

//Get Products
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
    const product = await Product.findById(id).populate('farm', 'name');
    console.log(product);
    res.render('products/show', { product })
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




















