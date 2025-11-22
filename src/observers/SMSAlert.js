const Logger = require('../infra/Logger');

class SMSAlert {
    // metodo chamado quando a assinatura notifica
    update(numero, mensagem) {
        Logger.log(`SMS enviado para ${numero}: "${mensagem}"`);
    }
}

module.exports = SMSAlert;