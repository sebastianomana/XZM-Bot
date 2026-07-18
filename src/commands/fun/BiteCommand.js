const InteractionCommand = require("../../core/base/InteractionCommand");

class BiteCommand extends InteractionCommand {

    constructor() {

        super({

            name: "bite",

            aliases: [],

            description: "Muerde a otro usuario.",

            asset: "bite",

            emoji: "🦷",

            verb: "mordió"

        });

    }

}

module.exports = BiteCommand;
