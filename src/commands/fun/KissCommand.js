const InteractionCommand = require("../../core/base/InteractionCommand");

class KissCommand extends InteractionCommand {

    constructor() {

        super({

            name: "kiss",

            aliases: [],

            description: "Besa a otro usuario.",

            asset: "kiss",

            emoji: "💋",

            verb: "besó"

        });

    }

}

module.exports = KissCommand;
