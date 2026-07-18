const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const readline = require("readline");
const { Boom } = require("@hapi/boom");

const ContactManager = require("../managers/ContactManager");
const Context = require("../core/Context");
const ConsoleUI = require("../ui/ConsoleUI");

class WhatsAppService {

    constructor(options) {

        this.commandManager = options.commandManager;
        this.bot = options.bot;

        this.sock = null;

        this.started = false;
        this.reconnecting = false;
        this.pairingRequested = false;
        this.phoneNumber = null;

    }

    async askPhoneNumber() {

        return new Promise((resolve) => {

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(
                "\n📱 Número de WhatsApp (573001234567): ",
                (number) => {

                    rl.close();

                    resolve(
                        number.replace(/\D/g, "")
                    );

                }

            );

        });

    }

    async start() {

    if (this.started)
        return;

    this.started = true;

    // Pedir el número ANTES de crear el socket
    if (!this.phoneNumber) {

        this.phoneNumber =
            await this.askPhoneNumber();

    }

    const { state, saveCreds } =
        await useMultiFileAuthState("./storage/auth");

    const { version } =
        await fetchLatestBaileysVersion();

    ConsoleUI.info(
        `Baileys ${version.join(".")}`
    );

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

        printQRInTerminal: false,

        markOnlineOnConnect: true,

        syncFullHistory: false

    });

    this.sock.ev.on(
        "creds.update",
        saveCreds
    );

    this.sock.ev.on(
        "connection.update",
        (u) => this.connectionUpdate(u)
    );

    this.sock.ev.on(
        "messages.upsert",
        (m) => this.messagesUpsert(m)
    );

}

    async reconnect() {

        if (this.reconnecting)
            return;

        this.reconnecting = true;

        ConsoleUI.warning(
            "Reconectando..."
        );

        try {

            if (this.sock) {

                try {
                    this.sock.ev.removeAllListeners();
                } catch {}

                try {
                    this.sock.ws?.close();
                } catch {}

                this.sock = null;

            }

            this.started = false;

            await new Promise(resolve =>
                setTimeout(resolve, 5000)
            );

            await this.start();

        } finally {

            this.reconnecting = false;

        }

    }

    async connectionUpdate(update) {

        const {
            connection,
            lastDisconnect
        } = update;

        // Socket listo para solicitar Pairing Code
        if (
            connection === "connecting" &&
            this.sock &&
            !this.sock.authState.creds.registered &&
            !this.pairingRequested
        ) {

            this.pairingRequested = true;

            try {


                ConsoleUI.info(
                    "Solicitando Pairing Code..."
                );

                // Esperar un poco para que el socket quede completamente listo
                await new Promise(resolve =>
                    setTimeout(resolve, 2000)
                );

                const code =
                    await this.sock.requestPairingCode(phone);

                console.clear();

                console.log("");
                console.log("===========================================");
                console.log("        XZM BOT");
                console.log("===========================================");
                console.log("");
                console.log("Código de emparejamiento:");
                console.log("");
                console.log("        " + code);
                console.log("");
                console.log("===========================================");
                console.log("");
                console.log("WhatsApp");
                console.log("→ Ajustes");
                console.log("→ Dispositivos vinculados");
                console.log("→ Vincular un dispositivo");
                console.log("→ Vincular con número");
                console.log("");
                console.log("Introduce el código mostrado.");
                console.log("");

            } catch (err) {

                this.pairingRequested = false;

                ConsoleUI.error(
                    err.stack || err.message
                );

            }

            return;

        }

        if (connection === "open") {

            this.pairingRequested = false;

            const user = this.sock.user;

            ConsoleUI.setStatus("🟢 Online");

            if (user) {

                ConsoleUI.setUser(
                    user.name || "-",
                    user.id.split(":")[0]
                );

            }

            ConsoleUI.success(
                "WhatsApp conectado."
            );

            ConsoleUI.render();

            return;

        }

        if (connection === "close") {

            const statusCode =
                lastDisconnect?.error instanceof Boom
                    ? lastDisconnect.error.output.statusCode
                    : 0;

            if (
                statusCode === DisconnectReason.loggedOut
            ) {

                ConsoleUI.error(
                    "La sesión expiró."
                );

                ConsoleUI.error(
                    "Elimina storage/auth y vuelve a iniciar."
                );

                return;

            }

            ConsoleUI.warning(
                `Conexión cerrada (${statusCode})`
            );

            await this.reconnect();

        }

    }
    
    async messagesUpsert({ messages, type }) {

        if (type !== "notify")
            return;

        if (!messages?.length)
            return;

        const msg = messages[0];

        if (!msg)
            return;

        if (msg.key.fromMe)
            return;

        if (!msg.message)
            return;

        if (msg.key.remoteJid === "status@broadcast")
            return;

        let text = "";

        if (msg.message.conversation) {

            text = msg.message.conversation;

        } else if (msg.message.extendedTextMessage?.text) {

            text = msg.message.extendedTextMessage.text;

        } else if (msg.message.imageMessage?.caption) {

            text = msg.message.imageMessage.caption;

        } else if (msg.message.videoMessage?.caption) {

            text = msg.message.videoMessage.caption;

        } else {

            return;

        }

        text = text.trim();

        if (!text.startsWith("."))
            return;

        const parts = text
            .slice(1)
            .split(/\s+/);

        const command = (parts.shift() || "").toLowerCase();

        const ctx = new Context({

            sock: this.sock,

            msg,

            command,

            args: parts,

            bot: this.bot

        });

        try {

            ContactManager.save(
                ctx.sender,
                ctx.senderName
            );

        } catch {}

        try {

            const executed =
                await this.commandManager.execute(ctx);

            if (executed) {

                ConsoleUI.info(
                    `Comando: ${command}`
                );

            } else {

                ConsoleUI.warning(
                    `Comando inexistente: ${command}`
                );

            }

        } catch (err) {

            ConsoleUI.error(
                err.stack || err.message
            );

        }

        ConsoleUI.render();

    }

}

module.exports = WhatsAppService;    
