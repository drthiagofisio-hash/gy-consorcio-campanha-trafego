import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { agregarPorAnuncio, calcularStatus, calcularResumo, filtrarRows, fmtBRL, fmtPct, fmtNum } from '../../utils/calculations';
import { SortableTable } from '../ui/SortableTable';
import { TempBadge, FluxoBadge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { Download, Film, EyeOff, Eye, RotateCcw } from 'lucide-react';

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
    anunciosOcultos, ocultarAnuncios, restaurarAnuncios,
  } = useApp();

  const [selected, setSelected] = useState(new Set());
  const [mostrarOcultos, setMostrarOcultos] = useState(false);

  const rows = useMemo(() => weeklyData[activeWeek] || [], [weeklyData, activeWeek]);

  const rowsVisiveis = useMemo(() => {
    if (mostrarOcultos) return rows;
    const ocultos = new Set(anunciosOcultos);
    return rows.filter(r => !ocultos.has(r.adName));
  }, [rows, anunciosOcultos, mostrarOcultos]);

  const filteredRows = useMemo(
    () => filtrarRows(rowsVisiveis, activeFluxo, activeTemp, bmContext),
    [rowsVisiveis, activeFluxo, activeTemp, bmContext]
  );
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
      oculto: anunciosOcultos.includes(ad.adName),
      status: calcularStatus(ad.cpl, mediaCpl, ad.frequency, ad.ctr, ad.totalResult, mediaResult),
      rankEmCampanha: rankedAds[`${ad.campaignName}__${ad.adName}`] || '-',
    }));
  }, [filteredRows, config.adVideoMap, bmContext, resumo, anunciosOcultos]);

  const toggleSelect = (adName) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(adName) ? next.delete(adName) : next.add(adName);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === anuncioData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(anuncioData.map(a => a.adName)));
    }
  };

  const handleOcultar = () => {
    ocultarAnuncios([...selected]);
    setSelected(new Set());
  };

  const handleRestaurarTodos = () => {
    restaurarAnuncios(anunciosOcultos);
    setMostrarOcultos(false);
  };

  const rankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const columns = [
    {
      key: '__check__',
      label: (
        <input
          type="checkbox"
          className="accent-blue-600 cursor-pointer"
          checked={selected.size > 0 && selected.size === anuncioData.length}
          ref={el => { if (el) el.indeterminate = selected.size > 0 && selected.size < anuncioData.length; }}
          onChange={toggleSelectAll}
          title="Selecionar todos"
        />
      ),
      sortable: false,
      className: 'w-8',
      render: (_, row) => (
        <input
          type="checkbox"
          className="accent-blue-600 cursor-pointer"
          checked={selected.has(row.adName)}
          onChange={() => toggleSelect(row.adName)}
        />
      ),
    },
    { key: 'rankEmCampanha', label: 'Rank', render: v => <span className="text-lg">{rankIcon(v)}</span> },
    {
      key: 'adName', label: 'Nome do Anúncio',
      render: (v, row) => (
        <span className={`font-medium text-xs max-w-[180px] block truncate ${row.oculto ? 'text-gray-400 line-through' : 'text-gray-800'}`} title={v}>
          {v}
        </span>
      ),
    },
    { key: 'campaignName', label: 'Campanha', render: v => <span className="text-xs text-gray-500 max-w-[140px] block truncate" title={v}>{v}</span> },
    {
      key: 'videoId', label: 'Vídeo',
      render: (v, row) => v ? (
        <div className="flex items-center gap-1.5">
          <Film size={12} className="text-purple-500" />
          <span className="text-xs font-semibold text-purple-700">{v}</span>
          {row.video && <span className="text-xs text-gray-400 hidden xl:block truncate max-w-[100px]" title={row.video.nome}>{row.video.nome}</span>}
        </div>
      ) : <span className="text-xs text-gray-300">Não mapeado</span>,
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
    {
      key: '__acao__', label: '', sortable: false,
      render: (_, row) => row.oculto ? (
        <button
          onClick={() => restaurarAnuncios([row.adName])}
          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
          title="Restaurar anúncio"
        >
          <RotateCcw size={12} /> Restaurar
        </button>
      ) : null,
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatório por Anúncio</h1>
          <p className="text-sm text-gray-500">
            {anuncioData.length} anúncio(s) · Semana {activeWeek}
            {anunciosOcultos.length > 0 && (
              <button
                onClick={() => setMostrarOcultos(v => !v)}
                className="ml-2 text-xs text-blue-500 hover:underline"
              >
                {mostrarOcultos ? '← Esconder ocultos' : `+ ${anunciosOcultos.length} oculto(s) — Gerenciar`}
              </button>
            )}
          </p>
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

      {/* Barra de ação — selecionados */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span className="text-sm font-semibold text-amber-800">{selected.size} anúncio(s) selecionado(s)</span>
          <button onClick={handleOcultar} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold">
            <EyeOff size={14} /> Ocultar dos relatórios
          </button>
          <button onClick={() => setSelected(new Set())} className="text-sm px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
            Cancelar
          </button>
        </div>
      )}

      {/* Barra de gestão de ocultos */}
      {mostrarOcultos && anunciosOcultos.length > 0 && selected.size === 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <Eye size={16} className="text-blue-500 shrink-0" />
          <span className="text-sm text-blue-800">
            Mostrando <strong>{anunciosOcultos.length}</strong> anúncio(s) oculto(s). Clique em <strong>Restaurar</strong> na linha ou:
          </span>
          <button onClick={handleRestaurarTodos} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold ml-auto shrink-0">
            <RotateCcw size={13} /> Restaurar todos
          </button>
        </div>
      )}

      <SortableTable columns={columns} data={anuncioData} emptyMessage="Sem dados para a semana selecionada." />
    </div>
  );
}
