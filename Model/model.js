const mongoose = require('mongoose')
const Joi = require("joi")
// const bcrypt = require('bcrypt')


const schema   = mongoose.Schema
const adminSchema = new schema ({
username:{
    type: String,
    require: true
},
email:{
    type: String,
    require: true
},
password:{
    type: String,
    require: true
}
})

// adminSchema.pre('save', function(next){
//     const user = this;
//     bcrypt.hash(user.password, 10, (err, hash)=> {
//         if(err){
//            return next(err)
//         }
//         user.password= hash;
//         console.log(user.password)
//         next()
//     });
// })


const adminDb = mongoose.model("adminSchema",adminSchema)

const validate = (adminDb) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(adminDb);
};

module.exports = {adminDb,validate}


