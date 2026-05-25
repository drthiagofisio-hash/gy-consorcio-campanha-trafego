import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { agregarPorAnuncio, calcularStatus, calcularResumo, filtrarRows, fmtBRL, fmtPct, fmtNum } from '../../utils/calculations';
import { SortableTable } from '../ui/SortableTable';
import { TempBadge, FluxoBadge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { Download, Film } from 'lucide-react';

function exportCSV(data) {
  const headers = ['Anúncio','Campanha','Vídeo','Fluxo','Temp.','Investido','Resultados','Leads','Conv.WA','CPL','CTR','Freq.','Alcance','Taxa Lead'];
  const rows = data.map(r => [
    r.adName, r.campaignName, r.videoId || '-', r.fluxo, r.temperatura,
    r.spend?.toFixed(2), r.totalResult, r.leads, r.conversations,
    (r.cpl || 0).toFixed(2), r.ctr?.toFixed(2), r.frequency?.toFixed(2),
    r.reach, r.taxaLead?.toFixed(3),
  ]);
  const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'relatorio_anuncios.csv'; a.click();
  URL.revokeObjectURL(url);
}

export function AdsReport() {
  const {
    weeklyData, activeWeek, setActiveWeek,
    activeFluxo, setActiveFluxo,
    activeTemp, setActiveTemp,
    config, fluxos, bmContext,
  } = useApp();

  const rows = useMemo(() => weeklyData[activeWeek] || [], [weeklyData, activeWeek]);
  const filteredRows = useMemo(() => filtrarRows(rows, activeFluxo, activeTemp, bmContext), [rows, activeFluxo, activeTemp, bmContext]);
  const resumo = useMemo(() => calcularResumo(filteredRows, bmContext), [filteredRows, bmContext]);

  const anuncioData = useMemo(() => {
    const ads = agregarPorAnuncio(filteredRows, config.adVideoMap, bmContext);
    const mediaCpl = resumo?.cplMedio || 0;
    const mediaResult = ads.length > 0 ? ads.reduce((s, a) => s + (a.totalResult || 0), 0) / ads.length : 0;

    const campanhaGroups = {};
    ads.forEach(ad => {
      if (!campanhaGroups[ad.campaignName]) campanhaGroups[ad.campaignName] = [];
      campanhaGroups[ad.campaignName].push(ad);
    });
    const rankedAds = {};
    Object.values(campanhaGroups).forEach(group => {
      const sorted = [...group].sort((a, b) => (a.cpl || 999) - (b.cpl || 999));
      sorted.forEach((ad, i) => { rankedAds[`${ad.campaignName}__${ad.adName}`] = i + 1; });
    });

    return ads.map(ad => ({
      ...ad,
      status: calcularStatus(ad.cpl, mediaCpl, ad.frequency, ad.ctr, ad.totalResult, mediaResult),
      rankEmCampanha: rankedAds[`${ad.campaignName}__${ad.adName}`] || '-',
    }));
  }, [filteredRows, config.adVideoMap, bmContext, resumo]);

  const rankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const columns = [
    { key: 'rankEmCampanha', label: 'Rank', render: v => <span className="text-lg">{rankIcon(v)}</span> },
    { key: 'adName', label: 'Nome do Anúncio', render: v => <span className="font-medium text-gray-800 text-xs max-w-[180px] block truncate" title={v}>{v}</span> },
    { key: 'campaignName', label: 'Campanha', render: v => <span className="text-xs text-gray-500 max-w-[140px] block truncate" title={v}>{v}</span> },
    {
      key: 'videoId', label: 'Vídeo',
      render: (v, row) => v ? (
        <div className="flex items-center gap-1.5">
          <Film size={12} className="text-purple-500" />
          <span className="text-xs font-semibold text-purple-700">{v}</span>
          {row.video && <span className="text-xs text-gray-400 hidden xl:block truncate max-w-[100px]" title={row.video.nome}>{row.video.nome}</span>}
        </div>
      ) : <span className="text-xs text-gray-300">Não mapeado</span>
    },
    { key: 'fluxo', label: 'Fluxo', sortable: false, render: v => <FluxoBadge fluxo={v} /> },
    { key: 'temperatura', label: 'Temp.', sortable: false, render: v => <TempBadge temperatura={v} /> },
    { key: 'spend', label: 'Investido', render: v => <span className="font-mono text-xs">{fmtBRL(v)}</span> },
    { key: 'totalResult', label: 'Result.', render: v => <span className="font-mono text-xs font-semibold">{fmtNum(v)}</span> },
    { key: 'leads', label: 'Leads', render: v => <span className="font-mono text-xs">{fmtNum(v)}</span> },
    { key: 'conversations', label: 'Conv.', render: v => <span className="font-mono text-xs">{fmtNum(v)}</span> },
    { key: 'cpl', label: 'CPL', render: v => <span className={`font-mono text-xs font-semibold ${v < 10 ? 'text-green-600' : v > 30 ? 'text-red-600' : ''}`}>{fmtBRL(v)}</span> },
    { key: 'ctr', label: <Tooltip text="Taxa de clique: Cliques ÷ Alcance × 100">CTR</Tooltip>, render: v => <span className={`font-mono text-xs ${v < 1 ? 'text-red-500' : ''}`}>{fmtPct(v, 1)}</span> },
    { key: 'frequency', label: 'Freq.', render: v => <span className={`font-mono text-xs ${v > 3.5 ? 'text-red-600 font-bold' : ''}`}>{fmtNum(v, 1)}</span> },
    { key: 'reach', label: 'Alcance', render: v => <span className="font-mono text-xs">{fmtNum(v)}</span> },
    { key: 'taxaLead', label: <Tooltip text="Leads ÷ Alcance × 100">Taxa Lead</Tooltip>, render: v => <span className="font-mono text-xs">{fmtPct(v, 2)}</span> },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatório por Anúncio</h1>
          <p className="text-sm text-gray-500">{anuncioData.length} anúncio(s) · Semana {activeWeek}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-gray-500 font-medium">Semana:</span>
            {[1, 2, 3, 4].map(w => (
              <button key={w} onClick={() => setActiveWeek(w)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${activeWeek === w ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                S{w}
              </button>
            ))}
          </div>
          <select value={activeFluxo} onChange={e => setActiveFluxo(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
            <option value="todos">Todos os fluxos</option>
            {Object.entries(fluxos).map(([id, f]) => <option key={id} value={id}>{f.nome}</option>)}
          </select>
          <select value={activeTemp} onChange={e => setActiveTemp(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
            <option value="todos">Todas as temperaturas</option>
            <option value="quente">🔴 Quente</option>
            <option value="morno">🟠 Morno</option>
            <option value="frio">🔵 Frio</option>
            <option value="remarketing">🔁 Remarketing</option>
          </select>
          <button onClick={() => exportCSV(anuncioData)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download size={14} /> Exportar CSV
          </button>
        </div>
      </div>
      <SortableTable columns={columns} data={anuncioData} emptyMessage="Sem dados para a semana selecionada." />
    </div>
  );
}
