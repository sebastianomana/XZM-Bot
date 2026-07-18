const InteractionCommand = require("../../core/base/InteractionCommand");

class HandholdCommand extends InteractionCommand {

    constructor() {

        super({

            name: "handhold",

            aliases: [],

            description: "Toma de la mano a otro usuario.",

            asset: "handhold",

            emoji: "🤝",

            verb: "tomó de la mano a"

        });

    }

}

module.exports = HandholdCommand;
