import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_WEEKLY_DATA, MOCK_IMPORTS } from '../data/mockData';

const EMPTY_WEEKLY_DATA = { 1: [], 2: [], 3: [], 4: [] };

const DEFAULT_SEGMENTACAO = [
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
        publico: 'Envolvidos com o perfil nos últimos 7 dias',
        videos: ['V4 — Plano Sem Lance', 'V8 — Traduzindo Consórcio'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_WA_01', 'RAB_FORM_01'],
      },
      {
        publico: 'Assistiu 95% ou mais dos vídeos do feed',
        videos: ['V4 — Plano Sem Lance', 'V8 — Traduzindo Consórcio'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_WA_02', 'RAB_FORM_01'],
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
        publico: 'Envolvidos com o perfil nos últimos 30 dias',
        videos: ['V1 — 3 Formas de Comprá-lo', 'V2 — Aluguel Disfarçado', 'V3 — Erro Financeiro'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_WA_03', 'RAB_FORM_02'],
      },
      {
        publico: 'Envolvidos com o perfil nos últimos 90 dias',
        videos: ['V1 — 3 Formas de Comprá-lo', 'V2 — Aluguel Disfarçado', 'V3 — Erro Financeiro'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_WA_03', 'RAB_FORM_02'],
      },
      {
        publico: 'Envolvidos com o perfil nos últimos 365 dias',
        videos: ['V1 — 3 Formas de Comprá-lo', 'V2 — Aluguel Disfarçado', 'V3 — Erro Financeiro'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_WA_03', 'RAB_FORM_02'],
      },
      {
        publico: 'Visitou o perfil nos últimos 30 dias',
        videos: ['V1 — 3 Formas de Comprá-lo', 'V2 — Aluguel Disfarçado'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_WA_04'],
      },
      {
        publico: 'Visitou o perfil nos últimos 365 dias',
        videos: ['V1 — 3 Formas de Comprá-lo', 'V2 — Aluguel Disfarçado'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_WA_04'],
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
        publico: 'Interesse em consórcio + veículos (ticket R$80k–150k) + Lookalike 1%',
        videos: ['V5 — BYD', 'V6 — Corolla', 'V7 — Picape'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_WA_05'],
      },
      {
        publico: 'Lookalike 1% de compradores (base de clientes)',
        videos: ['V6 — Corolla', 'V7 — Picape'],
        localidade: 'Todo o Ceará',
        campanhas: ['RAB_FORM_03'],
      },
      {
        publico: 'Amplo — 28 a 55 anos, sem segmentação por interesse',
        videos: ['V2 — Aluguel Disfarçado', 'V3 — Erro Financeiro'],
        localidade: 'Fortaleza + Região Metropolitana',
        campanhas: ['RAB_DAVI_02'],
      },
      {
        publico: 'Interesse em consórcio + imóveis + veículos · renda R$5k–15k',
        videos: ['V5 — BYD', 'V9 — H9/Haval'],
        localidade: 'Fortaleza + Região Metropolitana',
        campanhas: ['RAB_DAVI_01'],
      },
      {
        publico: 'Interesse em consórcio + veículos · renda média-alta',
        videos: ['V5 — BYD', 'V7 — Picape', 'V9 — H9/Haval'],
        localidade: 'Recife · Salvador · Natal',
        campanhas: ['RAB_WA_06'],
      },
      {
        publico: 'LKL 1% de Envolveu + Seguidor',
        videos: ['V1 — 3 Formas de Comprá-lo', 'V2 — Aluguel Disfarçado', 'V3 — Erro Financeiro'],
        localidade: 'Nordeste do Brasil',
        campanhas: ['RAB_WA_07'],
      },
      {
        publico: 'LKL 1% de Visitou + Vídeo',
        videos: ['V5 — BYD', 'V6 — Corolla', 'V7 — Picape'],
        localidade: 'Nordeste do Brasil',
        campanhas: ['RAB_WA_08'],
      },
    ],
  },
];

const AppContext = createContext(null);

const DEFAULT_CONFIG = {
  clientName: 'GT Consórcios',
  bmName: 'Rodobens',
  cplTargets: {
    bittrex: 20,
    grupoGT: 15,
    davi: 18,
  },
  adVideoMap: {
    // Mapeamento pré-configurado dos anúncios mock
    'V1_3Formas_WA03': 'V1',
    'V1_3Formas_WA04': 'V1',
    'V1_3Formas_FORM02': 'V1',
    'V2_AluguelDisfarcado_WA03': 'V2',
    'V2_AluguelDisfarcado_WA04': 'V2',
    'V2_AluguelDisfarcado_FORM02': 'V2',
    'V2_AluguelDisfarcado_DAVI02': 'V2',
    'V3_ErroFinanceiro_WA03': 'V3',
    'V3_ErroFinanceiro_FORM02': 'V3',
    'V3_ErroFinanceiro_DAVI02': 'V3',
    'V4_PlanSemLance_WA01': 'V4',
    'V4_PlanSemLance_WA02': 'V4',
    'V4_PlanSemLance_FORM01': 'V4',
    'V5_TelaDivididaBYD_WA05': 'V5',
    'V5_TelaDivididaBYD_WA06': 'V5',
    'V5_TelaDivididaBYD_DAVI01': 'V5',
    'V6_TelaDivididaCorolla_WA05': 'V6',
    'V6_TelaDivididaCorolla_FORM03': 'V6',
    'V7_TelaDivididaPicape_WA05': 'V7',
    'V7_TelaDivididaPicape_WA06': 'V7',
    'V7_TelaDivididaPicape_FORM03': 'V7',
    'V8_TraduzindoConsorcio_WA01': 'V8',
    'V8_TraduzindoConsorcio_WA02': 'V8',
    'V8_TraduzindoConsorcio_FORM01': 'V8',
    'V9_VideoHaval_WA06': 'V9',
    'V9_VideoHaval_DAVI01': 'V9',
    // RAB_WA_07 — LKL 1% Envolveu + Seguidor
    'V1_3Formas_WA07': 'V1',
    'V2_AluguelDisfarcado_WA07': 'V2',
    'V3_ErroFinanceiro_WA07': 'V3',
    // RAB_WA_08 — LKL 1% Visitou + Vídeo
    'V5_TelaDivididaBYD_WA08': 'V5',
    'V6_TelaDivididaCorolla_WA08': 'V6',
    'V7_TelaDivididaPicape_WA08': 'V7',
  },
  columnMap: {},
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('gt_consorcio_data');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem('gt_consorcio_data', JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar no localStorage', e);
  }
}

export function AppProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [segmentacao, setSegmentacao] = useState(DEFAULT_SEGMENTACAO);
  const [weeklyData, setWeeklyData] = useState(EMPTY_WEEKLY_DATA);
  const [imports, setImports] = useState([]);
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeFluxo, setActiveFluxo] = useState('todos');
  const [activeTemp, setActiveTemp] = useState('todos');
  const [loading, setLoading] = useState(false);

  // Carrega dados do localStorage na inicialização
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      if (stored.config) setConfig(c => ({ ...DEFAULT_CONFIG, ...stored.config, cplTargets: { ...DEFAULT_CONFIG.cplTargets, ...(stored.config.cplTargets || {}) }, adVideoMap: { ...DEFAULT_CONFIG.adVideoMap, ...(stored.config.adVideoMap || {}) } }));
      if (stored.weeklyData && Object.keys(stored.weeklyData).length > 0) setWeeklyData(stored.weeklyData);
      if (stored.imports) setImports(stored.imports);
      if (stored.segmentacao) setSegmentacao(stored.segmentacao);
    }
  }, []);

  // Persiste no localStorage sempre que muda
  useEffect(() => {
    saveToStorage({ config, weeklyData, imports, segmentacao });
  }, [config, weeklyData, imports, segmentacao]);

  const updateConfig = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSegmentacao = useCallback((nova) => {
    setSegmentacao(nova);
  }, []);

  const importWeekData = useCallback((week, rows, filename) => {
    setWeeklyData(prev => ({ ...prev, [week]: rows }));
    const importEntry = {
      id: `import_${Date.now()}`,
      week,
      importedAt: new Date().toISOString(),
      filename,
      rowCount: rows.length,
    };
    setImports(prev => {
      const sem = prev.filter(i => i.week !== week);
      return [...sem, importEntry].sort((a, b) => a.week - b.week);
    });
  }, []);

  const resetToMock = useCallback(() => {
    setWeeklyData(MOCK_WEEKLY_DATA);
    setImports(MOCK_IMPORTS);
    setConfig(DEFAULT_CONFIG);
    setSegmentacao(DEFAULT_SEGMENTACAO);
  }, []);

  const value = {
    config,
    updateConfig,
    segmentacao,
    updateSegmentacao,
    weeklyData,
    imports,
    importWeekData,
    resetToMock,
    activeWeek,
    setActiveWeek,
    activeFluxo,
    setActiveFluxo,
    activeTemp,
    setActiveTemp,
    loading,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
