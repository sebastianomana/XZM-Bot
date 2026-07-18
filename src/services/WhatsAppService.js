const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");

const ContactManager = require("../managers/ContactManager");

const pino = require("pino");
const { Boom } = require("@hapi/boom");

const Context = require("../core/Context");
const ConsoleUI = require("../ui/ConsoleUI");
const QRService = require("./QRService");

class WhatsAppService {

    constructor(options) {

    this.commandManager = options.commandManager;

    this.bot = options.bot;

    this.sock = null;

    this.qr = new QRService();

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
                "WhatsAppBot",
                "Chrome",
                "1.0.0"
            ]

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

    }

    async connectionUpdate(update) {

        const {
            connection,
            qr,
            lastDisconnect
        } = update;

        if (qr) {

            await this.qr.generate(qr);

            ConsoleUI.setStatus("Esperando autenticación");
            ConsoleUI.info("QR generado.");
            ConsoleUI.render();

        }

        if (connection === "open") {

            this.qr.remove();

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