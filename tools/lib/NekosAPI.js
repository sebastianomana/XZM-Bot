const axios = require("axios");

class NekosAPI {

    constructor() {

        this.baseURL = "https://nekos.best/api/v2";

    }

    async random(category) {

        try {

            const { data } = await axios.get(
                `${this.baseURL}/${category}`
            );

            if (!data.results)
                return null;

            if (data.results.length === 0)
                return null;

            return data.results[0].url;

        }

        catch {

            return null;

        }

    }

}

module.exports = new NekosAPI();