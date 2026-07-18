class ContactService {

    constructor() {

        this.groupCache = new Map();

    }

    async getMetadata(sock, chat) {

        if (this.groupCache.has(chat)) {

            return this.groupCache.get(chat);

        }

        const metadata =
            await sock.groupMetadata(chat);

        this.groupCache.set(
            chat,
            metadata
        );

        return metadata;

    }

    clear(chat) {

        this.groupCache.delete(chat);

    }

    async getName(sock, chat, jid, store) {

    console.log("========== CONTACTS ==========");
    console.dir(store.contacts, {
        depth: null,
        colors: true
    });
    console.log("==============================");

    const contact = store.contacts[jid];

    if (contact) {

        return (
            contact.name ||
            contact.notify ||
            contact.verifiedName ||
            jid.split("@")[0]
        );

    }

    return jid.split("@")[0];

}

}

module.exports = new ContactService();