const ReactionCommand = require("../../core/base/ReactionCommand");

class SmileCommand extends ReactionCommand {

    constructor() {

        super({

            name: "smile",

            aliases: [],

            description: "Sonríe.",

            asset: "smile",

            emoji: "😊",

            text: "está sonriendo."

        });

    }

}

module.exports = SmileCommand;
