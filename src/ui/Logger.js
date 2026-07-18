class Logger {

    static info(message) {
        return {
            type: "INFO",
            message,
            time: new Date()
        };
    }

    static success(message) {
        return {
            type: "SUCCESS",
            message,
            time: new Date()
        };
    }

    static warning(message) {
        return {
            type: "WARNING",
            message,
            time: new Date()
        };
    }

    static error(message) {
        return {
            type: "ERROR",
            message,
            time: new Date()
        };
    }

}

module.exports = Logger;