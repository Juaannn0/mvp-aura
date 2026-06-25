const path = require("path");

exports.process = async (file) => {
    return "uploads/garments/" + file.filename;
};