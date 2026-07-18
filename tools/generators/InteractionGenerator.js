const fs = require("fs");
const path = require("path");

const templates = {

    hug: {
        emoji: "🤗",
        verb: "abrazó",
        description: "Abraza a otro usuario.",
        type: "interaction"
    },

    kiss: {
        emoji: "💋",
        verb: "besó",
        description: "Besa a otro usuario.",
        type: "interaction"
    },

    slap: {
        emoji: "👋",
        verb: "abofeteó",
        description: "Da una bofetada.",
        type: "interaction"
    },

    pat: {
        emoji: "🐾",
        verb: "acarició",
        description: "Acaricia a otro usuario.",
        type: "interaction"
    },

    bite: {
        emoji: "🦷",
        verb: "mordió",
        description: "Muerde a otro usuario.",
        type: "interaction"
    },

    cuddle: {
        emoji: "❤️",
        verb: "abrazó cariñosamente",
        description: "Abraza cariñosamente.",
        type: "interaction"
    },

    wave: {
        emoji: "👋",
        verb: "saludó a",
        description: "Saluda.",
        type: "interaction"
    },

    blush: {
        emoji: "😊",
        text: "se sonrojó.",
        description: "Se sonroja.",
        type: "reaction"
    },

    cry: {
        emoji: "😭",
        text: "está llorando.",
        description: "Llora.",
        type: "reaction"
    },

    smile: {
        emoji: "😊",
        text: "está sonriendo.",
        description: "Sonríe.",
        type: "reaction"
    },

    dance: {
        emoji: "💃",
        text: "está bailando.",
        description: "Baila.",
        type: "reaction"
    },

    poke: {
    emoji: "👉",
    verb: "pinchó",
    description: "Pincha a otro usuario.",
    type: "interaction"
},

punch: {
    emoji: "👊",
    verb: "golpeó",
    description: "Golpea a otro usuario.",
    type: "interaction"
},

kick: {
    emoji: "🦵",
    verb: "pateó",
    description: "Patea a otro usuario.",
    type: "interaction"
},

tickle: {
    emoji: "🤭",
    verb: "hizo cosquillas a",
    description: "Hace cosquillas a otro usuario.",
    type: "interaction"
},

highfive: {
    emoji: "🙌",
    verb: "chocó los cinco con",
    description: "Choca los cinco con otro usuario.",
    type: "interaction"
},

handhold: {
    emoji: "🤝",
    verb: "tomó de la mano a",
    description: "Toma de la mano a otro usuario.",
    type: "interaction"
},

feed: {
    emoji: "🍰",
    verb: "alimentó a",
    description: "Alimenta a otro usuario.",
    type: "interaction"
},

bonk: {
    emoji: "🔨",
    verb: "golpeó a",
    description: "Da un bonk a otro usuario.",
    type: "interaction"
},

lick: {
    emoji: "👅",
    verb: "lamió a",
    description: "Lame a otro usuario.",
    type: "interaction"
},

glomp: {
    emoji: "💞",
    verb: "se lanzó sobre",
    description: "Se lanza sobre otro usuario.",
    type: "interaction"
},

    

};

const commandsFolder = path.join(
    __dirname,
    "../../src/commands/fun"
);

if (!fs.existsSync(commandsFolder)) {

    fs.mkdirSync(commandsFolder, {
        recursive: true
    });

}

for (const [name, data] of Object.entries(templates)) {

    const className =
        name.charAt(0).toUpperCase() +
        name.slice(1);

    let content;

    if (data.type === "interaction") {

        content = `const InteractionCommand = require("../../core/base/InteractionCommand");

class ${className}Command extends InteractionCommand {

    constructor() {

        super({

            name: "${name}",

            aliases: [],

            description: "${data.description}",

            asset: "${name}",

            emoji: "${data.emoji}",

            verb: "${data.verb}"

        });

    }

}

module.exports = ${className}Command;
`;

    } else {

        content = `const ReactionCommand = require("../../core/base/ReactionCommand");

class ${className}Command extends ReactionCommand {

    constructor() {

        super({

            name: "${name}",

            aliases: [],

            description: "${data.description}",

            asset: "${name}",

            emoji: "${data.emoji}",

            text: "${data.text}"

        });

    }

}

module.exports = ${className}Command;
`;

    }

    const destination = path.join(
        commandsFolder,
        `${className}Command.js`
    );

    fs.writeFileSync(destination, content);

    console.log(`✅ ${className}Command creado.`);

}

console.log();
console.log("🎉 Todos los comandos fueron generados correctamente.");