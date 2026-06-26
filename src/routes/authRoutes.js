const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const auth = require("../controllers/authController");

// vistas
router.get("/", auth.landingPage);
router.get("/login", auth.loginPage);
router.get("/register", auth.registerPage);
router.get("/dashboard", authMiddleware, auth.dashboard);

// acciones
router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/outfit/save", authMiddleware, auth.saveOutfit);
router.post("/onboarding/complete", authMiddleware, auth.completeOnboarding);

module.exports = router;