const path = require("path");

exports.getExtension = (filename)=>{
    return path.extname(filename);
}