const InteractionCommand = require("../../core/base/InteractionCommand");

class PatCommand extends InteractionCommand {

    constructor() {

        super({

            name: "pat",

            aliases: [],

            description: "Acaricia a otro usuario.",

            asset: "pat",

            emoji: "🐾",

            verb: "acarició"

        });

    }

}

module.exports = PatCommand;
