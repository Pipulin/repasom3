const express = require('express');
const router = express.Router()
const axios = require('axios')

const apiKey = '1219787db7f31c22dc2c71601d4756b6'

router.get('/:city', async (req, res) => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${apiKey}`)
        const data = {
            id: response.data.id,
            name: response.data.name,
            temp: response.data.main.temp
        }
        res.send(data)
    } catch (error) {
        res.status(404).send(error.toString())
    } 
})


module.exports = router;