const ConsoleUI = require("../ui/ConsoleUI");

const CommandManager = require("./CommandManager");
const EventManager = require("./EventManager");
const PluginManager = require("./PluginManager");
const CooldownManager = require("./CooldownManager");

const WhatsAppService = require("../services/WhatsAppService");

class Bot {

    constructor() {

        this.commands = new CommandManager();
        this.events = new EventManager();
        this.plugins = new PluginManager();
        this.cooldowns = new CooldownManager();

        this.whatsapp = null;

    }

    async start() {

        // Estado inicial
        ConsoleUI.setStatus("Iniciando...");
        ConsoleUI.info("Inicializando framework...");

        // Cargar plugins
        this.plugins.load();
        ConsoleUI.success("Plugins cargados.");

        // Cargar eventos
        this.events.load();
        ConsoleUI.success("Eventos cargados.");

        // Cargar comandos
        const total = this.commands.load();

ConsoleUI.setCommands(total);

ConsoleUI.success(
    `${total} comandos cargados.`
);

        ConsoleUI.setPlugins(0);

        // Dibujamos UNA SOLA VEZ
        ConsoleUI.render();

        // Iniciar WhatsApp
        this.whatsapp = new WhatsAppService({

    commandManager: this.commands,

    bot: this

});

        await this.whatsapp.start();

    }

}

module.exports = Bot;