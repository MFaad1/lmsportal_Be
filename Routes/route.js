const express = require('express')

const admin = require("../Controller/controller")
const router = express.Router()

router.post('/signup',admin.signup )
router.get('/login', admin.login)

module.exports  = router
