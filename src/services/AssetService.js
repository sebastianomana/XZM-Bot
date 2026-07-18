const fs = require("fs");
const path = require("path");

class AssetService {

    constructor() {

        this.base = path.join(
            __dirname,
            "../assets/actions"
        );

    }

    random(category) {

    const folder = path.join(
        this.base,
        category
    );

    if (!fs.existsSync(folder))
        return null;

    const files = fs.readdirSync(folder)
        .filter(file => file.endsWith(".mp4"));

    if (files.length === 0)
        return null;

    const random =
        files[
            Math.floor(
                Math.random() * files.length
            )
        ];

    return path.join(
        folder,
        random
    );

}

}

module.exports = new AssetService();