const PlanoStrategy = require('./PlanoStrategy');

class PlanoPos extends PlanoStrategy {
    calcularCusto(minutos, gbGastos) {
        const custoBase = 100.00;
        const limite = this.getLimiteDados();
        let excedente = 0;

        // calculo do excedente se passar da franquia
        if (gbGastos > limite) {
            excedente = (gbGastos - limite) * 10.0; // cobra 10 reais por gb a mais
        }
        return custoBase + excedente;
    }

    getLimiteDados() {
        return 20.0; // limite de 20gb
    }

    getDescricao() {
        return "Plano Pós-Pago (20GB)";
    }
}

module.exports = PlanoPos;