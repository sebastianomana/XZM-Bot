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

        this.isConnecting = false;
        this.isReconnecting = false;
        this.pairingRequested = false;
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

        if (this.isConnecting)
            return;

        this.isConnecting = true;

        try {

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

                syncFullHistory: false,

                markOnlineOnConnect: true,

                generateHighQualityLinkPreview: false

            });

            this.sock.ev.on(
                "creds.update",
                saveCreds
            );

            this.sock.ev.on(
                "connection.update",
                (update) => this.connectionUpdate(update)
            );

            this.sock.ev.on(
                "messages.upsert",
                (msg) => this.messagesUpsert(msg)
            );

        } catch (err) {

            ConsoleUI.error(err.message);

        } finally {

            this.isConnecting = false;

        }

    }


    async connectionUpdate(update) {

        const {
            connection,
            qr,
            lastDisconnect
        } = update;

        // No usamos QR
        if (qr) {
            ConsoleUI.info("Esperando Pairing Code...");
        }

        // Solicitar Pairing Code SOLO cuando el socket ya inició
        if (
            connection === "connecting" &&
            this.sock &&
            !this.sock.authState.creds.registered &&
            !this.pairingRequested
        ) {

            this.pairingRequested = true;

            try {

                const phone = await this.askPhoneNumber();

                ConsoleUI.info("Generando código de emparejamiento...");

                const code =
                    await this.sock.requestPairingCode(phone);

                console.log("");
                console.log("=========================================");
                console.log("        CÓDIGO DE EMPAREJAMIENTO");
                console.log("=========================================");
                console.log("");
                console.log("        " + code);
                console.log("");
                console.log("=========================================");
                console.log("");
                console.log("En WhatsApp:");
                console.log("Ajustes");
                console.log("→ Dispositivos vinculados");
                console.log("→ Vincular un dispositivo");
                console.log("→ Vincular con número");
                console.log("");
                console.log("Escribe el código anterior.");
                console.log("");

            } catch (err) {

                this.pairingRequested = false;

                ConsoleUI.error(
                    "No fue posible generar el Pairing Code."
                );

                ConsoleUI.error(err.message);

            }

            return;
        }

        // Conectado
        if (connection === "open") {

            this.isReconnecting = false;
            this.pairingRequested = false;

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

            return;

        }

        // Desconectado
        if (connection === "close") {

            const statusCode =
                lastDisconnect?.error instanceof Boom
                    ? lastDisconnect.error.output.statusCode
                    : 0;

            const shouldReconnect =
                statusCode !== DisconnectReason.loggedOut;

            ConsoleUI.warning(
                `Conexión cerrada (${statusCode})`
            );

            ConsoleUI.render();

            if (!shouldReconnect) {

                ConsoleUI.error(
                    "La sesión fue cerrada. Elimina la carpeta storage/auth y vuelve a iniciar."
                );

                return;

            }

            if (this.isReconnecting)
                return;

            this.isReconnecting = true;

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

                ConsoleUI.info(
                    "Reconectando en 5 segundos..."
                );

                await new Promise(resolve =>
                    setTimeout(resolve, 5000)
                );

                await this.start();

            } catch (err) {

                ConsoleUI.error(err.message);

            }

        }

    }
    
    async messagesUpsert({ messages, type }) {

        if (type !== "notify")
            return;

        if (!messages || !messages.length)
            return;

        const msg = messages[0];

        if (!msg)
            return;

        // Ignorar mensajes enviados por el propio bot
        if (msg.key.fromMe)
            return;

        if (!msg.message)
            return;

        // Ignorar estados
        if (msg.key.remoteJid === "status@broadcast")
            return;

        let text = "";

        if (msg.message.conversation) {
            text = msg.message.conversation;
        }
        else if (msg.message.extendedTextMessage) {
            text = msg.message.extendedTextMessage.text;
        }
        else if (msg.message.imageMessage?.caption) {
            text = msg.message.imageMessage.caption;
        }
        else if (msg.message.videoMessage?.caption) {
            text = msg.message.videoMessage.caption;
        }
        else {
            return;
        }

        if (!text.startsWith("."))
            return;

        const args = text
            .slice(1)
            .trim()
            .split(/\s+/);

        if (!args.length)
            return;

        const commandName = args.shift().toLowerCase();

        const ctx = new Context({

            sock: this.sock,

            msg,

            command: commandName,

            args,

            bot: this.bot

        });

        try {

            ContactManager.save(
                ctx.sender,
                ctx.senderName
            );

        } catch (err) {

            ConsoleUI.warning(
                "No fue posible guardar el contacto."
            );

        }

        ConsoleUI.info(
            `Comando recibido: ${commandName}`
        );

        try {

            const executed =
                await this.commandManager.execute(ctx);

            if (executed) {

                ConsoleUI.success(
                    `Comando ejecutado: ${commandName}`
                );

            } else {

                ConsoleUI.warning(
                    `Comando inexistente: ${commandName}`
                );

            }

        } catch (err) {

            ConsoleUI.error(err.stack || err.message);

        }

        ConsoleUI.render();

    }

}

module.exports = WhatsAppService;    

    
