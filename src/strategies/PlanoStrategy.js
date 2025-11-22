// classe pai que simula a interface
class PlanoStrategy {
    calcularCusto(minutos, gbGastos) {
        throw new Error("metodo calcularCusto precisa ser implementado");
    }

    getLimiteDados() {
        throw new Error("metodo getLimiteDados precisa ser implementado");
    }

    getDescricao() {
        throw new Error("metodo getDescricao precisa ser implementado");
    }
}

module.exports = PlanoStrategy;