const Bot = require("./core/Bot");

async function main() {

    const bot = new Bot();

    await bot.start();

}

main();