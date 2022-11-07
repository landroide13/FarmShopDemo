const mongoose = require('mongoose');
const Product = require('./product')
const { Schema } = require('mongoose');

const farmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
})


//Query Middleware
farmSchema.post('findOneAndDelete', async function(farm){
    if(farm.products.length){
       const res = await Product.deleteMany({ _id: {$in: farm.products } })
       console.log(res);
    }
    }
)

const Farm = mongoose.model('Farm', farmSchema)

module.exports = Farm;