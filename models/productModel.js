let products = []

function addProduct(product) {
    // products.push(product); es preferible ponerle algun filtro antes de hacer entrar todo
    if(!products.includes(product)){
        products.push(product)
        return 'Producto agregado satisfactoriamente'
    } else{
        throw new Error('El producto ya existe')
    }
}

function getProducts(){
    return products;
}


module.exports = {addProduct, getProducts};