const User    = require("../models/User");
const Garment = require("../models/Garment");
const bcrypt  = require("bcrypt");

// vista login
exports.loginPage = (req, res) => {
    res.render("login");
};

// vista register
exports.registerPage = (req, res) => {
    res.render("register");
};

// registrar usuario
exports.register = (req, res) => {
    const { name, email, password } = req.body;

    User.create(name, email, password, (err) => {
        if (err) return res.send("Error registrando usuario");
        res.redirect("/login");
    });
};

// login
exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err || !user) return res.send("Usuario no encontrado");

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) return res.send("Password incorrecta");

        req.session.user = user;
        res.redirect("/dashboard");
    });
};

// dashboard — trae prendas agrupadas por categoría
exports.dashboard = (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    Garment.getByUser(req.session.user.id, (err, garments) => {
        if (err) garments = [];

        // Agrupar por categoría
        const wardrobe = {
            tops:        garments.filter(g => g.category === "tops"),
            bottoms:     garments.filter(g => g.category === "bottoms"),
            shoes:       garments.filter(g => g.category === "shoes"),
            accessories: garments.filter(g => g.category === "accessories"),
            tshirts:   garments.filter(g => g.category === "tshirts"),
        };

        // Outfit aleatorio si hay prendas suficientes
        const random = arr => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

        // Usar outfit guardado en sesión, o generar uno nuevo
        const autoOutfit = req.session.outfit || {
            top: random(wardrobe.tops),
            bottom: random(wardrobe.bottoms),
            shoes: random(wardrobe.shoes),
            acc1: random(wardrobe.accessories),
            acc2: random(wardrobe.accessories),
            extra: random(wardrobe.tshirts)
        };

        // Si es nuevo, guardarlo en sesión
        if (!req.session.outfit) req.session.outfit = autoOutfit;

        res.render("dashboard", {
            user: req.session.user,
            wardrobe,
            autoOutfit,
            hasGarments: garments.length > 0,
        });
    });
};

// Save Outfit in session
exports.saveOutfit = (req, res) => {
    if (!req.session.user) return res.status(401).json({ ok: false });
    req.session.outfit = req.body.outfit;
    res.json({ ok: true });
};