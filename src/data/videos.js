// ============================================================
// CRIATIVOS (VÍDEOS) — CADASTRADOS FIXAMENTE
// ============================================================

export const VIDEOS = [
  {
    id: 'V1',
    nome: '3 Formas de Comprá-lo',
    objecao: 'À vista vs financiado vs consórcio',
    temperatura: 'morno',
    campanhas: ['RAB_WA_03', 'RAB_WA_04', 'RAB_FORM_02'],
  },
  {
    id: 'V2',
    nome: 'Aluguel Disfarçado',
    objecao: 'Financiamento = aluguel, sem entrada',
    temperatura: 'morno',
    campanhas: ['RAB_WA_03', 'RAB_WA_04', 'RAB_FORM_02', 'RAB_DAVI_02'],
  },
  {
    id: 'V3',
    nome: 'Erro Financeiro',
    objecao: 'Juros abusivos, lances programados',
    temperatura: 'morno',
    campanhas: ['RAB_WA_03', 'RAB_WA_04', 'RAB_FORM_02', 'RAB_DAVI_02'],
  },
  {
    id: 'V4',
    nome: 'Plano Sem Lance',
    objecao: '"Consórcio demora" — plano 120 pessoas',
    temperatura: 'quente',
    campanhas: ['RAB_WA_01', 'RAB_WA_02', 'RAB_FORM_01'],
  },
  {
    id: 'V5',
    nome: 'Tela Dividida BYD',
    objecao: 'Carro elétrico, maior contemplação',
    temperatura: 'frio',
    campanhas: ['RAB_WA_05', 'RAB_WA_06', 'RAB_DAVI_01'],
  },
  {
    id: 'V6',
    nome: 'Tela Dividida Corolla',
    objecao: 'Toyota, SELIC 15%, parcela sem juros',
    temperatura: 'frio',
    campanhas: ['RAB_WA_05', 'RAB_FORM_03'],
  },
  {
    id: 'V7',
    nome: 'Tela Dividida Picape',
    objecao: 'Hilux/S10/Ranger, conta dos juros dobrados',
    temperatura: 'frio',
    campanhas: ['RAB_WA_05', 'RAB_WA_06', 'RAB_FORM_03'],
  },
  {
    id: 'V8',
    nome: 'Traduzindo Consórcio',
    objecao: 'Visão de longo prazo, consórcio = economia',
    temperatura: 'quente',
    campanhas: ['RAB_WA_01', 'RAB_WA_02', 'RAB_FORM_01'],
  },
  {
    id: 'V9',
    nome: 'Vídeo H9/Haval',
    objecao: 'Carro premium, lance + consultoria gratuita',
    temperatura: 'frio',
    campanhas: ['RAB_WA_05', 'RAB_WA_06', 'RAB_DAVI_01'],
  },
];

export const VIDEOS_MAP = Object.fromEntries(VIDEOS.map(v => [v.id, v]));
