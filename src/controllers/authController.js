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
            outerwear:   garments.filter(g => g.category === "outerwear"),
        };

        // Outfit aleatorio si hay prendas suficientes
        const random = arr => arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

        const autoOutfit = {
            top: random(wardrobe.tops),
            bottom: random(wardrobe.bottoms),
            shoes: random(wardrobe.shoes),
            acc1: random(wardrobe.accessories),
            acc2: random(wardrobe.accessories),
            extra: random(wardrobe.outerwear)
        };

        res.render("dashboard", {
            user:      req.session.user,
            wardrobe,
            autoOutfit,
            hasGarments: garments.length > 0,
        });
    });
};
