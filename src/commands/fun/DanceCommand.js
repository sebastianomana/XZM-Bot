const ReactionCommand = require("../../core/base/ReactionCommand");

class DanceCommand extends ReactionCommand {

    constructor() {

        super({

            name: "dance",

            aliases: [],

            description: "Baila.",

            asset: "dance",

            emoji: "💃",

            text: "está bailando."

        });

    }

}

module.exports = DanceCommand;
