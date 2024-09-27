import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "http://localhost:5000/auth/login-failed",
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(req.user);
    req.session.user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      facebookId: req.user.facebookId,
    };

    res.redirect(`${process.env.FRONTEND_URL}/homepage?token=${token}`);
  }
);

router.get("/login-failed", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/?error=login_failed`);
});

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/current_user", (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

export default router;
