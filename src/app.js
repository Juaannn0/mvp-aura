const express = require("express");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const garmentRoutes = require("./routes/garmentRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./src/views");

// sesiones
app.use(session({
    secret: "aura-secret",
    resave: false,
    saveUninitialized: false
}));

// rutas
app.use("/", authRoutes);
app.use("/garments", garmentRoutes);

app.get("/", (req, res) => {
    res.redirect("/login");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor en puerto ${PORT}`);
});