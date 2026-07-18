const Command = require("./Command");
const ContactManager = require("../../managers/ContactManager");

class InteractionCommand extends Command {

    constructor(options) {

        super({

        ...options,

        category: "fun"

    });

        this.asset = options.asset;
        this.emoji = options.emoji;
        this.verb = options.verb;

    }

    async execute(ctx) {

    if (!(await ctx.requireMention()))
        return;

    const AssetService = require("../../services/AssetService");

    const gif = AssetService.random(this.asset);

    if (!gif) {

        return ctx.reply(
            "❌ No existen assets para esta acción."
        );

    }

    await ctx.sendGif(

        gif,

        `${this.emoji} @${ctx.sender.split("@")[0]} ${this.verb} a @${ctx.mentioned.split("@")[0]}`,

        [

            ctx.sender,

            ctx.mentioned

        ]

    );

}

}

module.exports = InteractionCommand;