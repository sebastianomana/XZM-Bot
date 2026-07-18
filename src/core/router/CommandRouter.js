class CommandRouter {

    constructor(commandManager) {

        this.commandManager = commandManager;

    }

    async execute(ctx) {

        const command =
            this.commandManager.get(ctx.command);

        if (!command)
            return;

        // Owner
        if (command.owner) {

            await ctx.reply(
                "❌ Este comando es solo para el Owner."
            );

            return;

        }

        // Grupo

        if (command.group && !ctx.isGroup) {

            await ctx.reply(
                "❌ Este comando solo funciona en grupos."
            );

            return;

        }

        // Privado

        if (command.private && ctx.isGroup) {

            await ctx.reply(
                "❌ Este comando solo funciona en privado."
            );

            return;

        }

        await command.execute(ctx);

    }

}

module.exports = CommandRouter;