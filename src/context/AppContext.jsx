import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_WEEKLY_DATA, MOCK_IMPORTS } from '../data/mockData';

// Rodobens
import { CAMPANHAS, FLUXOS, encontrarCampanha } from '../data/campaigns';
import { VIDEOS } from '../data/videos';
import { VERBA_TOTAL_SEMANAL, VERBA_TOTAL_CAMPANHA } from '../data/campaigns';

// Excala
import {
  CAMPANHAS_EXCALA, FLUXOS_EXCALA, encontrarCampanhaExcala,
  DEFAULT_SEGMENTACAO_EXCALA,
  VERBA_LIQUIDA_SEMANAL_EXCALA, VERBA_TOTAL_CAMPANHA_EXCALA,
} from '../data/campaigns_excala';
import { VIDEOS_EXCALA } from '../data/videos_excala';

const EMPTY_WEEKLY_DATA = { 1: [], 2: [], 3: [], 4: [] };
const STORAGE_KEY = 'gt_consorcio_v2';

// ── Segmentação padrão Rodobens ───────────────────────────────
const DEFAULT_SEGMENTACAO_RODOBENS = [
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

// ── Configs padrão por BM ─────────────────────────────────────
const DEFAULT_CONFIG_RODOBENS = {
  clientName: 'GT Consórcios',
  bmName: 'Rodobens',
  cplTargets: { bittrex: 20, grupoGT: 15, davi: 18 },
  adVideoMap: {
    'V1_3Formas_WA03': 'V1', 'V1_3Formas_WA04': 'V1', 'V1_3Formas_FORM02': 'V1',
    'V2_AluguelDisfarcado_WA03': 'V2', 'V2_AluguelDisfarcado_WA04': 'V2',
    'V2_AluguelDisfarcado_FORM02': 'V2', 'V2_AluguelDisfarcado_DAVI02': 'V2',
    'V3_ErroFinanceiro_WA03': 'V3', 'V3_ErroFinanceiro_FORM02': 'V3', 'V3_ErroFinanceiro_DAVI02': 'V3',
    'V4_PlanSemLance_WA01': 'V4', 'V4_PlanSemLance_WA02': 'V4', 'V4_PlanSemLance_FORM01': 'V4',
    'V5_TelaDivididaBYD_WA05': 'V5', 'V5_TelaDivididaBYD_WA06': 'V5', 'V5_TelaDivididaBYD_DAVI01': 'V5',
    'V6_TelaDivididaCorolla_WA05': 'V6', 'V6_TelaDivididaCorolla_FORM03': 'V6',
    'V7_TelaDivididaPicape_WA05': 'V7', 'V7_TelaDivididaPicape_WA06': 'V7', 'V7_TelaDivididaPicape_FORM03': 'V7',
    'V8_TraduzindoConsorcio_WA01': 'V8', 'V8_TraduzindoConsorcio_WA02': 'V8', 'V8_TraduzindoConsorcio_FORM01': 'V8',
    'V9_VideoHaval_WA06': 'V9', 'V9_VideoHaval_DAVI01': 'V9',
    'V1_3Formas_WA07': 'V1', 'V2_AluguelDisfarcado_WA07': 'V2', 'V3_ErroFinanceiro_WA07': 'V3',
    'V5_TelaDivididaBYD_WA08': 'V5', 'V6_TelaDivididaCorolla_WA08': 'V6', 'V7_TelaDivididaPicape_WA08': 'V7',
  },
  columnMap: {},
};

const DEFAULT_CONFIG_EXCALA = {
  clientName: 'GT Consórcios',
  bmName: 'GT Consórcios Excala',
  cplTargets: { bittrex: 20, grupoGT: 15, davi: 18 },
  adVideoMap: {},
  columnMap: {},
};

// ── Estado inicial por BM ─────────────────────────────────────
const DEFAULT_BM_STATES = {
  rodobens: {
    weeklyData: EMPTY_WEEKLY_DATA,
    imports: [],
    campanhasOcultas: [],
    config: DEFAULT_CONFIG_RODOBENS,
    segmentacao: DEFAULT_SEGMENTACAO_RODOBENS,
  },
  excala: {
    weeklyData: EMPTY_WEEKLY_DATA,
    imports: [],
    campanhasOcultas: [],
    config: DEFAULT_CONFIG_EXCALA,
    segmentacao: DEFAULT_SEGMENTACAO_EXCALA,
  },
};

// ── localStorage ──────────────────────────────────────────────
function loadFromStorage() {
  try {
    // Tenta novo formato primeiro
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    // Migra do formato antigo (só tinha Rodobens)
    const oldRaw = localStorage.getItem('gt_consorcio_data');
    if (oldRaw) {
      const old = JSON.parse(oldRaw);
      return {
        activeBM: 'rodobens',
        rodobens: {
          config: old.config || null,
          weeklyData: old.weeklyData || null,
          imports: old.imports || [],
          segmentacao: old.segmentacao || null,
          campanhasOcultas: old.campanhasOcultas || [],
        },
        excala: null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar no localStorage', e);
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeBM, setActiveBM] = useState('rodobens');
  const [bmStates, setBmStates] = useState(DEFAULT_BM_STATES);

  // Filtros globais (compartilhados entre BMs)
  const [activeWeek, setActiveWeek] = useState(1);
  const [activeFluxo, setActiveFluxo] = useState('todos');
  const [activeTemp, setActiveTemp] = useState('todos');
  const [loading, setLoading] = useState(false);

  // ── Carrega do localStorage na inicialização ──────────────────
  useEffect(() => {
    const stored = loadFromStorage();
    if (!stored) return;

    if (stored.activeBM) setActiveBM(stored.activeBM);

    setBmStates(prev => {
      const next = { ...prev };

      ['rodobens', 'excala'].forEach(bm => {
        const s = stored[bm];
        if (!s) return;
        const defaults = DEFAULT_BM_STATES[bm];
        next[bm] = {
          weeklyData: (s.weeklyData && Object.keys(s.weeklyData).length > 0) ? s.weeklyData : defaults.weeklyData,
          imports: s.imports || defaults.imports,
          campanhasOcultas: s.campanhasOcultas || defaults.campanhasOcultas,
          config: s.config
            ? {
                ...defaults.config,
                ...s.config,
                cplTargets: { ...defaults.config.cplTargets, ...(s.config.cplTargets || {}) },
                adVideoMap: { ...defaults.config.adVideoMap, ...(s.config.adVideoMap || {}) },
              }
            : defaults.config,
          segmentacao: s.segmentacao || defaults.segmentacao,
        };
      });

      return next;
    });
  }, []);

  // ── Persiste no localStorage sempre que muda ──────────────────
  useEffect(() => {
    saveToStorage({ activeBM, rodobens: bmStates.rodobens, excala: bmStates.excala });
  }, [activeBM, bmStates]);

  // ── Utilitário para atualizar estado da BM ativa ──────────────
  const updateCurrentBM = useCallback((updates) => {
    setBmStates(prev => ({
      ...prev,
      [activeBM]: { ...prev[activeBM], ...updates },
    }));
  }, [activeBM]);

  // ── Atalhos para o estado da BM atual ────────────────────────
  const currentState = bmStates[activeBM];
  const weeklyData     = currentState.weeklyData;
  const imports        = currentState.imports;
  const config         = currentState.config;
  const segmentacao    = currentState.segmentacao;
  const campanhasOcultas = currentState.campanhasOcultas;

  // ── Dados específicos da BM ativa ────────────────────────────
  const campanhas           = activeBM === 'excala' ? CAMPANHAS_EXCALA     : CAMPANHAS;
  const fluxos              = activeBM === 'excala' ? FLUXOS_EXCALA        : FLUXOS;
  const videos              = activeBM === 'excala' ? VIDEOS_EXCALA        : VIDEOS;
  const encontrarCampanhaFn = activeBM === 'excala' ? encontrarCampanhaExcala : encontrarCampanha;
  const verbaTotalSemanal   = activeBM === 'excala' ? VERBA_LIQUIDA_SEMANAL_EXCALA : VERBA_TOTAL_SEMANAL;
  const verbaTotalCampanha  = activeBM === 'excala' ? VERBA_TOTAL_CAMPANHA_EXCALA  : VERBA_TOTAL_CAMPANHA;
  const bmLabel             = activeBM === 'excala' ? 'GT Excala' : 'Rodobens';
  const impostoInfo         = activeBM === 'excala' ? { tem: true, pct: 12 } : { tem: false, pct: 0 };

  // ── bmContext — passado às funções de cálculo ─────────────────
  const bmContext = useMemo(() => ({
    campanhas,
    fluxos,
    videos,
    encontrarCampanhaFn,
  }), [campanhas, fluxos, videos, encontrarCampanhaFn]);

  // ── Mutadores ─────────────────────────────────────────────────
  const updateConfig = useCallback((updates) => {
    updateCurrentBM({
      config: { ...bmStates[activeBM].config, ...updates },
    });
  }, [updateCurrentBM, bmStates, activeBM]);

  const updateSegmentacao = useCallback((nova) => {
    updateCurrentBM({ segmentacao: nova });
  }, [updateCurrentBM]);

  const ocultarCampanhas = useCallback((nomes) => {
    updateCurrentBM({
      campanhasOcultas: [...new Set([...bmStates[activeBM].campanhasOcultas, ...nomes])],
    });
  }, [updateCurrentBM, bmStates, activeBM]);

  const restaurarCampanhas = useCallback((nomes) => {
    updateCurrentBM({
      campanhasOcultas: bmStates[activeBM].campanhasOcultas.filter(n => !nomes.includes(n)),
    });
  }, [updateCurrentBM, bmStates, activeBM]);

  const importWeekData = useCallback((week, rows, filename) => {
    const newWeeklyData = { ...bmStates[activeBM].weeklyData, [week]: rows };
    const importEntry = {
      id: `import_${Date.now()}`,
      week,
      importedAt: new Date().toISOString(),
      filename,
      rowCount: rows.length,
    };
    const sem = bmStates[activeBM].imports.filter(i => i.week !== week);
    const newImports = [...sem, importEntry].sort((a, b) => a.week - b.week);
    updateCurrentBM({ weeklyData: newWeeklyData, imports: newImports });
  }, [updateCurrentBM, bmStates, activeBM]);

  const resetToMock = useCallback(() => {
    if (activeBM === 'rodobens') {
      updateCurrentBM({
        weeklyData: MOCK_WEEKLY_DATA,
        imports: MOCK_IMPORTS,
        config: DEFAULT_CONFIG_RODOBENS,
        segmentacao: DEFAULT_SEGMENTACAO_RODOBENS,
        campanhasOcultas: [],
      });
    } else {
      updateCurrentBM({
        weeklyData: EMPTY_WEEKLY_DATA,
        imports: [],
        config: DEFAULT_CONFIG_EXCALA,
        segmentacao: DEFAULT_SEGMENTACAO_EXCALA,
        campanhasOcultas: [],
      });
    }
  }, [updateCurrentBM, activeBM]);

  const value = {
    // BM switching
    activeBM,
    setActiveBM,
    bmLabel,
    bmContext,
    impostoInfo,

    // Dados da BM ativa
    campanhas,
    fluxos,
    videos,
    encontrarCampanhaFn,
    verbaTotalSemanal,
    verbaTotalCampanha,

    // Estado atual
    config,
    updateConfig,
    segmentacao,
    updateSegmentacao,
    campanhasOcultas,
    ocultarCampanhas,
    restaurarCampanhas,
    weeklyData,
    imports,
    importWeekData,
    resetToMock,

    // Filtros globais
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
