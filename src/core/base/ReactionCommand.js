const Command = require("./Command");

class ReactionCommand extends Command {

    constructor(options) {

        super({

        ...options,

        category: "fun"

    });

        this.asset = options.asset;
        this.emoji = options.emoji;
        this.text = options.text;

    }

    async execute(ctx) {

        const AssetService = require("../../services/AssetService");

        const gif = AssetService.random(this.asset);

        if (!gif) {

            return ctx.reply(
                "❌ No existen assets para esta acción."
            );

        }

        await ctx.sendGif(

            gif,

            `${this.emoji} @${ctx.sender.split("@")[0]} ${this.text}`,

            [

                ctx.sender

            ]

        );

    }

}

module.exports = ReactionCommand;