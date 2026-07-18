class Logger {

    title(text) {

        console.log();
        console.log("======================================");
        console.log(" " + text);
        console.log("======================================");
        console.log();

    }

    category(name) {

        process.stdout.write(
            `📂 ${name.padEnd(12)}`
        );

    }

    progress(current, total) {

        process.stdout.write(
            `[${current}/${total}]\n`
        );

    }

    success(text) {

        console.log("✅", text);

    }

    stats(item) {

    const ok =
        item.missing === 0
            ? "✅"
            : "⚠️";

    console.log(

        `${ok} ${item.name.padEnd(10)} ${String(item.installed).padStart(2)}/${item.expected}`

    );

}

summary(total, missing) {

    console.log();

    console.log(
        "──────────────────────────────────────"
    );

    console.log(
        `📦 Assets instalados : ${total}`
    );

    console.log(
        `⬇️  Faltantes        : ${missing}`
    );

    console.log(
        "──────────────────────────────────────"
    );

}

    error(text) {

        console.log("❌", text);

    }

}

module.exports = new Logger();