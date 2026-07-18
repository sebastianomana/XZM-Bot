const PercentageCommand = require("../../core/base/PercentageCommand");

class GayCommand extends PercentageCommand {

    constructor() {

        super({

            name: "gay",

            aliases: [],

            description: "Calcula qué tan gay es un usuario.",

            emoji: "🏳️‍🌈",

            label: "Gay"

        });

    }

}

module.exports = GayCommand;