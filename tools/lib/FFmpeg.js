const path = require("path");
const { spawn } = require("child_process");

class FFmpeg {

    constructor() {

        this.ffmpeg = path.join(
            __dirname,
            "..",
            "vendor",
            "ffmpeg",
            "bin",
            "ffmpeg.exe"
        );

    }

    convertGifToMp4(input, output) {

        return new Promise((resolve, reject) => {

            const args = [

                "-y",

                "-i", input,

                "-movflags", "faststart",

                "-pix_fmt", "yuv420p",

                "-vf",
                "scale=trunc(iw/2)*2:trunc(ih/2)*2",

                output

            ];

            const ffmpeg = spawn(this.ffmpeg, args);

            ffmpeg.on("error", reject);

            ffmpeg.on("close", code => {

                if (code === 0)
                    resolve();

                else
                    reject(
                        new Error(
                            `FFmpeg terminó con código ${code}`
                        )
                    );

            });

        });

    }

}

module.exports = new FFmpeg();