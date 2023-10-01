const {adminDb, validate, CoursesDb} = require('../Model/model');
const Token = require('../Model/model');
let jwt = require('jsonwebtoken');
let seckey = 'seckey';
const crypto = require('crypto');
const sendEmail = require('../utils/SendEmail');
require('dotenv').config();
const Joi = require('joi');

const signup = (req, res) => {
  const email = req.body.email;
  adminDb.findOne({email: email}).then(resp => {
    if (!resp) {
      const admindb = new adminDb(req.body);
      admindb.save().then(resp => {
        if (resp) {
          return res.status(200).json({
            message: 'You have sucessfully signup',
            admindb,
          });
        }
      });
    } else {
      return res.status(401).json({
        message: 'user has been already exists',
      });
    }
  });
};

const login = (req, res) => {
  const email = req.body.email;
  adminDb
    .findOne({email: email})
    .then(resp => {
      if (resp) {
        let token = jwt.sign({email}, seckey);
        return res.status(200).json({
          message: 'You have sucessfully login',
          token,
        });
      } else {
        return res.status(401).json({
          message: 'user not found',
        });
      }
    })
    .catch(error => {
      return res.status(401).json({
        message: 'error while login',
        error: error.message,
      });
    });
};

const passwordReset = async (req, res) => {
  console.log(req.body, 'body');
  try {
    const schema = Joi.object({email: Joi.string().email().required()});
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await adminDb.findOne({email: req.body.email});
    if (!user) {
      return res.status(400).send("user with given email doesn't exist");
    }
    return res.status(200).json({
      message: 'user found',
      user,
    });
  } catch (error) {
    res.send('An error occured');
    console.log(error);
  }
};

const passwordReset2 = async (req, res) => {
  const token = req.headers.token;

  try {
    console.log(req.email, 'request email');

    const user = await adminDb.findOne({email: req.email});
    if (!user) {
      return res.status(400).send("user with given email doesn't exist");
    }

    user.password = req.body.password;
    await user.save();
    return res.status(200).json({
      message: 'Course has been enrolled',
      // user
    });
  } catch (error) {
    res.send('An error occured');
    console.log(error);
  }
};

const token = async (req, res) => {
  try {
    const schema = Joi.object({password: Joi.string().required()});
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await adminDb.findById(req.params.userId);
    if (!user) return res.status(400).send('invalid link or expired');

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send('Invalid link or expired');

    adminDb.password = req.body.password;
    await adminDb.save();
    await adminDb.delete();

    res.send('password reset sucessfully.');
  } catch (error) {
    res.send('An error occured');
    console.log(error);
  }
};

const addCourse = async (req, res) => {
  try {
    const course = new CoursesDb(req.body);
    await course.save();

    return res.status(200).json({
      message: 'Course has been enrolled',
      course,
    });
  } catch (error) {
    console.log(error.message, 'error occured');
    return res.status(500).json({
      message: 'Sever error ',
    });
  }
};

const getCourses = async (req, res) => {
  try {
    CoursesDb.find().then(response => {
      return res.status(200).json({
        message: 'Course has been enrolled',
        course: response,
      });
    });
  } catch (error) {
    console.log(error.message, 'error occured');
    return res.status(500).json({
      message: 'Sever error ',
    });
  }
};

const Enrollcourse = async (req, res) => {
  try {
    const email = req.email;
    const courseId = req.body.id;
    const user = await adminDb.findOne({email: email});
    console.log(courseId, 'user');
    if (!user) {
      return res.status(400).send("user with given email doesn't exist");
    }
    const course = await CoursesDb.findById(courseId);
    if (!course) {
      return res.status(400).send("Course with the given ID doesn't exist");
    }

    if (!user.enrollCourse.includes(courseId)) {
      user.enrollCourse.push(courseId);
      await user.save();
      return res.status(200).json({
        message: 'user found',
      });
    } else {
      return res.status(401).json({
        message: 'Course already enrolled',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error occured',
      error: error.message,
    });
  }
};

const userDetails = async (req, res) => {
  const email = req.email;
  const user = await adminDb.findOne({email: email});
  if (!user) {
    return res.status(400).send("user with given email doesn't exist");
  }
  let CoursesArray = [];
  if (user.enrollCourse.length > 0) {
    const coursePromises = user.enrollCourse.map(async item => {
      const course = await CoursesDb.findById(item);
      if (course) {
        CoursesArray.push(course);
      }
    });
    await Promise.all(coursePromises);
  }

  return res.status(200).json({
    userDetails: user,
    CoursesArray,
    message: 'User Details Found',
  });
};


const delcoursesHander = async (req, res) => {
  const email = req.email;
  const CourseId = req.body.id;

  const user = await adminDb.findOne({ email: email });
  if (!user) {
    return res.status(400).send("User with given email doesn't exist");
  }

  try {

    await adminDb.updateOne({ _id: user._id }, { $pull: { enrollCourse: CourseId } });

    // Find the updated user object
    const updatedUser = await adminDb.findOne({ email: email });

    return res.status(200).json({
      message: "Course removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error occurred while removing the course",
      error: error.message,
    });
  }
};


module.exports = {
  signup,
  login,
  passwordReset,
  token,
  passwordReset2,
  addCourse,
  getCourses,
  Enrollcourse,
  userDetails,
  delcoursesHander
};
