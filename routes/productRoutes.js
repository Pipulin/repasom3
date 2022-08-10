let express = require('express');
let router = express.Router();
const {addProduct, getProducts} = require('../models/productModel');

//en esta ruta lo que se busca es que agregue un elemento al array products
//si el elemento no estaba incluido, que lo agregue y devuelva 200
//si es que ya estaba, que devuelva err400 

router.post('/:name', (req, res) => {
    try {
        let response = addProduct(req.params.name);
        return res.status(200).send(response)
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.toString())
    }
})

router.get('/', (req, res) => {
    res.send(getProducts())
})

module.exports = router;