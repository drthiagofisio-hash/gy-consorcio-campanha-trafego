// ============================================================
// PARSER DE CSV DA META ADS
// ============================================================
import Papa from 'papaparse';
import { encontrarCampanha, CAMPANHAS } from '../data/campaigns';

// Mapeamento de nomes de colunas da Meta (com variações de idioma)
export const COLUMN_ALIASES = {
  campaignName: [
    'Nome da campanha', 'Campaign name', 'Nombre de la campaña',
    'nome da campanha', 'campaign name',
  ],
  adSetName: [
    'Nome do conjunto de anúncios', 'Ad set name', 'Ad Set Name',
    'nome do conjunto de anúncios', 'conjunto de anúncios',
  ],
  adName: [
    'Nome do anúncio', 'Ad name', 'Ad Name',
    'nome do anúncio', 'anúncio',
  ],
  spend: [
    'Valor usado (BRL)', 'Valor gasto (BRL)', 'Amount spent (BRL)',
    'valor usado', 'valor gasto', 'amount spent', 'spend',
  ],
  results: [
    'Resultados', 'Results', 'resultados',
  ],
  resultIndicator: [
    'Indicador de resultados', 'Result indicator', 'indicador de resultados',
    'Indicador do resultado', 'Result Indicator',
  ],
  leads: [
    'Leads', 'leads',
  ],
  conversations: [
    'Conversas iniciadas no WhatsApp',
    'Conversas iniciadas (mensagens)', 'Conversations started (messages)',
    'Conversas iniciadas', 'conversas iniciadas', 'conversations',
    'Mensagens iniciadas', 'messaging conversations started',
    'Início de conversa', 'inicio de conversa',
    'Conversas no WhatsApp', 'conversas no whatsapp',
    'WhatsApp conversations', 'whatsapp conversations',
    'New messaging connections', 'new messaging connections',
  ],
  costPerResult: [
    'Custo por resultado', 'Cost per result', 'custo por resultado',
    'Custo por resultados', 'custo por resultados',
  ],
  costPerLead: [
    'Custo por lead', 'Cost per lead', 'custo por lead',
  ],
  costPerConversation: [
    'Custo por conversa iniciada', 'Cost per conversation started',
    'custo por conversa', 'cost per messaging conversation started',
  ],
  frequency: [
    'Frequência', 'Frequency', 'frequência',
  ],
  clicks: [
    'Cliques (todos)', 'Clicks (all)', 'cliques (todos)', 'clicks (all)',
    'cliques', 'clicks',
  ],
  cpc: [
    'Custo por clique (todos)', 'Cost per click (all)',
    'custo por clique', 'cost per click',
  ],
  ctr: [
    'CTR (todos)', 'CTR (all)', 'ctr (todos)', 'ctr (all)', 'ctr',
  ],
  reach: [
    'Alcance', 'Reach', 'alcance', 'reach',
  ],
  profileVisits: [
    'Visitas ao perfil', 'Profile visits', 'visitas ao perfil',
  ],
  followers: [
    'Seguidores', 'Followers', 'seguidores', 'page follows',
  ],
};

// Detecta separador do CSV
function detectSeparator(rawText) {
  const firstLine = rawText.split('\n')[0];
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  return semicolons > commas ? ';' : ',';
}

// Converte número no formato brasileiro (1.234,56 → 1234.56)
function parseBRNumber(val) {
  if (val == null || val === '' || val === '-') return 0;
  const s = String(val).trim();
  // Remove R$ e espaços
  const clean = s.replace(/R\$\s?/g, '').trim();
  // Se tem ponto como milhar e vírgula como decimal: 1.234,56
  if (/^\d{1,3}(\.\d{3})*(,\d+)?$/.test(clean)) {
    return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
  }
  // Se tem só vírgula como decimal: 1234,56
  if (/^\d+(,\d+)?$/.test(clean)) {
    return parseFloat(clean.replace(',', '.'));
  }
  return parseFloat(clean) || 0;
}

// Encontra o nome do campo interno a partir do header do CSV
function detectColumn(header, aliases) {
  const h = header.toLowerCase().trim();
  for (const [field, names] of Object.entries(aliases)) {
    for (const name of names) {
      if (h === name.toLowerCase() || h.includes(name.toLowerCase())) {
        return field;
      }
    }
  }
  return null;
}

// Constrói mapa de colunas: { campoInterno: indexNoCSV }
export function buildColumnMap(headers) {
  const map = {};
  headers.forEach((header, idx) => {
    const field = detectColumn(header, COLUMN_ALIASES);
    if (field && !map[field]) {
      map[field] = idx;
    }
  });
  return map;
}

// Converte uma linha CSV em objeto estruturado
function parseRow(rowObj, columnMap, headers, bmContext = {}) {
  const { campanhas: CAMP = CAMPANHAS, encontrarCampanhaFn = encontrarCampanha } = bmContext;

  const get = (field) => {
    if (columnMap[field] !== undefined) {
      return rowObj[headers[columnMap[field]]] ?? rowObj[columnMap[field]] ?? null;
    }
    return null;
  };

  const getNum = (field) => parseBRNumber(get(field));
  const getPct = (field) => {
    const v = get(field);
    if (!v) return 0;
    const s = String(v).replace('%', '').trim();
    return parseBRNumber(s);
  };

  const campaignName = String(get('campaignName') || '').trim();
  const campDef = encontrarCampanhaFn(campaignName) ||
    CAMP.find(c => c.id === campaignName) || null;

  const rawLeads         = getNum('leads');
  const rawConversations = getNum('conversations');
  const rawResults       = getNum('results');
  const rawCostPerResult = getNum('costPerResult');

  // Usa "Indicador de resultados" como fonte primária — é o dado mais confiável
  // para distinguir lead de formulário de conversa WhatsApp
  const indicator         = String(get('resultIndicator') || '').toLowerCase();
  const isMessagingResult = indicator.includes('messaging') || indicator.includes('conversation_started');
  const isLeadResult      = indicator.includes('leadgen');

  let finalLeads, finalConversations, finalCostPerLead, finalCostPerConversation;

  if (isMessagingResult) {
    // Conversa WhatsApp confirmada pelo indicador
    finalLeads              = 0;
    finalConversations      = rawResults || rawConversations;
    finalCostPerLead        = 0;
    finalCostPerConversation = rawCostPerResult || getNum('costPerConversation');
  } else if (isLeadResult) {
    // Lead de formulário confirmado pelo indicador
    finalLeads              = rawResults || rawLeads;
    finalConversations      = 0;
    finalCostPerLead        = rawCostPerResult || getNum('costPerLead');
    finalCostPerConversation = 0;
  } else if (rawLeads > 0 || rawConversations > 0) {
    // Colunas explícitas de leads/conversas presentes
    finalLeads              = rawLeads;
    finalConversations      = rawConversations;
    finalCostPerLead        = getNum('costPerLead');
    finalCostPerConversation = getNum('costPerConversation');
  } else if (rawResults > 0) {
    // Fallback: usa fluxo da campanha para inferir o tipo
    const isWA              = campDef?.fluxo === 'bittrex';
    finalLeads              = isWA ? 0 : rawResults;
    finalConversations      = isWA ? rawResults : 0;
    finalCostPerLead        = isWA ? 0 : (rawCostPerResult || getNum('costPerLead'));
    finalCostPerConversation = isWA ? (rawCostPerResult || getNum('costPerConversation')) : 0;
  } else {
    finalLeads              = rawLeads;
    finalConversations      = rawConversations;
    finalCostPerLead        = getNum('costPerLead');
    finalCostPerConversation = getNum('costPerConversation');
  }

  return {
    campaignId: campDef?.id || campaignName,
    campaignName,
    adSetName: String(get('adSetName') || '').trim(),
    adName: String(get('adName') || '').trim(),
    spend: getNum('spend'),
    results: rawResults,
    leads: finalLeads,
    conversations: finalConversations,
    costPerResult: rawCostPerResult,
    costPerLead: finalCostPerLead,
    costPerConversation: finalCostPerConversation,
    frequency: getNum('frequency'),
    clicks: getNum('clicks'),
    cpc: getNum('cpc'),
    ctr: getPct('ctr'),
    reach: getNum('reach'),
    profileVisits: getNum('profileVisits'),
    followers: getNum('followers'),
  };
}

// Função principal de parse — aceita bmContext opcional para suporte multi-BM
export function parseMetaCSV(rawText, bmContext = {}) {
  const separator = detectSeparator(rawText);

  const result = Papa.parse(rawText, {
    delimiter: separator,
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim(),
  });

  if (result.errors.length > 0) {
    console.warn('Avisos ao parsear CSV:', result.errors);
  }

  const headers = result.meta.fields || [];
  const columnMap = buildColumnMap(headers);

  // Verifica colunas mínimas detectadas
  const missingCritical = ['campaignName', 'spend'].filter(f => columnMap[f] === undefined);

  const rows = result.data
    .filter(row => {
      // Filtra linhas totalizadoras (geralmente têm "Total" no nome)
      const name = String(row[headers[columnMap.campaignName]] || '').trim();
      return name && !name.toLowerCase().includes('total');
    })
    .map(row => {
      // Para o mapa de colunas com header como key
      const mapped = {};
      headers.forEach((h, i) => { mapped[h] = row[h]; });
      return parseRow(mapped, columnMap, headers, bmContext);
    })
    .filter(row => row.campaignName && row.spend >= 0);

  return { rows, columnMap, headers, missingCritical, separator };
}

// Auto-detecta o ID do vídeo a partir do nome do anúncio
// Ex: "EV1_60PctOperacoes_WA01" → "EV1" | "V2_Aluguel_FORM02" → "V2"
export function detectVideoId(adName, videos = []) {
  if (!adName || !videos.length) return null;
  const name = adName.trim();
  // Ordena do mais longo para o mais curto para EV1 bater antes de V1
  const sorted = [...videos].sort((a, b) => b.id.length - a.id.length);
  for (const v of sorted) {
    // Aceita o ID no início do nome ou após underscore, seguido de _ ou fim
    const escaped = v.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|_)${escaped}(_|$)`, 'i');
    if (regex.test(name)) return v.id;
  }
  return null;
}

// Valida se o CSV tem dados suficientes
export function validarCSV(parseResult) {
  const { rows, missingCritical } = parseResult;
  const erros = [];
  const avisos = [];

  if (missingCritical.length > 0) {
    erros.push(`Colunas obrigatórias não encontradas: ${missingCritical.join(', ')}`);
  }
  if (rows.length === 0) {
    erros.push('Nenhuma linha de dados encontrada no arquivo.');
  }
  if (rows.length > 0) {
    const semCampanha = rows.filter(r => !r.campaignName).length;
    if (semCampanha > 0) avisos.push(`${semCampanha} linha(s) sem nome de campanha serão ignoradas.`);
  }

  return { valido: erros.length === 0, erros, avisos };
}
