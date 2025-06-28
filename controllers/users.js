const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs",{ title: "Wanderlust" });
};

module.exports.signUpForm = async (req, res) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => { // This will automatically login the user after sign up. Once we signup, we are logged in automatically
            if(err){
                return next(err);
            }
            req.flash("success", `Welcome @${username}`);
            res.redirect("/listings");
        });
    } catch(err){
        req.flash("success", `Username already exists. Try Again!`);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs",{ title: "Wanderlust" });
};

module.exports.loginForm = async(req, res) => {
    // console.log(req);
    req.flash("success", `Welcome back`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err)
            return next(err);
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
    })
};