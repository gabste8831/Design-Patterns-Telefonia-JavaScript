class Assinatura {
    constructor(numero, planoInicial) {
        this.numero = numero;
        this.plano = planoInicial; 
        this.dadosConsumidos = 0;
        this.observers = []; 
        
        // campo novo pra guardar valor de multa se cancelar pacote
        this.custosExtras = 0;

        // travas pra não mandar o mesmo sms varias vezes
        this.avisou80 = false;
        this.avisou100 = false;
    }

    // --- metodos do observer ---
    adicionarObservador(obs) {
        this.observers.push(obs);
    }

    notificarObservadores(msg) {
        // avisa todo mundo da lista (ex: sms)
        this.observers.forEach(obs => obs.update(this.numero, msg));
    }

    // --- metodos do decorator ---
    adicionarPacote(novoPlanoDecorado) {
        this.plano = novoPlanoDecorado;
    }

    // metodo novo pra aplicar multa no valor total
    aplicarMulta(valor) {
        this.custosExtras += valor;
    }

    // --- logica de consumo ---
    registrarConsumoDados(gb) {
        this.dadosConsumidos += gb;
        this.verificarAlertas();
    }

    verificarAlertas() {
        const limite = this.plano.getLimiteDados();
        const porcentagem = this.dadosConsumidos / limite;

        if (porcentagem >= 1.0 && !this.avisou100) {
            this.notificarObservadores("URGENTE: Voce atingiu 100% da franquia.");
            this.avisou100 = true;
        } else if (porcentagem >= 0.8 && !this.avisou80) {
            this.notificarObservadores("AVISO: Voce consumiu 80% da internet.");
            this.avisou80 = true;
        }
    }

    fecharFatura() {
        // calcula o custo baseado no plano atual e consumo
        const custoPlano = this.plano.calcularCusto(0, this.dadosConsumidos);
        
        // soma o custo do plano com as multas (se tiver)
        const totalGeral = custoPlano + this.custosExtras;

        console.log(`\n--- FATURA FECHADA ---`);
        console.log(`Cliente: ${this.numero}`);
        console.log(`Plano Final: ${this.plano.getDescricao()}`);
        console.log(`Consumo: ${this.dadosConsumidos.toFixed(2)}GB / ${this.plano.getLimiteDados()}GB`);
        console.log(`-------------------------`);
        console.log(`Custo Consumo: R$ ${custoPlano.toFixed(2)}`);
        
        // so mostra essa linha se tiver multa
        if (this.custosExtras > 0) {
            console.log(`Multas/Taxas:  R$ ${this.custosExtras.toFixed(2)}`);
        }
        
        console.log(`TOTAL A PAGAR: R$ ${totalGeral.toFixed(2)}`);
    }
}

module.exports = Assinatura;