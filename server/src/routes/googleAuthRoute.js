const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { CLIENT_URL, JWT_SECRET } = require("../config/config");

// Step 1: Redirect to Google
router.get(
  "/google",
  (req, res, next) => {
    const { birthday, location, interests } = req.query;
    req.session = req.session || {};
    req.session.registerData = {
      birthday,
      location: location ? JSON.parse(location) : undefined,
      interests: interests ? JSON.parse(interests) : undefined,
    };
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/auth/login`, // fallback in case of error
    session: false,
  }),
  (req, res) => {
    const accessToken = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role,
        location: req.user.location,
        interests: req.user.interests,
        avatar: req.user.avatar?.url || "",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

 res.cookie("token", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});


    res.redirect(`${CLIENT_URL}/feed`);
  }
);

module.exports = router;
