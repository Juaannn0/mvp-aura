const multer = require("multer");
const path = require("path");

const Garment = require("../models/Garment");
const imageProcessor = require("../services/imageProcessor");

// --------------------
// Multer
// --------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/garments/");
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
        if (err) return res.send("Error");
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
        const { name, category, color } = req.body;
        let image_path = null;
        if (req.file) {
            image_path = await imageProcessor.process(req.file);
        }
        Garment.create(
            req.session.user.id,
            name,
            category,
            color,
            image_path,
            (err) => {
                if (err)
                    return res.send("Error creando prenda");
                res.redirect("/garments");
            }
        );
    }
    catch (err) {
        console.error(err);
        res.send("Error procesando imagen");
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
                return res.send("Prenda no encontrada");
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
            image_path = await imageProcessor.process(req.file);
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
                    return res.send("Error actualizando prenda");
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
                return res.send("Error");
            res.redirect("/garments");
        }
    );
};