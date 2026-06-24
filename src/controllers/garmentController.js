const multer = require("multer");
const path   = require("path");
const Garment = require("../models/Garment");

// ─── Multer config ───────────────────────────────────────────
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ok = allowed.test(path.extname(file.originalname).toLowerCase())
                && allowed.test(file.mimetype);
        ok ? cb(null, true) : cb(new Error("Only images allowed"));
    }
});

exports.upload = upload.single("image"); // middleware reutilizable en routes

// ─── Listar prendas ──────────────────────────────────────────
exports.list = (req, res) => {
    Garment.getByUser(req.session.user.id, (err, garments) => {
        if (err) return res.send("Error");
        res.render("garments", { garments, user: req.session.user });
    });
};

// ─── Vista crear ─────────────────────────────────────────────
exports.createPage = (req, res) => {
    res.render("garment-create", { user: req.session.user });
};

// ─── Crear prenda ─────────────────────────────────────────────
exports.create = (req, res) => {
    const { name, category, color } = req.body;
    const image_path = req.file
        ? "uploads/garments/" + req.file.filename
        : null;

    Garment.create(
        req.session.user.id,
        name,
        category,
        color,
        image_path,
        (err) => {
            if (err) return res.send("Error creando prenda");
            res.redirect("/garments");
        }
    );
};

// ─── Vista editar ─────────────────────────────────────────────
exports.editPage = (req, res) => {
    Garment.getById(req.params.id, req.session.user.id, (err, garment) => {
        if (err || !garment) return res.send("Prenda no encontrada");
        res.render("garment-edit", { garment, user: req.session.user });
    });
};

// ─── Actualizar prenda ────────────────────────────────────────
exports.update = (req, res) => {
    const { name, category, color } = req.body;
    const image_path = req.file
        ? "uploads/garments/" + req.file.filename
        : null; // null = no cambia la imagen existente

    Garment.update(
        req.params.id,
        req.session.user.id,
        name,
        category,
        color,
        image_path,
        (err) => {
            if (err) return res.send("Error actualizando prenda");
            res.redirect("/garments");
        }
    );
};

// ─── Eliminar ─────────────────────────────────────────────────
exports.delete = (req, res) => {
    Garment.delete(req.params.id, req.session.user.id, (err) => {
        if (err) return res.send("Error");
        res.redirect("/garments");
    });
};
