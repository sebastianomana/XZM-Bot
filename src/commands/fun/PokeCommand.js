const InteractionCommand = require("../../core/base/InteractionCommand");

class PokeCommand extends InteractionCommand {

    constructor() {

        super({

            name: "poke",

            aliases: [],

            description: "Pincha a otro usuario.",

            asset: "poke",

            emoji: "👉",

            verb: "pinchó"

        });

    }

}

module.exports = PokeCommand;
