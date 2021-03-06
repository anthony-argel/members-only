var express = require('express');
var router = express.Router();
const sign_up_controller = require('../controllers/SignUpController');
const post_controller = require('../controllers/PostController');
const user_controller = require('../controllers/UserController');
const Post = require('../models/post');

/* GET home page. */
router.get('/', post_controller.post_get_all);

router.get('/login', (req,res,next) => {
  res.render('login-form', {user: req.user, title:"Login"})
});

router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up-form', {title:'Sign Up', user:req.user, errors:[]});
});

router.post('/sign-up', sign_up_controller.sign_up_post);

router.get('/create', post_controller.post_get);
router.post('/create', post_controller.post_post);

router.get('/admin', user_controller.get_admin_form); 
router.post('/admin', user_controller.post_admin_form);

router.get('/member', user_controller.get_member_form); 
router.post('/member', user_controller.post_member_form);

router.post('/delete/:id', (req, res, next) => {
  if(!req.user) {
    res.redirect('/');
  }
  else {
    Post.findByIdAndRemove(req.params.id).exec((err, result) => {
      if(err) {return next(err);}
      res.redirect('/');
    })
  }
});

module.exports = router;
