const fs = require("fs");

const categories = require("./categories");

const Logger = require("./lib/Logger");
const FileManager = require("./lib/FileManager");
const Downloader = require("./lib/Downloader");
const NekosAPI = require("./lib/NekosAPI");
const Verifier = require("./lib/Verifier");
const FFmpeg = require("./lib/FFmpeg");

(async () => {

    Logger.title("WhatsAppBot Asset Downloader");

    for (const category of categories) {

        Logger.category(category.name);

        let current = FileManager.count(category.name);

        while (current < category.total) {

            // Obtener URL
            const url = await NekosAPI.random(category.name);

            if (!url) {
                Logger.error(
                    `No se pudo obtener un ${category.name}.`
                );
                break;
            }

            // Descargar GIF
            const buffer = await Downloader.buffer(url);

            if (!buffer) {
                Logger.error(
                    `Error descargando ${category.name}.`
                );
                break;
            }

            // Guardar GIF temporal
            const gifPath = FileManager.saveTempGif(
                category.name,
                buffer
            );

            // Ruta del MP4
            const mp4Path = FileManager.mp4Path(
                category.name
            );

            try {

                // Convertir
                await FFmpeg.convertGifToMp4(
                    gifPath,
                    mp4Path
                );

                // Eliminar GIF
                FileManager.remove(gifPath);

                current++;

                Logger.progress(
                    current,
                    category.total
                );

            }
            catch (err) {

                FileManager.remove(gifPath);

                Logger.error(
                    `FFmpeg: ${err.message}`
                );

                break;

            }

        }

    }

    console.log();

    Logger.success(
        "Todos los assets fueron descargados."
    );

    console.log();

    const result = Verifier.verify(categories);

    for (const item of result.report) {

        Logger.stats(item);

    }

    Logger.summary(
        result.totalFiles,
        result.missingFiles
    );

})();