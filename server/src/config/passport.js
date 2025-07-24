//google auth config
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userModel");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } = require("./config");

passport.use(
 new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${SERVER_URL}/auth/google/callback`,
    passReqToCallback: true, // ⬅️ bunu əlavə et
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await UserModel.findOne({ googleId: profile.id });
      if (existingUser) return done(null, existingUser);

      // Email yoxla
      const emailTaken = await UserModel.findOne({
        email: profile.emails[0].value,
      });
      if (emailTaken) {
        return done(null, false, {
          message: "Email is already used with local auth.",
        });
      }

      // 🔥 registerData sessiondan götür
      const registerData = req.session?.registerData || {};
      const { birthday, location, interests } = registerData;

      const newUser = await UserModel.create({
        fullName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.emails[0].value.split("@")[0],
        profileImage: profile.photos?.[0].value,
        googleId: profile.id,
        authProvider: "google",
        emailVerified: true,
        birthday: birthday ? new Date(birthday) : null,
        location: location ? JSON.parse(location) : {},
        interests: interests ? JSON.parse(interests) : [],
      });

      done(null, newUser);
    } catch (error) {
      done(error, false);
    }
  }
)
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});
