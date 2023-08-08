const { adminDb,validate} = require('../Model/model')
const Token = require('../Model/model')
let jwt = require('jsonwebtoken');
let seckey = 'seckey'
const crypto = require("crypto");
const sendEmail = require('../utils/SendEmail')
require("dotenv").config();
const Joi = require("joi")



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

const passwordReset=async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await adminDb.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");
        return res.status(200).json({
            message: "user found",
            user
        })
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}


const passwordReset2=async (req, res) => {
    const token = req.headers.token
    console.log(token, "asdflsdkf")
    try {
        console.log(req.email, "request email")

        const user = await adminDb.findOne({ email: req.body.email });
        if (!user){
            return res.status(400).send("user with given email doesn't exist");
        }
   
        user.password = req.body.password;
        await user.save();
        return res.status(200).json({
            message: "user found",
            // user
        })
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}

const token =  async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await adminDb.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        adminDb.password = req.body.password;
        await adminDb.save();
        await adminDb.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}

module.exports = { signup, login, passwordReset, token, passwordReset2}


