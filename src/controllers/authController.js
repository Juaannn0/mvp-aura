const User = require("../models/User");
const bcrypt = require("bcrypt");

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

// dashboard
exports.dashboard = (req, res) => {
    if (!req.session.user) return res.redirect("/login");

    res.render("dashboard", { user: req.session.user });
};