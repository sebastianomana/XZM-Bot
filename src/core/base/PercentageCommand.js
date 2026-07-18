const Command = require("./Command");
const RandomService = require("../../services/RandomService");

class PercentageCommand extends Command {

    constructor(options) {

        super({

            ...options,

            category: "fun"

        });

        this.emoji = options.emoji;
        this.label = options.label;

    }

    async execute(ctx) {

        if (!(await ctx.requireMention()))
            return;

        const percent =
            RandomService.percentage(
                ctx.mentioned
            );

        const bars =
            Math.round(percent / 10);

        const progress =
            "🟩".repeat(bars) +
            "⬜".repeat(10 - bars);

        await ctx.reply(

`${this.emoji} *${this.label.toUpperCase()} METER*

👤 ${ctx.mention(ctx.mentioned)}

${progress}

🎯 Resultado: *${percent}%*`,

            [

                ctx.mentioned

            ]

        );

    }

}

module.exports = PercentageCommand;