const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signUpForm))

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.loginForm)

router.get("/my-profile", isLoggedIn, userController.myProfile);

router.get("/my-listings", isLoggedIn, userController.myListing);

router.get("/my-bookings", isLoggedIn, userController.myBooking);

router.get("/logout", userController.logout);

module.exports = router;