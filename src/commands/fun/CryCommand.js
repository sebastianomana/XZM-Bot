const ReactionCommand = require("../../core/base/ReactionCommand");

class CryCommand extends ReactionCommand {

    constructor() {

        super({

            name: "cry",

            aliases: [],

            description: "Llora.",

            asset: "cry",

            emoji: "😭",

            text: "está llorando."

        });

    }

}

module.exports = CryCommand;
