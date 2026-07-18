const InteractionCommand = require("../../core/base/InteractionCommand");

class FeedCommand extends InteractionCommand {

    constructor() {

        super({

            name: "feed",

            aliases: [],

            description: "Alimenta a otro usuario.",

            asset: "feed",

            emoji: "🍰",

            verb: "alimentó a"

        });

    }

}

module.exports = FeedCommand;
