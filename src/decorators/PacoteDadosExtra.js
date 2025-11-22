const PlanoDecorator = require('./PlanoDecorator');

class PacoteDadosExtra extends PlanoDecorator {
    constructor(plano) {
        super(plano);
    }

    calcularCusto(minutos, gb) {
        // pega o custo do plano original e soma 20 reais do pacote
        return super.calcularCusto(minutos, gb) + 20.00;
    }

    getLimiteDados() {
        // soma 5gb na franquia atual
        return super.getLimiteDados() + 5.0;
    }

    getDescricao() {
        return super.getDescricao() + " + 5GB Extra";
    }
}

module.exports = PacoteDadosExtra;