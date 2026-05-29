// ============================================================
// DADOS FIXOS DAS CAMPANHAS — GT CONSÓRCIOS / BM GT EXCALA
// Verba bruta: R$ 2.500/sem | Imposto 12% | Líquido: R$ 2.200/sem
// Distribuição: 65% WA Bitrix | 20% Form GT | 10% Davi | 5% Eliana
// ============================================================

export const FLUXOS_EXCALA = {
  bittrex: { id: 'bittrex', nome: 'WhatsApp Bitrix',      percentual: 65, verbaSemanal: 1430.00 },
  grupoGT: { id: 'grupoGT', nome: 'Formulário Grupo GT',  percentual: 20, verbaSemanal:  440.00 },
  davi:    { id: 'davi',    nome: 'Formulário Davi',       percentual: 10, verbaSemanal:  220.00 },
  eliana:  { id: 'eliana',  nome: 'Formulário Eliana',     percentual:  5, verbaSemanal:  110.00 },
};

export const CAMPANHAS_EXCALA = [
  // ── FLUXO 1: WhatsApp Bitrix (65% = R$ 1.430/sem) ────────────
  {
    id: 'EXC_WA_01',
    nome: 'EXC_WA_Quente',
    fluxo: 'bittrex',
    temperatura: 'quente',
    verbaSemanal: 169.00,
    segmentacao: 'MONTEIRO GT - SE ENVOLVEU 7 + 95% DOS VÍDEOS DE CAMPANHA',
    geo: 'Todo o Ceará',
  },
  {
    id: 'EXC_WA_02',
    nome: 'EXC_WA_Morno',
    fluxo: 'bittrex',
    temperatura: 'morno',
    verbaSemanal: 325.00,
    segmentacao: 'SE ENVOLVEU 30d + 90d + 365d + VISITARAM PERFIL 30d + 365d + SEGUIDORES + ENGAJARAM 365d',
    geo: 'Todo o Ceará',
  },
  {
    id: 'EXC_WA_03',
    nome: 'EXC_WA_Frio',
    fluxo: 'bittrex',
    temperatura: 'frio',
    verbaSemanal: 858.00,
    segmentacao: 'LKL 1% dos públicos + Interesses em consórcio, imóveis e investimentos',
    geo: 'Todo o Ceará',
  },
  {
    id: 'EXC_RMK_WA',
    nome: 'EXC_RMK_WhatsApp',
    fluxo: 'bittrex',
    temperatura: 'remarketing',
    verbaSemanal: 78.00,
    segmentacao: '75% Vídeos Novas Campanhas + MONTEIRO GT - SE ENVOLVEU 7',
    geo: 'Todo o Ceará',
  },
  // ── FLUXO 2: Formulário Grupo GT (20% = R$ 440/sem) ──────────
  {
    id: 'EXC_FORM_01',
    nome: 'EXC_FORM_GT',
    fluxo: 'grupoGT',
    temperatura: 'frio',
    verbaSemanal: 356.00,
    segmentacao: 'Alto Poder Aquisitivo + LKL 1% Planilha Lead Monteiro GT',
    geo: 'Todo o Ceará',
  },
  {
    id: 'EXC_RMK_FORM',
    nome: 'EXC_RMK_Formulario',
    fluxo: 'grupoGT',
    temperatura: 'remarketing',
    verbaSemanal: 84.00,
    segmentacao: '75% Vídeos Novas Campanhas + MONTEIRO GT - SE ENVOLVEU 7',
    geo: 'Todo o Ceará',
  },
  // ── FLUXO 3: Formulário Davi (10% = R$ 220/sem) ──────────────
  {
    id: 'EXC_DAVI_01',
    nome: 'EXC_DAVI',
    fluxo: 'davi',
    temperatura: 'frio',
    verbaSemanal: 220.00,
    segmentacao: 'LKL 1% Públicos Frios + Planilha Lead Monteiro GT',
    geo: 'Fortaleza + Região Metropolitana',
  },
  // ── FLUXO 4: Formulário Eliana (5% = R$ 110/sem) — inicia S2 ─
  {
    id: 'GT_ELIANA_01',
    nome: 'GT_FORM_Eliana',
    fluxo: 'eliana',
    temperatura: 'frio',
    verbaSemanal: 110.00,
    segmentacao: 'LKL 1% Públicos Frios + Interesses consórcio, imóveis, veículos',
    geo: 'Fortaleza + Região Metropolitana',
    iniciaSemana: 2,
    cplMeta: 20.00,
  },
];

export const VERBA_BRUTA_SEMANAL_EXCALA = 2500.00;
export const IMPOSTO_EXCALA = 0.12;
export const VERBA_LIQUIDA_SEMANAL_EXCALA = 2200.00;
export const VERBA_TOTAL_CAMPANHA_EXCALA = 8800.00;
export const TOTAL_SEMANAS_EXCALA = 4;

export const CAMPANHAS_EXCALA_MAP = Object.fromEntries(
  CAMPANHAS_EXCALA.map(c => [c.nome.toLowerCase(), c])
);

export function encontrarCampanhaExcala(nomeCampanha) {
  if (!nomeCampanha) return null;
  const key = nomeCampanha.toLowerCase().trim();
  if (CAMPANHAS_EXCALA_MAP[key]) return CAMPANHAS_EXCALA_MAP[key];
  return CAMPANHAS_EXCALA.find(c =>
    key.includes(c.nome.toLowerCase()) || c.nome.toLowerCase().includes(key)
  ) || null;
}

// ── Segmentação padrão da Excala ─────────────────────────────
export const DEFAULT_SEGMENTACAO_EXCALA = [
  {
    temperatura: 'quente',
    emoji: '🔴',
    label: 'QUENTE',
    cor: {
      header: 'bg-red-600',
      borda: 'border-red-200',
      fundo: 'bg-red-50',
      badge: 'bg-red-100 text-red-700',
      linha: 'hover:bg-red-50',
    },
    publicos: [
      {
        publico: 'MONTEIRO GT - SE ENVOLVEU 7 + 95% DOS VÍDEOS DE CAMPANHA',
        videos: ['EV1 — 60% das Operações', 'EV6 — Tem 100 mil no Banco', 'V4 — Plano Sem Lance', 'V8 — Traduzindo Consórcio'],
        localidade: 'Todo o Ceará',
        campanhas: ['EXC_WA_01'],
      },
    ],
  },
  {
    temperatura: 'morno',
    emoji: '🟡',
    label: 'MORNO',
    cor: {
      header: 'bg-orange-500',
      borda: 'border-orange-200',
      fundo: 'bg-orange-50',
      badge: 'bg-orange-100 text-orange-700',
      linha: 'hover:bg-orange-50',
    },
    publicos: [
      {
        publico: 'SE ENVOLVEU 30d + 90d + 365d + VISITARAM PERFIL 30d + 365d + SEGUIDORES + ENGAJARAM COM ANÚNCIO 365d (1 conjunto unificado)',
        videos: ['V1 — 3 Formas de Comprá-lo', 'V2 — Aluguel Disfarçado', 'V3 — Erro Financeiro', 'EV5 — Quer Fazer seu Dinheiro Multiplicar', 'EV7 — Usando Consórcio para Financiar seu Negócio'],
        localidade: 'Todo o Ceará',
        campanhas: ['EXC_WA_02'],
      },
    ],
  },
  {
    temperatura: 'frio',
    emoji: '🔵',
    label: 'FRIO',
    cor: {
      header: 'bg-blue-600',
      borda: 'border-blue-200',
      fundo: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-700',
      linha: 'hover:bg-blue-50',
    },
    publicos: [
      {
        publico: 'LKL 1% de todos os públicos + Interesses em consórcio, imóveis, veículos e investimentos',
        videos: ['EV2 — Comprando Imóveis sem Pagar Juros', 'EV3 — Construtor', 'EV4 — Produtor Rural 1', 'EV8 — Você Produtor Rural', 'V5 — Tela Dividida BYD', 'V6 — Tela Dividida Corolla', 'V7 — Tela Dividida Picape', 'V9 — H9/Haval'],
        localidade: 'Todo o Ceará',
        campanhas: ['EXC_WA_03'],
      },
      {
        publico: 'Alto Poder Aquisitivo + LKL 1% Planilha de Lead Geral Monteiro GT',
        videos: ['EV2 — Comprando Imóveis sem Pagar Juros', 'EV3 — Construtor', 'EV5 — Quer Fazer seu Dinheiro Multiplicar', 'EV6 — Tem 100 mil no Banco', 'EV7 — Usando Consórcio para Financiar seu Negócio'],
        localidade: 'Todo o Ceará',
        campanhas: ['EXC_FORM_01'],
      },
      {
        publico: 'LKL 1% Planilha Lead + LKL 1% Públicos Frios',
        videos: ['EV2 — Comprando Imóveis sem Pagar Juros', 'EV4 — Produtor Rural 1', 'EV8 — Você Produtor Rural', 'V5 — Tela Dividida BYD', 'V7 — Tela Dividida Picape'],
        localidade: 'Fortaleza + Região Metropolitana',
        campanhas: ['EXC_DAVI_01'],
      },
      {
        publico: 'LKL 1% Públicos Frios + Interesses consórcio, imóveis, veículos — Formulário Eliana (inicia S2)',
        videos: ['V2 — Aluguel Disfarçado', 'V3 — Erro Financeiro', 'V7 — Tela Dividida Picape'],
        localidade: 'Fortaleza + Região Metropolitana',
        campanhas: ['GT_ELIANA_01'],
      },
    ],
  },
  {
    temperatura: 'remarketing',
    emoji: '🔁',
    label: 'REMARKETING',
    cor: {
      header: 'bg-violet-600',
      borda: 'border-violet-200',
      fundo: 'bg-violet-50',
      badge: 'bg-violet-100 text-violet-700',
      linha: 'hover:bg-violet-50',
    },
    publicos: [
      {
        publico: '75% dos vídeos das novas campanhas + MONTEIRO GT - SE ENVOLVEU 7 → WhatsApp',
        videos: ['EV_RMK_WA — Remarketing WhatsApp (em breve)', 'EV1 — 60% das Operações', 'EV6 — Tem 100 mil no Banco'],
        localidade: 'Todo o Ceará',
        campanhas: ['EXC_RMK_WA'],
      },
      {
        publico: '75% dos vídeos das novas campanhas + MONTEIRO GT - SE ENVOLVEU 7 → Formulário',
        videos: ['EV_RMK_FORM — Remarketing Formulário (em breve)', 'EV2 — Comprando Imóveis sem Pagar Juros', 'EV5 — Quer Fazer seu Dinheiro Multiplicar'],
        localidade: 'Todo o Ceará',
        campanhas: ['EXC_RMK_FORM'],
      },
    ],
  },
];
