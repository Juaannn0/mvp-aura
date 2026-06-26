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
        db.all("PRAGMA table_info(users)", (err, rows) => {
            if (err) return;
            const hasOnboarding = rows.some((row) => row.name === "completed_onboarding");
            if (!hasOnboarding) {
                db.run("ALTER TABLE users ADD COLUMN completed_onboarding INTEGER DEFAULT 0", (err) => {
                    if (err) console.error("Error actualizando tabla users:", err.message);
                });
            }
        });
    }
});

module.exports = db;