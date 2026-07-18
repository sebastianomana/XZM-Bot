const path = require("path");
const FFmpeg = require("./lib/FFmpeg");

(async () => {

    try {

        await FFmpeg.convertGifToMp4(

            path.join(
                __dirname,
                "..",
                "src",
                "assets",
                "actions",
                "hug",
                "hug001.gif"
            ),

            path.join(
                __dirname,
                "..",
                "temp",
                "hug001.mp4"
            )

        );

        console.log("✅ Conversión correcta.");

    }

    catch (err) {

        console.error(err);

    }

})();