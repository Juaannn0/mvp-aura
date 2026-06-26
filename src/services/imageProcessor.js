const fs = require("fs");
const path = require("path");

const axios = require("axios");
const FormData = require("form-data");

exports.process = async (file) => {

    console.log("========== IMAGE PROCESS ==========");
    console.log("Temp file:", file.path);
    console.log("IMAGE_SERVICE_URL:", process.env.IMAGE_SERVICE_URL);

    const form = new FormData();

    form.append(
        "image",
        fs.createReadStream(file.path)
    );

    console.log("Calling image service...");

    let response;

    try {
        response = await axios.post(
            process.env.IMAGE_SERVICE_URL.replace(/\/+$/, "") + "/process",
            form,
            {
                headers: form.getHeaders(),
                responseType: "arraybuffer",
                timeout: 30000
            }
        );
    } catch (err) {
        console.log("===== AXIOS ERROR =====");
        console.log("Message:", err.message);
        console.log("Code:", err.code);

        if (err.response) {
            console.log("Status:", err.response.status);
            console.log("Response:", err.response.data.toString());
        }
        throw err;
    }

    console.log("Axios finished");
    console.log("Image service OK");
    console.log("Status:", response.status);
    console.log("Bytes:", response.data.length);

    const filename =
        path.parse(file.filename).name + ".webp";

    const destination =
        path.join(
            __dirname,
            "../../public/uploads/garments",
            filename
        );

    console.log("Saving to:", destination);

    const garmentsDir = path.dirname(destination);
    if (!fs.existsSync(garmentsDir)) {
        fs.mkdirSync(garmentsDir, { recursive: true });
    }

    fs.writeFileSync(
        destination,
        response.data
    );

    console.log("Saved:", fs.existsSync(destination));

    if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log("Deleted temp file");
    }

    console.log("Returning:", "uploads/garments/" + filename);

    return "uploads/garments/" + filename;
};