const Command = require("../../core/base/Command");

class PingCommand extends Command {

    constructor() {

        super({

            name: "ping",

            aliases: ["p"],

            category: "fun",

            description: "Muestra la latencia del bot.",

            usage: ".ping",

            emoji: "🏓",

            cooldown: 3

        });

    }

    async execute(ctx) {

        const start = Date.now();

        await ctx.react("🏓");

        const latency = Date.now() - start;

        const uptime = process.uptime();

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        await ctx.reply(
`🏓 *Pong!* | *${latency} ms*`
        );

    }

}

module.exports = PingCommand;