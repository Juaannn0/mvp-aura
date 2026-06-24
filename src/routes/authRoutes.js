const express = require("express");
const router = express.Router();

const auth = require("../controllers/authController");

// vistas
router.get("/login", auth.loginPage);
router.get("/register", auth.registerPage);
router.get("/dashboard", auth.dashboard);

// acciones
router.post("/register", auth.register);
router.post("/login", auth.login);

module.exports = router;