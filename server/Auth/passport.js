const connection = require("../db/dbConfig");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const [rows, fields] = await connection.execute(
        "SELECT * FROM Users WHERE userId = ?",
        [id]
      );
      if (rows.length === 0) {
        return done(new Error("User not found"));
      }
      const user = rows[0];
      done(null, user);
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(error);
    }
  });

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

        try {
          // Check if the user already exists in the database
          const [rows, fields] = await connection.execute(
            "SELECT * FROM Users WHERE userId = ?",
            [userId]
          );
          if (rows.length > 0) {
            // User already exists, return the user
            const user = rows[0];
            return done(null, user);
          }

          // If the user doesn't exist, create a new user record
          const username = displayName;
          const firstName = givenName;
          const lastName = familyName;
          const email = emails[0].value;

          // Perform database query to save user data
          const [result, _] = await connection.execute(
            "INSERT INTO Users (username, firstName, lastName, email) VALUES (?, ?, ?, ?)",
            [username, firstName, lastName, email]
          );

          // Create a user object without password
          const newUser = {
            userId: result.insertId,
            username,
            firstName,
            lastName,
            email,
          };

          // Return the newly created user
          done(null, newUser);
        } catch (error) {
          console.error("Error authenticating user:", error);
          done(error);
        }
      }
    )
  );
};
