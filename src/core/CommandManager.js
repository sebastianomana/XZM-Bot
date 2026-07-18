const fs = require("fs");
const path = require("path");

class CommandManager {

    constructor() {

        this.commands = new Map();
        this.aliases = new Map();

    }

    load() {

        this.commands.clear();
        this.aliases.clear();

        const commandsPath = path.join(__dirname, "../commands");

        if (!fs.existsSync(commandsPath))
            return 0;

        let total = 0;

        const folders = fs.readdirSync(commandsPath);

        for (const folder of folders) {

            const folderPath = path.join(commandsPath, folder);

            if (!fs.statSync(folderPath).isDirectory())
                continue;

            const files = fs.readdirSync(folderPath);

            for (const file of files) {

                if (!file.endsWith(".js"))
                    continue;

                try {

                    const filePath = path.join(folderPath, file);

                    delete require.cache[require.resolve(filePath)];

                    const CommandClass = require(filePath);

                    const command = new CommandClass();

                    if (!command.name)
                        continue;

                    this.commands.set(command.name, command);

                    if (Array.isArray(command.aliases)) {

                        for (const alias of command.aliases) {
                            this.aliases.set(alias, command.name);
                        }

                    }

                    total++;

                } catch (err) {

                    console.error(`Error cargando ${file}:`, err.message);

                }

            }

        }

        return total;

    }

    get(name) {

        if (this.commands.has(name))
            return this.commands.get(name);

        if (this.aliases.has(name))
            return this.commands.get(this.aliases.get(name));

        return null;

    }

    has(name) {

        return this.get(name) !== null;

    }

    count() {

        return this.commands.size;

    }

    getAll() {

    return Array.from(this.commands.values());

}

    async execute(ctx) {

    const command = this.get(ctx.command);

    if (!command)
        return false;

    // Grupo

    if (command.group && !ctx.isGroup) {

        await ctx.reply(
            "❌ Este comando solo funciona en grupos."
        );

        return true;

    }

    // Privado

if (command.private && ctx.isGroup) {

    await ctx.reply(
        "❌ Este comando solo funciona en chats privados."
    );

    return true;

}

// Owner

// Premium

// Admin

// Bot Admin



    if (command.private && ctx.isGroup) {

        await ctx.reply(
            "❌ Este comando solo funciona en chats privados."
        );

        return true;

    }

    try {

        const remaining =
    ctx.bot.cooldowns.check(

        ctx.sender,

        command.name,

        command.cooldown

    );

if (remaining > 0) {

    await ctx.reply(
        `⏳ Espera ${remaining}s antes de volver a usar este comando.`
    );

    return true;

}

        await command.execute(ctx);

    }
    catch (err) {

    console.error(err);

    await ctx.reply(
        "❌ Ocurrió un error ejecutando el comando."
    );

    return true;

}

    return true;

}

}

module.exports = CommandManager;



