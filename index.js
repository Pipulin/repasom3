// -1- configs iniciales requerir express y hacerlo correr, agregar morgan 
const express = require('express');
const morgan = require('morgan');
const server = express();
const users = require('./routes/users') //traemos el ruteo
const productRoutes = require('./routes/productRoutes')
const weatherRoutes = require('./routes/weather')

server.use(morgan('tiny')); //aplica este midware a todas los requests
server.use(express.json()); // si llega por json, que lo traduzca a un objeto
// -5- ya se puede empezar a armar y configurar las rutas con los methods(configurar endpoints)
// server.METHOD(PATH, (req, res, next) =>{ x ej res.send() })
// fuera de get, la unica manera de acceder a los otros metodos es a traves de postman o similares
// next es opcional para cuando se quiere hacer mas de una respuesta (un request == una unica respuesta)

server.use('/users', users) //con esta config, cada vez que se tope con /users va a buscarlo al archivo users
server.use('/products', productRoutes)// con esta config, cada vez que se tope con /products va a buscarlo al archivo productRoutes
server.use('/weather', weatherRoutes)
// midware es una funcion, en este caso siempre es necesario el next, ya que se éste se para entre la request y la respuesta
// >>request >>middleware >>callback>> response
function logger(req, res, next) {
    console.log(req.url);
    next()
}

// -6- imitar una base de datos con un array
let names = [{id: 1, name: "fermin"}, {id: 2, name: "mierdens"}, {id: 3, name: "tulotabet"}]
let id = 4
 
server.get('/', logger, (req, res, next) => {
    // res.type() vacio equivale a text/html
    // res.send('Bienvenidos')
    console.log('previo al next');
    next();
})

server.get('/', (req, res, next) => {
    res.type('html') //define el content type
    res.send('Bienvenidos a nuestro server despues de un next')
})

server.get('/json', (req, res, next) => {
    //content-type: application/json
    //envia el header json
    res.json({message: "hello"}) // enviar los valores que no esten declarados como string o declararlos, o rompe
    // res.json(undefined) // vacio
    // res.json(null) // muestra null
    //res.json("Hola, ruta /json")
})

server.get('/send', (req, res, next) => {
    // res.send({message: 'Holis te mando info'}) //content-type: automatizadamente lo recibe como application/json
    //res.send(undefined) //content-type no definido
    res.send('Hola ruta /send')
})
//para recibir por parametros un id, por query un nombre, y por parametros un apellido
//y responder que si el nombre no vino responda un 404, y si el id es mayor a 5 responda un 404
//si no responder un string con toda la info concatenada
server.get('/uno/:id/:apellido', (req, res) =>{
    // req.params es un objeto que tiene los datos que le paso por ruta, se le puede aplicar destructuring
    let {id, apellido} = req.params
    let {nombre} = req.query

    if(!nombre) return res.status(404).send({message: 'Falta info, nombre no definido'}) // sin mensaje de error seria res.sendStatus(404)
    //cuidado al recibir por url, toda info llega como string, intentar convertir para evitar fallos con parseInt, isNan(Number(id)), etc
    if(id> 5) return res.status(404).send({message: 'El id es mayor 5, ¿te olvidaste de tus propias condiciones?'})
    res.send(`${id} ${nombre} ${apellido}`)
})

//en esta llegaria info desde body, viaja por formato json
//por si solo no puede interpretarlo, por lo que para que funcione
//hay que activar el midware de express.json, este lo va a transformar a obj
server.post('/', (req, res) => {
    console.log(req.body)
    let {primerValor, segundo, tercero} = req.body
    res.send(`La historia es que definiste estos valores ${primerValor}, despues dijiste que ${segundo}, y por último que ${tercero}`)
})

server.post('/addName/:name', (req, res) => {
    const {name} = req.params
    const {location, age} = req.body
    if(!location || !age || !name) return res.sendStatus(404)
    names.push({id: id++, name, location, age});
    // res.json(names) //es una opcion
    res.send(names); // se puede igual porque identifica y envia como application/json
})
server.get('/search/:id', (req, res) => {
    let id = req.params.id;
    //para buscar una coincidencia, utilizar filter, find o map
    //filter y map devuelven nuevo array, find el primer objeto que coincida
    let findIt = names.find(n => n.id === parseInt(id));
    if(findIt) res.send(findIt.name);
    res.sendStatus(400)
})

// en esta se define un 'catch' para que el server no tenga que responder a cualquier cosa que no haya
server.get('*', (req, res) => {
    res.status(404).send('No hay ruta con dicha URL')
})

// -2- hacer correr server en algun puerto que no este siendo utilizado (el callback de log es opcional)
server.listen(3000, () => {console.log('listening on port 3000')})
// -3- agregar un atajo en package-json para que al ejecutar npm start arranque tambien nodemon
// -4- a esta altura ya se puede ejecutar npm start y abrir postman
// -7- Modularizar, hay demasiadas lineas para un mismo archivo