const fs = require("fs");
const path = require("path");

class FileManager {

    constructor() {

        this.assetsFolder = path.join(
            __dirname,
            "../../src/assets/actions"
        );

    }

    ensureFolder(category) {

        const folder = path.join(
            this.assetsFolder,
            category
        );

        if (!fs.existsSync(folder)) {

            fs.mkdirSync(folder, {
                recursive: true
            });

        }

        return folder;

    }

    files(category) {

        const folder = this.ensureFolder(category);

        return fs.readdirSync(folder)
            .filter(file => file.endsWith(".mp4"));

    }

    count(category) {

        return this.files(category).length;

    }

    nextName(category) {

        const next = this.count(category) + 1;

        return `${category}${String(next).padStart(3, "0")}`;

    }

    saveTempGif(category, buffer) {

        const folder = this.ensureFolder(category);

        const filename =
            this.nextName(category) + ".gif";

        const destination = path.join(
            folder,
            filename
        );

        fs.writeFileSync(
            destination,
            buffer
        );

        return destination;

    }

    mp4Path(category) {

        const folder = this.ensureFolder(category);

        return path.join(
            folder,
            this.nextName(category) + ".mp4"
        );

    }

    remove(file) {

        if (fs.existsSync(file))
            fs.unlinkSync(file);

    }

    path(category, file) {

        return path.join(
            this.ensureFolder(category),
            file
        );

    }

    categories() {

        return fs.readdirSync(this.assetsFolder)
            .filter(folder =>
                fs.statSync(
                    path.join(
                        this.assetsFolder,
                        folder
                    )
                ).isDirectory()
            );

    }

}

module.exports = new FileManager();