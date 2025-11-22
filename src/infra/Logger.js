class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }
        Logger.instance = this;
    }

    log(mensagem) {
        const data = new Date().toISOString();
        console.log(`[LOG ${data}]: ${mensagem}`);
    }
}

module.exports = new Logger(); // Já exporta a instância (Singleton)