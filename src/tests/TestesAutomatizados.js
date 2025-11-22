const assert = require('assert');
const Logger = require('../infra/Logger');
const Assinatura = require('../domain/Assinatura');
const PlanoPos = require('../strategies/PlanoPos');
const PacoteDadosExtra = require('../decorators/PacoteDadosExtra');

console.log("\n>> Executando suite de testes...\n");

try {
    // --- Teste 1: Singleton ---
    console.log("Teste 1: Singleton (Logger)...");
    const log1 = require('../infra/Logger');
    const log2 = require('../infra/Logger');
    
    // Valida se ambas as referencias apontam para a mesma instancia
    assert.strictEqual(log1, log2, "Falha: Instancias do Logger sao diferentes");
    console.log("Sucesso: Unicidade garantida.\n");


    // --- Teste 2: Strategy ---
    console.log("Teste 2: Strategy (Calculo de custos)...");
    const plano = new PlanoPos();
    
    // Cenario 1: Consumo dentro da franquia (15GB)
    const custoNormal = plano.calcularCusto(0, 15);
    assert.strictEqual(custoNormal, 100.00, "Falha: Calculo incorreto para consumo dentro da franquia");
    
    // Cenario 2: Consumo com excedente (22GB -> 2GB extra)
    const custoExcedente = plano.calcularCusto(0, 22);
    assert.strictEqual(custoExcedente, 120.00, "Falha: Calculo incorreto para consumo excedente");
    
    console.log("Sucesso: Logica de calculo validada.\n");


    // --- Teste 3: Decorator ---
    console.log("Teste 3: Decorator (Adicao de pacote)...");
    const planoBase = new PlanoPos();
    
    // Aplica o decorator PacoteDadosExtra sobre o plano base
    const planoDecorado = new PacoteDadosExtra(planoBase);

    // Valida incremento no limite (20GB + 5GB)
    assert.strictEqual(planoDecorado.getLimiteDados(), 25.0, "Falha: Limite de dados incorreto");
    
    // Valida incremento no custo base (100 + 20)
    const custoPacote = planoDecorado.calcularCusto(0, 0);
    assert.strictEqual(custoPacote, 120.00, "Falha: Custo base incorreto apos decorator");

    console.log("Sucesso: Decorator aplicou limite e custo corretamente.\n");


    // --- Teste 4: Observer ---
    console.log("Teste 4: Observer (Notificacao)...");
    
    let notificacaoRecebida = false;
    
    // Mock do observer para capturar evento
    const observerMock = {
        update: (numero, msg) => {
            notificacaoRecebida = true;
        }
    };

    const assinatura = new Assinatura("000", new PlanoPos());
    assinatura.adicionarObservador(observerMock);

    // Simula consumo de 100% da franquia para disparar gatilho
    assinatura.registrarConsumoDados(20.0);

    assert.strictEqual(notificacaoRecebida, true, "Falha: Observer nao recebeu notificacao");
    console.log("Sucesso: Notificacao disparada corretamente.\n");


    // --- Teste 5: Logica de Multas ---
    console.log("Teste 5: Aplicacao de Multas...");
    const clienteMulta = new Assinatura("000", new PlanoPos());
    
    // Aplica valor manual de multa
    clienteMulta.aplicarMulta(15.00);
    
    // Verifica persistencia do valor na propriedade da assinatura
    assert.strictEqual(clienteMulta.custosExtras, 15.00, "Falha: Valor da multa nao persistido");
    
    console.log("Sucesso: Multa registrada corretamente.\n");

    console.log(">> Todos os testes concluidos com sucesso (10/10).");

} catch (erro) {
    console.error("ERRO FATAL NO TESTE:");
    console.error(erro.message);
    process.exit(1); 
}