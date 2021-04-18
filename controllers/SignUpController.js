const User = require('../models/user');
const { body,validationResult } = require('express-validator');
const async = require('async');
const bcrypt = require('bcryptjs');
var { DateTime } = require('luxon');


exports.sign_up_post = [
  body('username').trim().isLength({min:3}).withMessage('username must be at least 3 characters long')
  .isAlphanumeric().withMessage('username must only contain letters and numbers').escape(),
  body('password').trim().isLength({min:8}).withMessage('password must be at least 8 characters long')
  .isAlphanumeric().withMessage('password must only contain letters and numbers').escape(),
  body('confirm-password').trim().custom((value, {req}) => value === req.body.password).withMessage('passwords did not match'),
  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('sign-up-form', {title:'Sign-up', errors: errors.array()});
    }
    else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if(err) {return next(err);}
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          joindate: DateTime.now(),
          memberstatus: "normal"
        }).save(err => {
          if (err) { 
            return next(err);
          };
  
          res.redirect("/");  
        });
      });
    }
  }
];