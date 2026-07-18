const InteractionCommand = require("../../core/base/InteractionCommand");

class CuddleCommand extends InteractionCommand {

    constructor() {

        super({

            name: "cuddle",

            aliases: [],

            description: "Abraza cariñosamente.",

            asset: "cuddle",

            emoji: "❤️",

            verb: "abrazó cariñosamente"

        });

    }

}

module.exports = CuddleCommand;
