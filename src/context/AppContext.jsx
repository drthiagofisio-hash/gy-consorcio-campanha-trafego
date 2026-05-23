import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_WEEKLY_DATA, MOCK_IMPORTS } from '../data/mockData';

const EMPTY_WEEKLY_DATA = { 1: [], 2: [], 3: [], 4: [] };

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
    }
  }, []);

  // Persiste no localStorage sempre que muda
  useEffect(() => {
    saveToStorage({ config, weeklyData, imports });
  }, [config, weeklyData, imports]);

  const updateConfig = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
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
  }, []);

  const value = {
    config,
    updateConfig,
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
