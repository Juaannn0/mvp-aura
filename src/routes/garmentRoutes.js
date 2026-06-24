const express = require("express");
const router  = express.Router();

const auth             = require("../middleware/authMiddleware");
const garmentController = require("../controllers/garmentController");

// listar
router.get("/", auth, garmentController.list);

// crear
router.get("/create", auth, garmentController.createPage);
router.post("/create", auth, garmentController.upload, garmentController.create);

// editar
router.get("/edit/:id", auth, garmentController.editPage);
router.post("/edit/:id", auth, garmentController.upload, garmentController.update);

// eliminar
router.post("/delete/:id", auth, garmentController.delete);

module.exports = router;
