import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { agregarPorCampanha, calcularStatus, calcularResumo, filtrarRows, fmtBRL, fmtPct, fmtNum } from '../../utils/calculations';
import { SortableTable } from '../ui/SortableTable';
import { TempBadge, FluxoBadge, StatusBadge } from '../ui/Badge';
import { Tooltip } from '../ui/Tooltip';
import { Download } from 'lucide-react';
import { FLUXOS } from '../../data/campaigns';

function exportCSV(data) {
  const headers = ['Campanha','Fluxo','Temp.','Geo','Verba Planejada','Investido','%Verba','Leads','Conversas','CPL','CPC','CTR','Frequência','Alcance','Taxa Lead','Taxa Mensagem','Status'];
  const rows = data.map(c => [
    c.campaignName, c.fluxo, c.temperatura, c.geo,
    c.verbaSemanal, c.spend?.toFixed(2), c.pctVerba?.toFixed(1),
    c.leads, c.conversations,
    (c.costPerLead || c.costPerConversation || 0).toFixed(2),
    '', c.ctr?.toFixed(2), c.frequency?.toFixed(2),
    c.reach, c.taxaLead?.toFixed(3), c.taxaMensagem?.toFixed(3),
    c.status?.label,
  ]);
  const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'relatorio_campanhas.csv'; a.click();
  URL.revokeObjectURL(url);
}

export function CampaignReport() {
  const { weeklyData, activeWeek, setActiveWeek, activeFluxo, setActiveFluxo, activeTemp, setActiveTemp, config } = useApp();

  const rows = useMemo(() => weeklyData[activeWeek] || [], [weeklyData, activeWeek]);
  const filteredRows = useMemo(() => filtrarRows(rows, activeFluxo, activeTemp), [rows, activeFluxo, activeTemp]);
  const resumo = useMemo(() => calcularResumo(filteredRows), [filteredRows]);

  const campanhaData = useMemo(() => {
    const aggr = agregarPorCampanha(filteredRows, config.adVideoMap);
    const mediaCpl = resumo?.cplMedio || 0;
    const mediaLeads = aggr.length > 0 ? aggr.reduce((s, c) => s + (c.leads + c.conversations), 0) / aggr.length : 0;
    return aggr.map(c => {
      const cplEfetivo = c.costPerLead || c.costPerConversation;
      return { ...c, status: calcularStatus(cplEfetivo, mediaCpl, c.frequency, c.ctr, c.leads + c.conversations, mediaLeads) };
    });
  }, [filteredRows, config.adVideoMap, resumo]);

  const columns = [
    {
      key: 'campaignName', label: 'Campanha',
      render: v => <span className="font-medium text-gray-800 text-xs">{v}</span>
    },
    { key: 'fluxo', label: 'Fluxo', sortable: false, render: v => <FluxoBadge fluxo={v} /> },
    { key: 'temperatura', label: 'Temp.', sortable: false, render: v => <TempBadge temperatura={v} /> },
    {
      key: 'geo', label: 'Geo',
      render: v => <span className="text-xs text-gray-500">{v}</span>
    },
    {
      key: 'verbaSemanal', label: 'Planejado',
      render: v => <span className="font-mono text-xs text-gray-600">{fmtBRL(v)}</span>
    },
    {
      key: 'spend', label: 'Investido',
      render: v => <span className="font-mono text-xs font-semibold">{fmtBRL(v)}</span>
    },
    {
      key: 'pctVerba', label: <Tooltip text="Valor investido ÷ Verba planejada × 100">% Verba</Tooltip>,
      render: v => (
        <span className={`font-mono text-xs font-semibold ${v > 100 ? 'text-red-600' : v > 90 ? 'text-orange-500' : 'text-green-600'}`}>
          {fmtPct(v, 0)}
        </span>
      )
    },
    { key: 'leads', label: 'Leads', render: v => <span className="font-mono text-xs">{fmtNum(v)}</span> },
    {
      key: 'conversations', label: 'Conv. WA',
      render: v => <span className="font-mono text-xs">{fmtNum(v)}</span>
    },
    {
      key: 'costPerLead', label: 'CPL',
      render: (v, row) => <span className="font-mono text-xs font-semibold">{fmtBRL(v || row.costPerConversation)}</span>
    },
    {
      key: 'frequency', label: 'Freq.',
      render: v => <span className={`font-mono text-xs ${v > 3.5 ? 'text-red-600 font-bold' : v > 2.5 ? 'text-orange-500' : ''}`}>{fmtNum(v, 1)}</span>
    },
    {
      key: 'ctr', label: <Tooltip text="Cliques ÷ Alcance × 100">CTR</Tooltip>,
      render: v => (
        <span className={`font-mono text-xs ${v < 1 ? 'text-red-500' : v > 2 ? 'text-green-600' : ''}`}>
          {fmtPct(v, 1)}
        </span>
      )
    },
    {
      key: 'taxaLead', label: <Tooltip text="Leads ÷ Alcance × 100">Taxa Lead</Tooltip>,
      render: v => <span className="font-mono text-xs">{fmtPct(v, 2)}</span>
    },
    {
      key: 'taxaMensagem', label: <Tooltip text="Conversas ÷ Alcance × 100">Taxa Msg</Tooltip>,
      render: v => <span className="font-mono text-xs">{fmtPct(v, 2)}</span>
    },
    {
      key: 'reach', label: 'Alcance',
      render: v => <span className="font-mono text-xs">{fmtNum(v)}</span>
    },
    {
      key: 'status', label: 'Status', sortable: false,
      render: v => <StatusBadge status={v} />
    },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Relatório por Campanha</h1>
          <p className="text-sm text-gray-500">{campanhaData.length} campanha(s) · Semana {activeWeek}</p>
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
            {Object.entries(FLUXOS).map(([id, f]) => <option key={id} value={id}>{f.nome}</option>)}
          </select>
          <select value={activeTemp} onChange={e => setActiveTemp(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
            <option value="todos">Todas as temperaturas</option>
            <option value="quente">🔴 Quente</option>
            <option value="morno">🟠 Morno</option>
            <option value="frio">🔵 Frio</option>
          </select>
          <button onClick={() => exportCSV(campanhaData)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download size={14} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Legenda de status */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: '🟢 Escalar', desc: 'CPL < 70% da média + leads acima da média' },
          { label: '🔵 Manter', desc: 'CPL dentro de ±30% da média' },
          { label: '🟡 Observar', desc: 'CPL entre 30% e 100% acima da média' },
          { label: '🔴 Pausar', desc: 'CPL > 2× a média ou freq. > 3,5 sem resultado' },
          { label: '🟠 Trocar criativo', desc: 'CTR < 1% com freq. > 2' },
        ].map(s => (
          <span key={s.label} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600" title={s.desc}>
            {s.label}
          </span>
        ))}
      </div>

      <SortableTable
        columns={columns}
        data={campanhaData}
        emptyMessage="Sem dados para os filtros selecionados. Importe um relatório CSV da Meta."
      />
    </div>
  );
}
