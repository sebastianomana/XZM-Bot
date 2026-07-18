const InteractionCommand = require("../../core/base/InteractionCommand");

class KickCommand extends InteractionCommand {

    constructor() {

        super({

            name: "kick",

            aliases: [],

            description: "Patea a otro usuario.",

            asset: "kick",

            emoji: "🦵",

            verb: "pateó"

        });

    }

}

module.exports = KickCommand;
