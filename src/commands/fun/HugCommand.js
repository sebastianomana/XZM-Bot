const InteractionCommand = require("../../core/base/InteractionCommand");

class HugCommand extends InteractionCommand {

    constructor() {

        super({

            name: "hug",

            aliases: [],

            description: "Abraza a otro usuario.",

            asset: "hug",

            emoji: "🤗",

            verb: "abrazó"

        });

    }

}

module.exports = HugCommand;
