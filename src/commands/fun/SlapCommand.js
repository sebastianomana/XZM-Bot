const InteractionCommand = require("../../core/base/InteractionCommand");

class SlapCommand extends InteractionCommand {

    constructor() {

        super({

            name: "slap",

            aliases: [],

            description: "Da una bofetada.",

            asset: "slap",

            emoji: "👋",

            verb: "abofeteó"

        });

    }

}

module.exports = SlapCommand;
