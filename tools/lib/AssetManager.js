const FileManager = require("./FileManager");

class AssetManager {

    random(category) {

        const files = FileManager.files(category);

        if (files.length === 0)
            return null;

        const index = Math.floor(
            Math.random() * files.length
        );

        return FileManager.path(
            category,
            files[index]
        );

    }

    count(category) {

        return FileManager.count(category);

    }

    categories() {

        return FileManager.categories();

    }

}

module.exports = new AssetManager();