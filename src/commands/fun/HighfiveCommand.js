const InteractionCommand = require("../../core/base/InteractionCommand");

class HighfiveCommand extends InteractionCommand {

    constructor() {

        super({

            name: "highfive",

            aliases: [],

            description: "Choca los cinco con otro usuario.",

            asset: "highfive",

            emoji: "🙌",

            verb: "chocó los cinco con"

        });

    }

}

module.exports = HighfiveCommand;
