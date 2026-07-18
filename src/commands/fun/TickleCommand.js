const InteractionCommand = require("../../core/base/InteractionCommand");

class TickleCommand extends InteractionCommand {

    constructor() {

        super({

            name: "tickle",

            aliases: [],

            description: "Hace cosquillas a otro usuario.",

            asset: "tickle",

            emoji: "🤭",

            verb: "hizo cosquillas a"

        });

    }

}

module.exports = TickleCommand;
