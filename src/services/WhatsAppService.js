const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const readline = require("readline");

const ContactManager = require("../managers/ContactManager");

const pino = require("pino");
const { Boom } = require("@hapi/boom");

const Context = require("../core/Context");
const ConsoleUI = require("../ui/ConsoleUI");


class WhatsAppService {

    constructor(options) {

    this.commandManager = options.commandManager;

    this.bot = options.bot;

    this.sock = null;

}

async askPhoneNumber() {

    return new Promise((resolve) => {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(
            "\n📱 Ingresa tu número de WhatsApp (ej: 573001234567): ",
            (number) => {
                rl.close();
                resolve(number.replace(/\D/g, ""));
            }
        );

    });

}

    async start() {

    const { state, saveCreds } =
        await useMultiFileAuthState("auth");

    const { version } =
        await fetchLatestBaileysVersion();

    this.sock = makeWASocket({

        version,

        auth: state,

        logger: pino({
            level: "silent"
        }),

        browser: [
            "XZM Bot",
            "Chrome",
            "1.0.0"
        ],

        printQRInTerminal: false

    });

    this.sock.ev.on(
        "creds.update",
        saveCreds
    );

    this.sock.ev.on(
        "connection.update",
        this.connectionUpdate.bind(this)
    );

    this.sock.ev.on(
        "messages.upsert",
        this.messagesUpsert.bind(this)
    );

    // Si aún no está autenticado
    if (!this.sock.authState.creds.registered) {

        const phone = await this.askPhoneNumber();

        const code =
            await this.sock.requestPairingCode(phone);

        console.log("\n");
        console.log("====================================");
        console.log("   CÓDIGO DE EMPAREJAMIENTO");
        console.log("====================================");
        console.log(code);
        console.log("====================================");
        console.log("En WhatsApp:");
        console.log("Dispositivos vinculados");
        console.log("→ Vincular con número");
        console.log("→ Escribe este código");
        console.log("");

    }

}

    async connectionUpdate(update) {

        const {
            connection,
            qr,
            lastDisconnect
        } = update;

        if (qr) {
    // Ya no usamos QR.
}

        if (connection === "open") {

            const user = this.sock.user;

            ConsoleUI.setStatus("🟢 Online");

            if (user) {

                ConsoleUI.setUser(
                    user.name || "-",
                    user.id.split(":")[0]
                );

            }

            ConsoleUI.success("WhatsApp conectado.");
            ConsoleUI.render();

        }

        if (connection === "close") {

            const shouldReconnect =
                (lastDisconnect?.error instanceof Boom
                    ? lastDisconnect.error.output.statusCode
                    : 0) !== DisconnectReason.loggedOut;

            ConsoleUI.warning("Conexión cerrada.");
            ConsoleUI.render();

            if (shouldReconnect) {

                this.start();

            }

        }

    }

    async messagesUpsert({ messages }) {

        console.log("MENSAJE RECIBIDO");

    const msg = messages[0];

    if (!msg.message)
        return;

    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

    if (!text.startsWith("."))
        return;

    const args = text
        .slice(1)
        .trim()
        .split(/\s+/);

    const commandName = args
        .shift()
        .toLowerCase();

    const ctx = new Context({

    sock: this.sock,

    msg,

    command: commandName,

    args,

    bot: this.bot

});

ContactManager.save(

    ctx.sender,

    ctx.senderName

);


    console.log("Comando:", commandName);

const executed =
    await this.commandManager.execute(ctx);

console.log("Ejecutado:", executed);

    if (executed) {

        ConsoleUI.info(
            `Comando ejecutado: ${commandName}`
        );

        ConsoleUI.render();

    }

}

}

module.exports = WhatsAppService;