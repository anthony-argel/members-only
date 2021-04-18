var express = require('express');
var router = express.Router();
const sign_up_controller = require('../controllers/SignUpController');
const post_controller = require('../controllers/PostController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up-form', {title:'Sign Up', errors:[]});
});

router.post('/sign-up', sign_up_controller.sign_up_post);

router.get('/create', post_controller.post_get);
router.post('/create', post_controller.post_post);

module.exports = router;
