const router = require("express").Router();
const passport = require("passport");
const { CLIENT_URL } = require("../config/config");

// Step 1: Redirect to Google
router.get("/google", (req, res, next) => {
  const { birthday, location, interests } = req.query;
  req.session = req.session || {};
  req.session.registerData = {
    birthday,
    location: location ? JSON.parse(location) : undefined,
    interests: interests ? JSON.parse(interests) : undefined,
  };
  next();
}, passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
}));

// Step 2: Google callback URL
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/auth/login?error=google_failed`,
    session: false,
  }),
  (req, res) => {
    const jwt = require("../utils/jwt");
    const accessToken = jwt.generateAccessToken({
      id: req.user._id,
      role: req.user.role,
      email: req.user.email,
      profileImage: req.user.profileImage,
      fullName: req.user.fullName,
    });
    const refreshToken = jwt.generateRefreshToken({
      email: req.user.email,
      id: req.user._id,
      role: req.user.role,
      fullName: req.user.fullName,
    });

    //set refresh token to cookie

    res.redirect(`${CLIENT_URL}/auth/success/${accessToken}`);
  }
);

module.exports = router;
