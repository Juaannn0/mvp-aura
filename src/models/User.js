const db = require("../config/db");
const bcrypt = require("bcrypt");

class User {

    static create(name, email, password, callback) {
        const hash = bcrypt.hashSync(password, 10);

        const sql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.run(sql, [name, email, hash], function(err) {
            callback(err, this?.lastID);
        });
    }

    static findByEmail(email, callback) {
        const sql = `
            SELECT * FROM users WHERE email = ?
        `;

        db.get(sql, [email], (err, row) => {
            callback(err, row);
        });
    }

    static completeOnboarding(userId, callback) {
        const sql = `
            UPDATE users SET completed_onboarding = 1 WHERE id = ?
        `;

        db.run(sql, [userId], function(err) {
            callback(err, this?.changes);
        });
    }
}

module.exports = User;