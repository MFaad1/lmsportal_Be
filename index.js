const express = require('express')
const router = require( './Routes/route')
const connect = require('./helper/Helper')
const cors = require('cors')
const app = express()
app.use(express.json())
const port = 3200;
app.use(cors())
app.use('/api',router)


connect()
app.listen(port,()=>{
    console.log('Server is listening')
})