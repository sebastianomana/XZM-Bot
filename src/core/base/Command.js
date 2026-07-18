class Command {

    constructor(options = {}) {

        this.name = options.name || "";

        this.aliases = options.aliases || [];

        this.category = options.category || "general";

        this.description = options.description || "Sin descripción";

        this.usage = options.usage || "";

        this.emoji = options.emoji || "📄";

        this.cooldown = options.cooldown || 0;

        this.owner = options.owner || false;

        this.premium = options.premium || false;

        this.group = options.group || false;

        this.private = options.private || false;

        this.admin = options.admin || false;

        this.botAdmin = options.botAdmin || false;

    }

    async execute(ctx) {

        throw new Error(
            `${this.name} no implementa execute().`
        );

    }

}

module.exports = Command;