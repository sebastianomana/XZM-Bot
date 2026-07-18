const axios = require("axios");

class ActionService {

    constructor() {

        this.baseURL = "https://api.waifu.pics/sfw";

    }

    async image(action) {

        try {

            const { data } = await axios.get(
                `${this.baseURL}/${action}`
            );

            console.log(data);

            return data.url;

        }

        catch (err) {

            console.log(err.message);

            if (err.response)
                console.log(err.response.data);

            return null;

        }

    }

}

module.exports = new ActionService();