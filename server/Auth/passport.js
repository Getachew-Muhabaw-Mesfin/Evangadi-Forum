const GoogleStrategy = require("passport-google-oauth20").Strategy;
const connection = require("../db/dbConfig");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback", 
      },
      async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, givenName, familyName, emails } = profile;
        const userId = id;
        const username = displayName;
        const firstName = givenName;
        const lastName = familyName;
        const email = emails[0].value;
        const password = 123456789; // Set password to null or generate a random password

        // Perform database query to save user data
        try {
          const user = await connection.execute(
            "INSERT INTO Users (userId,username, firstName, lastName, email, password) VALUES (?,?, ?, ?, ?, ?)",
            [userId, username, firstName, lastName, email, password]
          );
          done(null, user[0]);
        } catch (error) {
          console.error("Error saving user data:", error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
