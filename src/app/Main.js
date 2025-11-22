const readline = require('readline');
const Logger = require('../infra/Logger');
const Assinatura = require('../domain/Assinatura');
const PlanoPos = require('../strategies/PlanoPos');
const PacoteDadosExtra = require('../decorators/PacoteDadosExtra');
const SMSAlert = require('../observers/SMSAlert');
const PlanoDecorator = require('../decorators/PlanoDecorator'); 

// configuracao do readline para i/o no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// helper para capturar input do usuario via promise
const perguntar = (pergunta) => {
    return new Promise(resolve => rl.question(pergunta, resolve));
};

(async function main() {
    console.clear();
    Logger.log("Sistema Iniciado...");

    console.log("\n=================================");
    console.log("   SISTEMA DE TELEFONIA v2.0     ");
    console.log("=================================\n");

    // input inicial do numero
    const numero = await perguntar("Digite o numero do celular (ex: 47 99999-0000): ");
    
    // inicializacao do context (assinatura) com strategy padrao (plano pos)
    const cliente = new Assinatura(numero, new PlanoPos());
    
    // registro do observer
    cliente.adicionarObservador(new SMSAlert());

    console.log(`\n>> Linha ativa para: ${numero}`);

    while (true) {
        console.log("\n--- MENU ---");
        console.log("1. Consultar Status e Fatura Parcial");
        console.log("2. Simular Consumo de Dados");
        console.log("3. Contratar Pacote Extra (+5GB / R$20)");
        console.log("4. Cancelar Pacote Extra (Remover + Multa)");
        console.log("5. Fechar Fatura e Sair");

        const opcao = await perguntar("\nDigite a opcao desejada: ");

        if (opcao === '1') {
            // calculo de previsao de custos em runtime
            const plano = cliente.plano;
            const custoAtual = plano.calcularCusto(0, cliente.dadosConsumidos);
            const totalComMultas = custoAtual + cliente.custosExtras;
            
            console.log(`\n>> Plano Atual: ${plano.getDescricao()}`);
            console.log(`>> Consumo: ${cliente.dadosConsumidos.toFixed(2)}GB / ${plano.getLimiteDados()}GB`);
            console.log(`>> Valor Parcial: R$ ${totalComMultas.toFixed(2)}`);
        
        } else if (opcao === '2') {
            const entrada = await perguntar("Quantos GB deseja consumir? ");
            const gb = parseFloat(entrada);

            if (isNaN(gb) || gb <= 0) {
                console.log("\n[!] Valor invalido.");
            } else {
                console.log(`\n>> Consumindo ${gb}GB...`);
                // aciona logica de consumo e notificacao dos observers
                cliente.registrarConsumoDados(gb);
            }

        } else if (opcao === '3') {
            console.log("\n>> Contratando pacote adicional...");
            const planoAtual = cliente.plano;
            
            // aplica pattern decorator sobre o plano atual
            const planoComPacote = new PacoteDadosExtra(planoAtual);
            cliente.adicionarPacote(planoComPacote);
            
            console.log(">> Sucesso! Limite aumentado em +5GB.");

        } else if (opcao === '4') {
            console.log("\n>> Processando cancelamento de pacote...");
            
            // verifica se o objeto atual eh uma instancia de decorator
            if (cliente.plano instanceof PlanoDecorator) {
                const valorMulta = 15.00;

                // remove a camada do decorator retornando ao objeto original
                cliente.plano = cliente.plano.planoDecorado;
                
                // registra penalidade na assinatura
                cliente.aplicarMulta(valorMulta);

                console.log(">> Pacote removido com sucesso.");
                console.log(`>> ATENCAO: Multa de R$ ${valorMulta.toFixed(2)} aplicada.`);
            } else {
                console.log(">> [!] Nenhum pacote ativo para cancelamento.");
            }

        } else if (opcao === '5') {
            // finaliza processo e exibe relatorio
            cliente.fecharFatura();
            break;

        } else {
            console.log("\n[!] Opcao invalida.");
        }
    }

    console.log("\n-----------------------------------");
    console.log("Desenvolvido por: Gabriel Steffens");
    console.log("-----------------------------------");
    
    rl.close();
})();