const { adminDb } = require('../Model/model')
let jwt = require('jsonwebtoken');
let seckey = 'seckey'


const signup = (req, res) => {
    const email = req.body.email
    adminDb.findOne({ email: email }).then(resp => {
        if (!resp) {
            const admindb = new adminDb(req.body)
            admindb.save().then(resp => {
                if (resp) {
                    return res.status(200).json({
                        message: 'You have sucessfully signup',
                        admindb,
                    })
                }
            })
        }
        else {
            return res.status(401).json({
                message: 'user has been already exists',
            })
        }
    })
}

const login = (req, res) => {
    const email = req.body.email
    adminDb.findOne({ email: email })
        .then(resp => {
            if (resp) {
                let token = jwt.sign({ email }, seckey);
                return res.status(200).json({
                    message: 'You have sucessfully login',
                    token
                })
            }
            else {
                return res.status(401).json({
                    message: 'user not found'
                })
            }
        })
        .catch(error => {
            return res.status(401).json({
                message: 'error while login',
                error: error.message
            })
        })

}


module.exports = { signup, login }