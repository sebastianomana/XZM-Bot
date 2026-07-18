const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

class QRService {

    constructor() {

        this.tempFolder = path.join(process.cwd(), "temp");
        this.qrPath = path.join(this.tempFolder, "qr.png");

        if (!fs.existsSync(this.tempFolder)) {
            fs.mkdirSync(this.tempFolder, { recursive: true });
        }

    }

    async generate(qr) {

        await QRCode.toFile(this.qrPath, qr, {
            width: 300,
            margin: 2
        });

        console.clear();

        console.log("╔══════════════════════════════════════════════════════╗");
        console.log("║                WhatsAppBot Framework                ║");
        console.log("╠══════════════════════════════════════════════════════╣");
        console.log("║ Estado : Esperando autenticación                    ║");
        console.log("║                                                      ║");
        console.log("║ QR generado correctamente.                          ║");
        console.log("║                                                      ║");
        console.log("║ temp/qr.png                                         ║");
        console.log("╚══════════════════════════════════════════════════════╝");

    }

    remove() {

        if (fs.existsSync(this.qrPath)) {

            fs.unlinkSync(this.qrPath);

        }

    }

}

module.exports = QRService;