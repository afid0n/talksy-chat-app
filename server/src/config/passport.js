// server/src/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userModel");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SERVER_URL,
} = require("./config");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_URL}/auth/google/callback`,
      passReqToCallback: true, // Req obyektinə çıxış ver
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Əgər user artıq var idisə (googleId ilə)
        const existingUser = await UserModel.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        // Eyni email local auth ilə istifadə olunubsa
        const emailTaken = await UserModel.findOne({
          email: profile.emails[0].value,
        });
        if (emailTaken) {
          return done(null, false, {
            message: "Email is already used with local auth.",
          });
        }

        // req.session içindən əlavə məlumatlar (frontenddə əvvəl localStorage-dən serverə ötürülməlidir)
        const registerData = req.session?.registerData || {};
        const { birthday, location, interests } = registerData;

        // ✅ JSON obyektlərdə parse ehtiyacı yoxdursa, birbaşa yazılır
        const newUser = await UserModel.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value.split("@")[0],
          profileImage: profile.photos?.[0].value,
          googleId: profile.id,
          authProvider: "google",
          emailVerified: true,
          birthday: birthday ? new Date(birthday) : null,
          location: typeof location === "string" ? JSON.parse(location) : location,
          interests: typeof interests === "string" ? JSON.parse(interests) : interests,
        });

        done(null, newUser);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        done(error, false);
      }
    }
  )
);

// Session serialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
