const express = require('express')

const admin = require("../Controller/controller")
const middle = require('../Middleware/tokenVarify')
const router = express.Router()

router.post('/signup',admin.signup )
router.post('/login', admin.login)
router.post('/emailVarify', admin.passwordReset)
router.post('/passwordReset',middle.middle, admin.passwordReset2)
router.post('/addCourse', admin.addCourse)
router.get('/getCourses', admin.getCourses)
router.post('/EnrollCourse',middle.middle, admin.Enrollcourse)
router.get('/userDetails',middle.middle, admin.userDetails)
router.post('/delcoursesHander',middle.middle, admin.delcoursesHander)


module.exports  = router
