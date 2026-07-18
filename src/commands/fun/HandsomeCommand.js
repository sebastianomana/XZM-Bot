const PercentageCommand = require("../../core/base/PercentageCommand");

class HandsomeCommand extends PercentageCommand {

    constructor() {

        super({

            name: "handsome",

            aliases: ["guapo"],

            description: "Calcula qué tan guapo es un usuario.",

            emoji: "💪",

            label: "Guapo"

        });

    }

}

module.exports = HandsomeCommand;