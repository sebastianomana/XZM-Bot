const fs = require("fs");
const path = require("path");

class ContactManager {

    constructor() {

        this.file = path.join(
            process.cwd(),
            "storage",
            "contacts.json"
        );

        this.contacts = {};

        this.load();

    }

    load() {

        if (!fs.existsSync(this.file)) {

            fs.writeFileSync(
                this.file,
                "{}"
            );

        }

        this.contacts = JSON.parse(
            fs.readFileSync(
                this.file,
                "utf8"
            )
        );

    }

    saveFile() {

        fs.writeFileSync(

            this.file,

            JSON.stringify(
                this.contacts,
                null,
                4
            )

        );

    }

    save(jid, name) {

        if (!jid || !name)
            return;

        this.contacts[jid] = {

            jid,

            name,

            updatedAt: Date.now()

        };

        this.saveFile();

    }

    get(jid) {

        return this.contacts[jid] || null;

    }

    getName(jid) {

        const user = this.get(jid);

        if (user)
            return user.name;

        return jid.split("@")[0];

    }

    has(jid) {

        return !!this.contacts[jid];

    }

    all() {

        return Object.values(
            this.contacts
        );

    }

    count() {

        return this.all().length;

    }

}

module.exports = new ContactManager();