const PercentageCommand = require("../../core/base/PercentageCommand");

class LesbianCommand extends PercentageCommand {

    constructor() {

        super({

            name: "lesbian",

            aliases: ["lesbiana"],

            description: "Calcula qué tan lesbiana es una usuaria.",

            emoji: "🌈",

            label: "Lesbiana"

        });

    }

}

module.exports = LesbianCommand;