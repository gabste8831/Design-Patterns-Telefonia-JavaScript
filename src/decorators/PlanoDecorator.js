const PlanoStrategy = require('../strategies/PlanoStrategy');

// decorator base que repassa as chamadas pro plano original
class PlanoDecorator extends PlanoStrategy {
    constructor(plano) {
        super();
        this.planoDecorado = plano;
    }

    calcularCusto(minutos, gb) {
        return this.planoDecorado.calcularCusto(minutos, gb);
    }

    getLimiteDados() {
        return this.planoDecorado.getLimiteDados();
    }

    getDescricao() {
        return this.planoDecorado.getDescricao();
    }
}

module.exports = PlanoDecorator;