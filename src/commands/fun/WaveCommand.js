const InteractionCommand = require("../../core/base/InteractionCommand");

class WaveCommand extends InteractionCommand {

    constructor() {

        super({

            name: "wave",

            aliases: [],

            description: "Saluda.",

            asset: "wave",

            emoji: "👋",

            verb: "saludó a"

        });

    }

}

module.exports = WaveCommand;
