// ============================================================
// CRIATIVOS (VÍDEOS) — BM GT CONSÓRCIOS EXCALA
// ============================================================

export const VIDEOS_EXCALA = [
  // ── Vídeos reaproveitados da BM Rodobens ─────────────────────
  {
    id: 'V1',
    nome: '3 Formas de Comprá-lo',
    objecao: 'À vista vs financiado vs consórcio',
    temperatura: 'morno',
    campanhas: ['EXC_WA_02'],
  },
  {
    id: 'V2',
    nome: 'Aluguel Disfarçado',
    objecao: 'Financiamento = aluguel, sem entrada',
    temperatura: 'morno',
    campanhas: ['EXC_WA_02'],
  },
  {
    id: 'V3',
    nome: 'Erro Financeiro',
    objecao: 'Juros abusivos, lances programados',
    temperatura: 'morno',
    campanhas: ['EXC_WA_02'],
  },
  {
    id: 'V4',
    nome: 'Plano Sem Lance',
    objecao: '"Consórcio demora" — plano 120 pessoas',
    temperatura: 'quente',
    campanhas: ['EXC_WA_01'],
  },
  {
    id: 'V5',
    nome: 'Tela Dividida BYD',
    objecao: 'Carro elétrico, maior contemplação',
    temperatura: 'frio',
    campanhas: ['EXC_WA_03', 'EXC_DAVI_01'],
  },
  {
    id: 'V6',
    nome: 'Tela Dividida Corolla',
    objecao: 'Toyota, SELIC 15%, parcela sem juros',
    temperatura: 'frio',
    campanhas: ['EXC_WA_03'],
  },
  {
    id: 'V7',
    nome: 'Tela Dividida Picape',
    objecao: 'Hilux/S10/Ranger, conta dos juros dobrados',
    temperatura: 'frio',
    campanhas: ['EXC_WA_03', 'EXC_DAVI_01'],
  },
  {
    id: 'V8',
    nome: 'Traduzindo Consórcio',
    objecao: 'Visão de longo prazo, consórcio = economia',
    temperatura: 'quente',
    campanhas: ['EXC_WA_01'],
  },
  {
    id: 'V9',
    nome: 'Vídeo H9/Haval',
    objecao: 'Carro premium, lance + consultoria gratuita',
    temperatura: 'frio',
    campanhas: ['EXC_WA_03'],
  },

  // ── Novos vídeos gravados pelo Marcelo Monteiro ───────────────
  {
    id: 'EV1',
    nome: '60% das Operações',
    objecao: 'Usar consórcio para quitar financiamentos',
    temperatura: 'quente',
    campanhas: ['EXC_WA_01', 'EXC_RMK_WA'],
  },
  {
    id: 'EV2',
    nome: 'Comprando Imóveis sem Pagar Juros',
    objecao: 'Imóveis sem juros, sem entrada, renda passiva',
    temperatura: 'frio',
    campanhas: ['EXC_WA_03', 'EXC_FORM_01', 'EXC_DAVI_01', 'EXC_RMK_FORM'],
  },
  {
    id: 'EV3',
    nome: 'Construtor',
    objecao: 'Financiar obras e empreendimentos sem descapitalizar',
    temperatura: 'frio',
    campanhas: ['EXC_WA_03', 'EXC_FORM_01', 'EXC_DAVI_01'],
  },
  {
    id: 'EV4',
    nome: 'Produtor Rural — Eu Sei o que tá Passando',
    objecao: 'Comprar caminhões com lance, descapitalização mínima',
    temperatura: 'frio',
    campanhas: ['EXC_WA_03', 'EXC_DAVI_01'],
  },
  {
    id: 'EV5',
    nome: 'Quer Fazer seu Dinheiro Multiplicar',
    objecao: 'Operações estruturadas, investimento estratégico',
    temperatura: 'morno',
    campanhas: ['EXC_WA_02', 'EXC_FORM_01', 'EXC_RMK_FORM'],
  },
  {
    id: 'EV6',
    nome: 'Tem 100 mil no Banco',
    objecao: 'Rentabilizar dinheiro parado com consórcio',
    temperatura: 'quente',
    campanhas: ['EXC_WA_01', 'EXC_FORM_01', 'EXC_RMK_WA'],
  },
  {
    id: 'EV7',
    nome: 'Usando Consórcio para Financiar seu Negócio',
    objecao: 'Consórcio para alavancar patrimônio e empresas',
    temperatura: 'morno',
    campanhas: ['EXC_WA_02', 'EXC_FORM_01'],
  },
  {
    id: 'EV8',
    nome: 'Você Produtor Rural',
    objecao: 'Comprar 10 caminhões investindo apenas uma fração',
    temperatura: 'frio',
    campanhas: ['EXC_WA_03', 'EXC_DAVI_01'],
  },

  // ── Remarketing (aguardando gravação) ─────────────────────────
  {
    id: 'EV_RMK_WA',
    nome: 'Remarketing WhatsApp',
    objecao: 'CTA direto para WhatsApp — urgência e escassez',
    temperatura: 'remarketing',
    campanhas: ['EXC_RMK_WA'],
    emBreve: true,
  },
  {
    id: 'EV_RMK_FORM',
    nome: 'Remarketing Formulário',
    objecao: 'CTA direto para formulário — urgência e escassez',
    temperatura: 'remarketing',
    campanhas: ['EXC_RMK_FORM'],
    emBreve: true,
  },
];

export const VIDEOS_EXCALA_MAP = Object.fromEntries(VIDEOS_EXCALA.map(v => [v.id, v]));
