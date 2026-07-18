const axios = require("axios");

class Downloader {

    async buffer(url) {

        try {

            const response = await axios.get(url, {

                responseType: "arraybuffer",

                timeout: 15000

            });

            return Buffer.from(response.data);

        }

        catch (err) {

            return null;

        }

    }

}

module.exports = new Downloader();