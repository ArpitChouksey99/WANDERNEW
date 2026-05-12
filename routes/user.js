const express = require("express");
const router = express.Router();   
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const listingController = require("../controllers/listing.js");


router.route("/")
.get(wrapasync(listingController.index));

router.route("/signup")
.get( userController.renderSignupForm)
.post(wrapasync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",
    { failureRedirect: "/login", 
    failureFlash: true}),userController.login)
router.get("/logout",userController.logout);

module.exports = router;