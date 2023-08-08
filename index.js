const express = require('express')
const router = require( './Routes/route')
const connect = require('./helper/Helper')
require("dotenv").config();

const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use('/api',router)


connect()
app.listen(process.env.PORT,()=>{
    console.log('Server is listening at ' + process.env.PORT)
})