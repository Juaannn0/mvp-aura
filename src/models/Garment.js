const db = require("../config/db");

class Garment {

    static getByUser(userId, callback) {
        db.all(
            "SELECT * FROM garments WHERE user_id = ? ORDER BY id DESC",
            [userId],
            callback
        );
    }

    static create(userId, name, category, color, image_path, callback) {
        db.run(
            `INSERT INTO garments (user_id, name, category, color, image_path)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, name, category, color, image_path],
            callback
        );
    }

    static getById(id, userId, callback) {
        db.get(
            "SELECT * FROM garments WHERE id = ? AND user_id = ?",
            [id, userId],
            callback
        );
    }

    // Si viene image_path nueva la actualiza, si no la deja intacta
    static update(id, userId, name, category, color, image_path, callback) {
        if (image_path) {
            db.run(
                `UPDATE garments
                 SET name = ?, category = ?, color = ?, image_path = ?
                 WHERE id = ? AND user_id = ?`,
                [name, category, color, image_path, id, userId],
                callback
            );
        } else {
            db.run(
                `UPDATE garments
                 SET name = ?, category = ?, color = ?
                 WHERE id = ? AND user_id = ?`,
                [name, category, color, id, userId],
                callback
            );
        }
    }

    static delete(id, userId, callback) {
        db.run(
            "DELETE FROM garments WHERE id = ? AND user_id = ?",
            [id, userId],
            callback
        );
    }
}

module.exports = Garment;
