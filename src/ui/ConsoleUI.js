class ConsoleUI {

    constructor() {

        this.state = {
            status: "Iniciando...",
            user: "-",
            number: "-",
            commands: 0,
            plugins: 0,
            logs: []
        };

    }

    setStatus(status) {
        this.state.status = status;
    }

    setUser(user, number) {
        this.state.user = user;
        this.state.number = number;
    }

    setCommands(total) {
        this.state.commands = total;
    }

    setPlugins(total) {
        this.state.plugins = total;
    }

    info(message) {
        this.addLog("INFO", message);
    }

    success(message) {
        this.addLog("SUCCESS", message);
    }

    warning(message) {
        this.addLog("WARNING", message);
    }

    error(message) {
        this.addLog("ERROR", message);
    }

    addLog(type, message) {

        const time = new Date().toLocaleTimeString();

        this.state.logs.push({
            type,
            time,
            message
        });

        if (this.state.logs.length > 12)
            this.state.logs.shift();

    }

    drawLine() {

        console.log(
            "╠══════════════════════════════════════════════════════════════╣"
        );

    }

    row(title, value) {

        const text = `${title.padEnd(10)} : ${value}`;

        console.log(
            `║ ${text.padEnd(60)}║`
        );

    }

    render() {

        console.clear();

        console.log("╔══════════════════════════════════════════════════════════════╗");
        console.log("║                   WhatsAppBot Framework                     ║");

        this.drawLine();

        this.row("Estado", this.state.status);
        this.row("Usuario", this.state.user);
        this.row("Número", this.state.number);
        this.row("Comandos", this.state.commands);
        this.row("Plugins", this.state.plugins);

        console.log("╚══════════════════════════════════════════════════════════════╝");

        console.log();

        console.log("──────────────────────────────────────────────────────────────");

        if (this.state.logs.length === 0) {

            console.log("Sin eventos.");

            return;

        }

        for (const log of this.state.logs) {

    const time = String(log.time ?? "--:--:--");
    const type = String(log.type ?? "INFO");
    const message = String(log.message ?? log);

    console.log(
        `[${time}] ${type.padEnd(7)} ${message}`
    );

}

    }

}

module.exports = new ConsoleUI();