const ReactionCommand = require("../../core/base/ReactionCommand");

class BlushCommand extends ReactionCommand {

    constructor() {

        super({

            name: "blush",

            aliases: [],

            description: "Se sonroja.",

            asset: "blush",

            emoji: "😊",

            text: "se sonrojó."

        });

    }

}

module.exports = BlushCommand;
