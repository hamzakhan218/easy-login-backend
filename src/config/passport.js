import { Strategy as FacebookStrategy } from "passport-facebook";
import crypto from "crypto";
import User from "../models/user.js";

const passportConfig = function (passport) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "emails", "name"],
      },
      async (accessToken, profile, done) => {
        const { id, emails, name } = profile;

        try {
          const appSecretProof = crypto
            .createHmac("sha256", process.env.FACEBOOK_APP_SECRET)
            .update(accessToken)
            .digest("hex");

          console.log(`Access Token: ${accessToken}`);
          console.log(`App Secret Proof: ${appSecretProof}`);
          let user = await User.findOne({ facebookId: id });

          if (user) {
            done(null, user);
          } else {
            user = new User({
              facebookId: id,
              name: `${name.givenName} ${name.familyName}`,
              email: emails[0].value,
            });
            await user.save();
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => done(null, user));
  });
};

export default passportConfig;
