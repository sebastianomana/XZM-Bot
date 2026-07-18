const Command = require("../../core/base/Command");

class MenuCommand extends Command {

    constructor() {

        super({

            name: "menu",

            aliases: ["help"],

            category: "owner",

            description: "Muestra el menú del bot.",

            usage: ".menu",

            emoji: "📋",

        });

    }

    async execute(ctx) {

        const commands = ctx.bot.commands.getAll();

        const categories = {};

        for (const command of commands) {

            if (!categories[command.category]) {
                categories[command.category] = [];
            }

            categories[command.category].push(command);

        }

        const icons = {
            owner: "👑",
            fun: "🎉",
            audio: "🎵",
            downloader: "⬇️",
            tools: "🛠️",
            general: "📦"
        };

        let text = "🤖 *Xzm Bot*\n";
        text += "━━━━━━━━━━━━━━━━━━━━━━\n\n";


        for (const category of Object.keys(categories).sort()) {

            text += `${icons[category] || "📁"} *${category.toUpperCase()}*\n`;

            categories[category].sort((a, b) =>
    a.name.localeCompare(b.name)
);

            for (const command of categories[category]) {

                text += `• .${command.name}`;

                if (command.description) {
                    text += ` — ${command.description}`;
                }

                text += "\n";

            }

            text += "\n";

        }

        text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        

        await ctx.reply(text);

    }

}

module.exports = MenuCommand;