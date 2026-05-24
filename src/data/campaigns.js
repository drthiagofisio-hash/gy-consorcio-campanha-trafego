// ============================================================
// DADOS FIXOS DAS CAMPANHAS — GT CONSÓRCIOS / BM RODOBENS
// ============================================================

export const FLUXOS = {
  bittrex: { id: 'bittrex', nome: 'WhatsApp Bittrex', percentual: 70, verbaSemanal: 1907.50 },
  grupoGT: { id: 'grupoGT', nome: 'Formulário Grupo GT', percentual: 20, verbaSemanal: 545.00 },
  davi:    { id: 'davi',    nome: 'Formulário Davi',    percentual: 10, verbaSemanal: 272.50 },
};

export const TEMPERATURAS = {
  quente: { id: 'quente', nome: 'Quente', cor: '#ef4444', badge: 'bg-red-100 text-red-700' },
  morno:  { id: 'morno',  nome: 'Morno',  cor: '#f97316', badge: 'bg-orange-100 text-orange-700' },
  frio:   { id: 'frio',   nome: 'Frio',   cor: '#3b82f6', badge: 'bg-blue-100 text-blue-700' },
};

export const CAMPANHAS = [
  // ── FLUXO 1: WhatsApp Bittrex (70%) ─────────────────────────
  {
    id: 'RAB_WA_01',
    nome: 'RAB_WA_Quente7d',
    fluxo: 'bittrex',
    segmentacao: 'Envolvidos perfil 7 dias',
    geo: 'Todo Ceará',
    temperatura: 'quente',
    verbaSemanal: 250.00,
  },
  {
    id: 'RAB_WA_02',
    nome: 'RAB_WA_Quente_Video',
    fluxo: 'bittrex',
    segmentacao: 'Assistiu 95% vídeos feed',
    geo: 'Todo Ceará',
    temperatura: 'quente',
    verbaSemanal: 250.00,
  },
  {
    id: 'RAB_WA_03',
    nome: 'RAB_WA_Morno_Envolvidos',
    fluxo: 'bittrex',
    segmentacao: 'Envolvidos 30d + 90d + 365d',
    geo: 'Todo Ceará',
    temperatura: 'morno',
    verbaSemanal: 350.00,
  },
  {
    id: 'RAB_WA_04',
    nome: 'RAB_WA_Morno_Visitou',
    fluxo: 'bittrex',
    segmentacao: 'Visitou perfil 30d + 365d',
    geo: 'Todo Ceará',
    temperatura: 'morno',
    verbaSemanal: 307.50,
  },
  {
    id: 'RAB_WA_05',
    nome: 'RAB_WA_Frio_Interesse',
    fluxo: 'bittrex',
    segmentacao: 'Interesse consórcio + veículos 80-150k + lookalike',
    geo: 'Todo Ceará',
    temperatura: 'frio',
    verbaSemanal: 400.00,
  },
  {
    id: 'RAB_WA_06',
    nome: 'RAB_WA_Nordeste',
    fluxo: 'bittrex',
    segmentacao: 'Interesse consórcio + veículos · renda média-alta',
    geo: 'Recife · Salvador · Natal',
    temperatura: 'frio',
    verbaSemanal: 350.00,
  },
  {
    id: 'RAB_WA_07',
    nome: 'RAB_WA_LKL_Envolveu',
    fluxo: 'bittrex',
    segmentacao: 'LKL 1% de Envolveu + Seguidor',
    geo: 'Nordeste do Brasil',
    temperatura: 'frio',
    verbaSemanal: 300.00,
  },
  {
    id: 'RAB_WA_08',
    nome: 'RAB_WA_LKL_Visitou',
    fluxo: 'bittrex',
    segmentacao: 'LKL 1% de Visitou + Vídeo',
    geo: 'Nordeste do Brasil',
    temperatura: 'frio',
    verbaSemanal: 300.00,
  },
  // ── FLUXO 2: Formulário Grupo GT (20%) ───────────────────────
  {
    id: 'RAB_FORM_01',
    nome: 'RAB_FORM_Quente_Video',
    fluxo: 'grupoGT',
    segmentacao: 'Assistiu 95% vídeos + envolvidos 7d',
    geo: 'Todo Ceará',
    temperatura: 'quente',
    verbaSemanal: 200.00,
  },
  {
    id: 'RAB_FORM_02',
    nome: 'RAB_FORM_Morno_Envolvidos',
    fluxo: 'grupoGT',
    segmentacao: 'Envolvidos 30d + 90d + visitou 365d',
    geo: 'Todo Ceará',
    temperatura: 'morno',
    verbaSemanal: 200.00,
  },
  {
    id: 'RAB_FORM_03',
    nome: 'RAB_FORM_Lookalike',
    fluxo: 'grupoGT',
    segmentacao: 'Lookalike 1% compradores',
    geo: 'Todo Ceará',
    temperatura: 'frio',
    verbaSemanal: 145.00,
  },
  // ── FLUXO 3: Formulário Davi (10%) ───────────────────────────
  {
    id: 'RAB_DAVI_01',
    nome: 'RAB_DAVI_Interesse',
    fluxo: 'davi',
    segmentacao: 'Interesse consórcio + imóveis + veículos · renda 5-15k',
    geo: 'Fortaleza + RMF',
    temperatura: 'frio',
    verbaSemanal: 145.00,
  },
  {
    id: 'RAB_DAVI_02',
    nome: 'RAB_DAVI_Amplo',
    fluxo: 'davi',
    segmentacao: 'Amplo 28-55 anos sem segmentação de interesse',
    geo: 'Fortaleza + RMF',
    temperatura: 'frio',
    verbaSemanal: 127.50,
  },
];

export const VERBA_TOTAL_SEMANAL = 2725.00;
export const VERBA_TOTAL_CAMPANHA = 10900.00;
export const TOTAL_SEMANAS = 4;

// Mapa rápido: nome da campanha → objeto campanha
export const CAMPANHAS_MAP = Object.fromEntries(
  CAMPANHAS.map(c => [c.nome.toLowerCase(), c])
);

// Busca campanha por nome (tolerante a variações)
export function encontrarCampanha(nomeCampanha) {
  if (!nomeCampanha) return null;
  const key = nomeCampanha.toLowerCase().trim();
  if (CAMPANHAS_MAP[key]) return CAMPANHAS_MAP[key];
  return CAMPANHAS.find(c =>
    key.includes(c.nome.toLowerCase()) || c.nome.toLowerCase().includes(key)
  ) || null;
}
