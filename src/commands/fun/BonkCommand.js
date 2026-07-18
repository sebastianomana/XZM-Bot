const InteractionCommand = require("../../core/base/InteractionCommand");

class BonkCommand extends InteractionCommand {

    constructor() {

        super({

            name: "bonk",

            aliases: [],

            description: "Da un bonk a otro usuario.",

            asset: "bonk",

            emoji: "🔨",

            verb: "golpeó a"

        });

    }

}

module.exports = BonkCommand;
