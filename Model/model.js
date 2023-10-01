const mongoose = require('mongoose')
const Joi = require("joi")
const bcrypt = require('bcrypt')


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
},
enrollCourse : [{
  type: mongoose.Schema.Types.ObjectId,
ref: 'Courses'}]
})

adminSchema.pre('save', function(next){
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash)=> {
        if(err){
           return next(err)
        }
        user.password= hash;
        console.log(user.password)
        next()
    });
})

const courseSchema = new schema({
    title: {
      type: String,
      required: true,
      trim: true, 
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes, for example
    //   required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number, // You can use this to store the course rating, if applicable
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId, // You might have a separate User schema
          ref: 'adminSchema',
        },
        content: String,
        rating: Number,
        date: Date,
      },
    ],
    prerequisites: [
      {
        type: String, // You can expand this to reference other courses or skills
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'adminSchema', // Reference to User schema for enrolled students
      },
    ],
  });
  


const adminDb = mongoose.model("adminSchema",adminSchema)
const CoursesDb = mongoose.model("Courses",courseSchema)

const validate = (adminDb) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(adminDb);
};

module.exports = {adminDb,validate,CoursesDb }


