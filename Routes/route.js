const express = require('express')

const admin = require("../Controller/controller")
const router = express.Router()
router.get('/', (req, res)=>{
  res.send('this is response from server')
})
router.post('/signup',admin.signup )
router.post('/login', admin.login)

module.exports  = router
