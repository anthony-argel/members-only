const User = require('../models/user');
const { body,validationResult } = require('express-validator');
const async = require('async');
const bcrypt = require('bcryptjs');
var { DateTime } = require('luxon');
const Post = require('../models/post');

exports.post_get_all = (req, res, next) => {
    Post.find()
    .populate('user')
    .exec((err, results) => {
        if(err) {return next(err);}
        res.render('index', {posts:results, user: req.user});
    });
};

exports.post_get = (req, res, next) => {
    if(req.user) {
        res.render('message-form', { user:req.user, title:"New Post"});
    }
    else {
        res.redirect('/');
    }
}

exports.post_post = [
    body('title').trim().isLength({min:1}).withMessage('Title must not be empty').escape(),
    body('postmsg').trim().isLength({min:1}).withMessage('Message must not be empty.').escape(),
    (req,res, next) => {
        const errors = validationResult(req);
        Post.findById(req.user.id).exec((err, result) => {
           if(err) {return next(err);}
            const newPost = new Post({
                title: req.body.title,
                message: req.body.postmsg,
                timestamp: DateTime.now(),
                user: req.user.id
            });

            if(!errors.isEmpty()) {
                res.render('message-form', {title: 'New Post', user:req.user, errors:errors.array});
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