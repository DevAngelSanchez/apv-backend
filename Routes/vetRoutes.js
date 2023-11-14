import express from "express";
import { confirmEmail, profile, auth, register, resetPass, checkToken, newPass, updateProfile, updatePass } from "../controllers/vetController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// Non auth required to show those views
router.post("/", register);
router.get("/confirm/:token", confirmEmail);
router.post("/login", auth);
router.post("/reset-pass", resetPass);
router.route("/reset-pass/:token")
  .get(checkToken)
  .post(newPass);


// Auth required to show those views
router.get("/profile", checkAuth, profile);
router.put("/profile/:id", checkAuth, updateProfile);
router.put("/change-password", checkAuth, updatePass);

export default router;