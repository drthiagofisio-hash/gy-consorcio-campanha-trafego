import { useMemo, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { agregarPorVideo, fmtBRL, fmtPct, fmtNum } from '../../utils/calculations';
import { parseMetaCSV, detectVideoId } from '../../utils/csvParser';
import { TempBadge } from '../ui/Badge';
import { Film, Trophy, Target, TrendingUp, Upload, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

// ── Monta adVideoMap dinamicamente a partir das linhas de anúncios ──
function buildAdVideoMap(adsRows, videos) {
  const map = {};
  adsRows.forEach(row => {
    if (!row.adName) return;
    const videoId = detectVideoId(row.adName, videos);
    if (videoId) map[row.adName] = videoId;
  });
  return map;
}

// ── Card de cada vídeo ──────────────────────────────────────────
function VideoCard({ vData, campanhas }) {
  const hasData = vData && vData.totalResult > 0;

  const tempColor = {
    quente:      'border-red-200 bg-red-50',
    morno:       'border-orange-200 bg-orange-50',
    frio:        'border-blue-200 bg-blue-50',
    remarketing: 'border-violet-200 bg-violet-50',
  };

  const rank = vData._rank;
  const medalha = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <div className={`rounded-xl border-2 p-4 ${tempColor[vData?.temperatura] || tempColor.frio} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <Film size={18} className="text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-purple-700">{vData?.videoId}</span>
              {medalha && <span className="text-base">{medalha}</span>}
              {vData?.emBreve && (
                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">Em breve</span>
              )}
            </div>
            <TempBadge temperatura={vData?.temperatura} />
          </div>
        </div>
        {hasData && (
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{fmtBRL(vData.cpl)}</p>
            <p className="text-xs text-gray-400">CPL</p>
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-800 mb-1">{vData?.nome}</h3>
      <p className="text-xs text-gray-500 mb-3 italic">"{vData?.objecao}"</p>

      {hasData ? (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white rounded-lg p-2 text-center shadow-sm">
            <p className="text-sm font-bold text-gray-800">{fmtNum(vData.totalResult)}</p>
            <p className="text-xs text-gray-400">Resultados</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center shadow-sm">
            <p className="text-sm font-bold text-gray-800">{fmtBRL(vData.spend)}</p>
            <p className="text-xs text-gray-400">Investido</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center shadow-sm">
            <p className="text-sm font-bold text-gray-800">{fmtPct(vData.taxaLead, 2)}</p>
            <p className="text-xs text-gray-400">Taxa Lead</p>
          </div>
        </div>
      ) : (
        <div className="bg-white/60 rounded-lg p-3 text-center mb-3">
          <p className="text-xs text-gray-400">
            {vData?.emBreve ? 'Aguardando gravação' : 'Sem dados na semana selecionada'}
          </p>
        </div>
      )}

      <div>
        <p className="text-xs text-gray-500 font-medium mb-1.5">Campanhas vinculadas:</p>
        <div className="flex flex-wrap gap-1">
          {(vData?.campanhas || []).map(cId => {
            const camp = campanhas.find(c => c.id === cId);
            return (
              <span key={cId} className="text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-600">
                {camp?.nome?.replace(/^(RAB_|EXC_)/, '') || cId}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Painel de import de CSV de anúncios ────────────────────────
function AdsImportPanel({ activeWeek, adsImports, onImport, videos, bmContext }) {
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [erro, setErro] = useState(null);
  const [deteccao, setDeteccao] = useState(null);

  const impAtual = adsImports.find(i => i.week === activeWeek);

  const processFile = useCallback(async (file) => {
    if (!file?.name.endsWith('.csv')) {
      setErro('O arquivo deve ser um CSV (.csv)');
      return;
    }
    setImporting(true);
    setErro(null);
    setDeteccao(null);
    try {
      const text = await file.text();
      const result = parseMetaCSV(text, bmContext);
      const rows = result.rows.filter(r => r.adName);

      if (rows.length === 0) {
        setErro('Nenhum anúncio encontrado. Verifique se o CSV foi exportado no nível de Anúncio (não de Campanha).');
        return;
      }

      const adMap = buildAdVideoMap(rows, videos);
      const mapeados = Object.keys(adMap).length;
      setDeteccao({ total: rows.length, mapeados, filename: file.name });
      onImport(rows, file.name);
    } catch (e) {
      setErro(`Erro ao processar: ${e.message}`);
    } finally {
      setImporting(false);
    }
  }, [bmContext, videos, onImport]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film size={15} className="text-purple-600" />
          <span className="text-sm font-semibold text-gray-700">CSV de Anúncios — Semana {activeWeek}</span>
          <span className="text-xs text-gray-400">(nível de anúncio, não de campanha)</span>
        </div>
        {impAtual && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
            <CheckCircle size={10} /> Importado · {impAtual.rowCount} anúncios
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Estado de sucesso após import */}
        {deteccao && (
          <div className="mb-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <CheckCircle size={14} className="text-green-600" />
            <span className="text-xs text-green-700 font-medium">
              {deteccao.total} anúncios importados · {deteccao.mapeados} vídeos detectados automaticamente
            </span>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <AlertCircle size={14} className="text-red-500" />
            <span className="text-xs text-red-600">{erro}</span>
          </div>
        )}

        {/* Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
            dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
          } ${importing ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`ads-csv-s${activeWeek}`).click()}
        >
          <input
            id={`ads-csv-s${activeWeek}`}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => processFile(e.target.files[0])}
          />
          {importing ? (
            <RefreshCw size={20} className="mx-auto text-purple-400 animate-spin mb-2" />
          ) : (
            <Upload size={20} className="mx-auto text-gray-300 mb-2" />
          )}
          <p className="text-xs font-medium text-gray-600">
            {importing ? 'Processando...' : impAtual ? 'Reimportar CSV de anúncios' : 'Arraste ou clique para importar CSV de anúncios'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            No Meta: Gerenciador de Anúncios → selecione nível <strong>Anúncio</strong> → Exportar CSV
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────────
export function CreativesMap() {
  const {
    weeklyData, weeklyAdsData, activeWeek, setActiveWeek,
    config, videos, campanhas, bmContext,
    adsImports, importWeekAdsData,
  } = useApp();

  const rows    = useMemo(() => weeklyData[activeWeek]    || [], [weeklyData, activeWeek]);
  const adsRows = useMemo(() => weeklyAdsData[activeWeek] || [], [weeklyAdsData, activeWeek]);

  const handleImport = useCallback((rows, filename) => {
    importWeekAdsData(activeWeek, rows, filename);
  }, [importWeekAdsData, activeWeek]);

  // Usa dados de anúncios se disponíveis; senão, usa dados de campanha + adVideoMap das config
  const videoData = useMemo(() => {
    let aggr;
    if (adsRows.length > 0) {
      // Modo ad-level: auto-detecta vídeo pelo nome do anúncio
      const adMap = buildAdVideoMap(adsRows, videos);
      aggr = agregarPorVideo(adsRows, adMap, bmContext);
    } else {
      // Modo fallback: usa mapeamento manual das Configurações
      aggr = agregarPorVideo(rows, config.adVideoMap, bmContext);
    }
    const map = Object.fromEntries(aggr.map(v => [v.videoId, v]));
    return videos.map(v => map[v.id] || {
      ...v,
      videoId: v.id,
      totalResult: 0,
      spend: 0,
      cpl: null,
      taxaLead: 0,
      leads: 0,
      conversations: 0,
      campanhas: v.campanhas,
    });
  }, [rows, adsRows, config.adVideoMap, bmContext, videos]);

  const rankedByCPL = [...videoData]
    .filter(v => v.cpl !== null)
    .sort((a, b) => (a.cpl || 999) - (b.cpl || 999));

  const videoDataComRank = videoData.map(v => {
    const idx = rankedByCPL.findIndex(r => r.videoId === v.videoId);
    return { ...v, _rank: idx >= 0 ? idx + 1 : null };
  });

  const totalInvestido  = videoData.reduce((s, v) => s + (v.spend || 0), 0);
  const totalResultados = videoData.reduce((s, v) => s + (v.totalResult || 0), 0);
  const melhorVideo     = rankedByCPL[0];
  const usandoAdsData   = adsRows.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mapa de Criativos</h1>
          <p className="text-sm text-gray-500">Performance consolidada por vídeo · Semana {activeWeek}</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
          <span className="text-gray-500 font-medium">Semana:</span>
          {[1, 2, 3, 4].map(w => (
            <button key={w} onClick={() => setActiveWeek(w)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${activeWeek === w ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
              S{w}
            </button>
          ))}
        </div>
      </div>

      {/* Painel de import de CSV de anúncios */}
      <AdsImportPanel
        activeWeek={activeWeek}
        adsImports={adsImports}
        onImport={handleImport}
        videos={videos}
        bmContext={bmContext}
      />

      {/* Indicador de fonte dos dados */}
      {usandoAdsData ? (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle size={13} />
          Usando dados de <strong>anúncios importados</strong> — vídeos detectados automaticamente pelo nome do anúncio
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertCircle size={13} />
          Sem CSV de anúncios importado para esta semana — importe acima para ver a performance por criativo
        </div>
      )}

      {/* Cards de resumo */}
      {melhorVideo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <Trophy size={24} className="text-yellow-500" />
            <div>
              <p className="text-xs text-yellow-700 font-medium">Melhor CPL</p>
              <p className="text-lg font-bold text-gray-900">{melhorVideo.videoId} — {fmtBRL(melhorVideo.cpl)}</p>
              <p className="text-xs text-gray-500">{melhorVideo.nome}</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <Target size={24} className="text-blue-500" />
            <div>
              <p className="text-xs text-blue-700 font-medium">Total de Resultados</p>
              <p className="text-lg font-bold text-gray-900">{fmtNum(totalResultados)}</p>
              <p className="text-xs text-gray-500">leads + conversas</p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <TrendingUp size={24} className="text-green-500" />
            <div>
              <p className="text-xs text-green-700 font-medium">Total Investido em Criativos</p>
              <p className="text-lg font-bold text-gray-900">{fmtBRL(totalInvestido)}</p>
              <p className="text-xs text-gray-500">todos os vídeos</p>
            </div>
          </div>
        </div>
      )}

      {/* Ranking */}
      {rankedByCPL.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Ranking por CPL</h3>
          <div className="space-y-2">
            {rankedByCPL.map((v, i) => (
              <div key={v.videoId} className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-base w-8 text-center">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <span className="text-sm font-semibold text-purple-700 w-12">{v.videoId}</span>
                <span className="text-sm text-gray-700 flex-1">{v.nome}</span>
                <TempBadge temperatura={v.temperatura} />
                <span className="font-mono text-sm font-bold text-gray-800 w-20 text-right">{fmtBRL(v.cpl)}</span>
                <span className="font-mono text-xs text-gray-400 w-16 text-right">{fmtNum(v.totalResult)} res.</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {videoDataComRank.map(v => (
          <VideoCard key={v.videoId} vData={v} campanhas={campanhas} />
        ))}
      </div>
    </div>
  );
}
