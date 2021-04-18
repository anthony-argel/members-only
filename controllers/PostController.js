const User = require('../models/user');
const { body,validationResult } = require('express-validator');
const async = require('async');
const bcrypt = require('bcryptjs');
var { DateTime } = require('luxon');
const Post = require('../models/post');

exports.post_get = (req, res, next) => {
    res.render('message-form', {title:"New Post"});
}

exports.post_post = [
    body('title').trim().isLength({min:1}).withMessage('Title must not be empty').escape(),
    body('postmsg').trim().isLength({min:1}).withMessage('Message must not be empty.').escape(),
    (req,res, next) => {
        const errors = validationResult(req);
        console.log(req.user);
        Post.findById(req.user.id).exec((err, result) => {
           if(err) {return next(err);}
            const newPost = new Post({
                title: req.body.title,
                message: req.body.postmsg,
                timestamp: DateTime.now(),
                user: result
            });

            if(!errors.isEmpty()) {
                res.render('message-form', {title: 'New Post',errors:errors.array});
            }
            else {
                newPost.save((err, result) => {
                    if(err) {return next(err);}
                    res.redirect('/');
                });
            }
        });

        
    }
];