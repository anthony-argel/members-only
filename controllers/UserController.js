const User = require('../models/user');
const { body,validationResult } = require('express-validator');
const async = require('async');
const bcrypt = require('bcryptjs');
var { DateTime } = require('luxon');

exports.get_admin_form = (req,res, next) => {
    if(req.user) {
        res.render('user-change-form', {title:"Become an Admin", actionTarget:"/admin", user:req.user})
    }  
    else {
        res.redirect('/');
    }
}

exports.post_admin_form = [
    body('password').trim().custom((value, {req}) => value === process.env.ADMIN_PASS).withMessage('incorrect password').escape(),
    (req, res, next) => {
        const errors =validationResult(req);

        if(!errors.isEmpty()) {
            res.render('user-change-form', {title:"Become an Admin", actionTarget:"/admin", user:req.user, errors:errors.array()})
        }
        else {
            User.findOneAndUpdate({_id:req.user.id}, {admin:true}, {upsert:true})
            .exec((err) => {
                if(err) {return next(err);}
                res.redirect('/');
            });
        }
    }
]

exports.get_member_form = (req,res, next) => {
    if(req.user) {
        res.render('user-change-form', {title:"Become a Member", actionTarget:"/member", user:req.user})
    }  
    else {
        res.redirect('/');
    }
}

exports.post_member_form = [
    body('password').trim().custom((value, {req}) => value === process.env.MEMBER_PASS).withMessage('incorrect password').escape(),
    (req, res, next) => {
        const errors =validationResult(req);

        if(!errors.isEmpty()) {
            res.render('user-change-form', {title:"Become a Member", actionTarget:"/member", user:req.user, errors:errors.array()})
        }
        else {
            User.findOneAndUpdate({_id:req.user.id}, {memberstatus:"secret"}, {upsert:true})
            .exec((err) => {
                if(err) {return next(err);}
                res.redirect('/');
            });
        }
    }
]