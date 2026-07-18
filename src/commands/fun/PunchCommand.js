const InteractionCommand = require("../../core/base/InteractionCommand");

class PunchCommand extends InteractionCommand {

    constructor() {

        super({

            name: "punch",

            aliases: [],

            description: "Golpea a otro usuario.",

            asset: "punch",

            emoji: "👊",

            verb: "golpeó"

        });

    }

}

module.exports = PunchCommand;
