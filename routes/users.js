//definimos lo que vamos a usar
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Touchdown en users')
})
router.get('/:name', (req, res) => {
    res.send(`${req.params.name} de /users/:name`)
})


//exportamos el modulo
module.exports = router;