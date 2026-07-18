class CooldownManager {

    constructor() {

        this.cooldowns = new Map();

    }

    check(user, command, seconds) {

        if (seconds <= 0)
            return 0;

        const key = `${user}:${command}`;

        const now = Date.now();

        const expires = this.cooldowns.get(key);

        if (expires && expires > now) {

            return Math.ceil(
                (expires - now) / 1000
            );

        }

        this.cooldowns.set(
            key,
            now + (seconds * 1000)
        );

        return 0;

    }

}

module.exports = CooldownManager;