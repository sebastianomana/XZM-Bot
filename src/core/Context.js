const fs = require("fs");
class Context {

   constructor({
    sock,
    msg,
    command,
    args,
    bot
}) {

        this.sock = sock;
        this.msg = msg;

        this.command = command;
        this.args = args;

        this.bot = bot;

        this.chat = msg.key.remoteJid;

        this.sender = msg.key.participant || msg.key.remoteJid;

        this.mentions =
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

this.mentioned =
    this.mentions.length > 0
        ? this.mentions[0]
        : null;

        this.isGroup = this.chat.endsWith("@g.us");

        this.pushName = msg.pushName || "Usuario";

        this.senderName = this.pushName;

this.mentionedName = null;

        this.text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            "";

    }

    async reply(text, mentions = []) {

    return await this.sock.sendMessage(

        this.chat,

        {

            text,

            mentions

        },

        {

            quoted: this.msg

        }

    );

}

mention(jid) {

    return `@${jid.split("@")[0]}`;

}

    async react(emoji) {

        return await this.sock.sendMessage(
            this.chat,
            {
                react: {
                    text: emoji,
                    key: this.msg.key
                }
            }
        );

    }

    async sendText(text) {

        return await this.sock.sendMessage(
            this.chat,
            {
                text
            }
        );

    }

    async sendImage(image, caption = "") {

        return await this.sock.sendMessage(
            this.chat,
            {
                image,
                caption
            }
        );

    }

    async sendAudio(audio, ptt = false) {

        return await this.sock.sendMessage(
            this.chat,
            {
                audio,
                mimetype: "audio/mpeg",
                ptt
            }
        );

    }

    async sendVideo(video, caption = "") {

        return await this.sock.sendMessage(
            this.chat,
            {
                video,
                caption
            }
        );

    }

    async sendSticker(sticker) {

        return await this.sock.sendMessage(
            this.chat,
            {
                sticker
            }
        );

    }

    async requireMention() {

    if (!this.mentioned) {

        await this.reply(
            "❌ Debes mencionar a un usuario.\n\nEjemplo:\n.hug @usuario"
        );

        return false;

    }

    return true;

}

async sendGif(file, caption = "", mentions = []) {

    return await this.sock.sendMessage(

        this.chat,

        {

            video: fs.readFileSync(file),

            gifPlayback: true,

            caption,

            mentions

        },

        {

            quoted: this.msg

        }

    );

}

async loadMentionName() {

    if (!this.mentioned)
        return null;

    const contact =
        this.sock.contacts?.[this.mentioned];

    if (contact) {

        return (
            contact.name ||
            contact.notify ||
            contact.verifiedName ||
            this.mentioned.split("@")[0]
        );

    }

    try {

        const result =
            await this.sock.onWhatsApp(
                this.mentioned
            );

        if (result?.length > 0) {

            return (
                result[0].notify ||
                this.mentioned.split("@")[0]
            );

        }

    }

    catch {}

    return this.mentioned.split("@")[0];

}

}



module.exports = Context;