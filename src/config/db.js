const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// ruta del archivo DB
const dbPath = path.join(__dirname, "../../database/database.db");

// crear DB si no existe
const db = new sqlite3.Database(dbPath);

// leer schema.sql
const schema = fs.readFileSync(
    path.join(__dirname, "../../database/schema.sql"),
    "utf-8"
);

// ejecutar schema al iniciar
db.exec(schema, (err) => {
    if (err) {
        console.error("Error creando tablas:", err.message);
    } else {
        console.log("Base de datos inicializada correctamente");
    }
});

module.exports = db;