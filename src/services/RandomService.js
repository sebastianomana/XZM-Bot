const crypto = require("crypto");

class RandomService {

    hash(text) {

        return crypto
            .createHash("sha256")
            .update(String(text))
            .digest("hex");

    }

    percentage(seed, min = 0, max = 100) {

        const hash = this.hash(seed);

        const number =
            parseInt(hash.substring(0, 8), 16);

        return min + (number % (max - min + 1));

    }

    choice(seed, items) {

        const hash = this.hash(seed);

        const number =
            parseInt(hash.substring(0, 8), 16);

        return items[number % items.length];

    }

    boolean(seed) {

        return this.percentage(seed) >= 50;

    }

}

module.exports = new RandomService();