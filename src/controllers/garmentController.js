const fs = require("fs");
const multer = require("multer");
const path = require("path");

const Garment = require("../models/Garment");
const imageProcessor = require("../services/imageProcessor");

// --------------------
// Multer
// --------------------
const UPLOAD_DIR = "public/uploads/garments/temp/";
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ok =
            allowed.test(path.extname(file.originalname).toLowerCase()) &&
            allowed.test(file.mimetype);
        ok
            ? cb(null, true)
            : cb(new Error("Only images allowed"));
    }
});
exports.upload = upload.single("image");

// --------------------
// List
// --------------------
exports.list = (req, res) => {
    Garment.getByUser(req.session.user.id, (err, garments) => {
        if (err) return res.status(500).send("Error");
        res.render("garments", {
            garments,
            user: req.session.user
        });
    });
};

// --------------------
// Create Page
// --------------------
exports.createPage = (req, res) => {
    res.render("garment-create", {
        user: req.session.user
    });
};

// --------------------
// Create
// --------------------
exports.create = async (req, res) => {

    try {
        console.log("========== CREATE GARMENT ==========");
        console.log("Body:", req.body);
        console.log("File:", req.file);
        const { name, category, color } = req.body;
        let image_path = null;

        if (req.file) {
            console.log("Processing image...");
            try {
                image_path = await imageProcessor.process(req.file);
                console.log("Image processed successfully");
                console.log("image_path:", image_path);
            } catch (err) {
                console.error("Image processing failed (continuing without image):", err.message);
                image_path = null;
            }
        } else {
            console.log("No image uploaded");
        }
        console.log("Saving garment into DB...");
        Garment.create(
            req.session.user.id,
            name,
            category,
            color,
            image_path,
            (err) => {
                if (err) {
                    console.error("DB ERROR:");
                    console.error(err);
                    return res.status(500).send("Error creando prenda");
                }
                console.log("Garment saved correctly");
                console.log("Redirecting...");
                res.redirect("/garments");
            }
        );
    }
    catch (err) {
        console.error("========== CREATE ERROR ==========");
        console.error(err);
        res.status(500).send("Error procesando imagen");
    }
};

// --------------------
// Edit
// --------------------
exports.editPage = (req, res) => {
    Garment.getById(
        req.params.id,
        req.session.user.id,
        (err, garment) => {
            if (err || !garment)
                return res.status(404).send("Prenda no encontrada");
            res.render("garment-edit", {
                garment,
                user: req.session.user
            });
        }
    );
};

// --------------------
// Update
// --------------------
exports.update = async (req, res) => {
    try {
        const { name, category, color } = req.body;
        let image_path = null;
        if (req.file) {
            try {
                image_path = await imageProcessor.process(req.file);
            } catch (err) {
                console.error("Image processing failed (update continuing without image):", err.message);
            }
        }
        Garment.update(
            req.params.id,
            req.session.user.id,
            name,
            category,
            color,
            image_path,
            (err) => {
                if (err)
                    return res.status(500).send("Error actualizando prenda");
                res.redirect("/garments");
            }
        );
    }
    catch (err) {
        console.error(err);
        res.send("Error");
    }
};

// --------------------
// Delete
// --------------------
exports.delete = (req, res) => {
    Garment.delete(
        req.params.id,
        req.session.user.id,
        (err) => {
                if (err)
                    return res.status(500).send("Error");
            res.redirect("/garments");
        }
    );
};