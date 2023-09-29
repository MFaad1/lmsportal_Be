const express = require('express')

const admin = require("../Controller/controller")
const middle = require('../Middleware/tokenVarify')
const router = express.Router()

router.post('/signup',admin.signup )
router.post('/login', admin.login)
router.post('/emailVarify', admin.passwordReset)
// router.post('/:userId/:token', admin.token)
router.post('/passwordReset',middle.middle, admin.passwordReset2)
router.post('/addCourse', admin.addCourse)
router.get('/getCourses', admin.getCourses)


module.exports  = router
