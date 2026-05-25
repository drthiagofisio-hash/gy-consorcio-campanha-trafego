import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { agregarPorVideo, fmtBRL, fmtPct, fmtNum } from '../../utils/calculations';
import { TempBadge } from '../ui/Badge';
import { Film, Trophy, Target, TrendingUp } from 'lucide-react';

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

      {/* Campanhas vinculadas */}
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

export function CreativesMap() {
  const { weeklyData, activeWeek, setActiveWeek, config, videos, campanhas, bmContext } = useApp();

  const rows = useMemo(() => weeklyData[activeWeek] || [], [weeklyData, activeWeek]);

  const videoData = useMemo(() => {
    const aggr = agregarPorVideo(rows, config.adVideoMap, bmContext);
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
  }, [rows, config.adVideoMap, bmContext, videos]);

  const rankedByRPL = [...videoData]
    .filter(v => v.cpl !== null)
    .sort((a, b) => (a.cpl || 999) - (b.cpl || 999));

  // Adiciona rank a cada vídeo
  const videoDataComRank = videoData.map(v => {
    const idx = rankedByRPL.findIndex(r => r.videoId === v.videoId);
    return { ...v, _rank: idx >= 0 ? idx + 1 : null };
  });

  const totalInvestido = videoData.reduce((s, v) => s + (v.spend || 0), 0);
  const totalResultados = videoData.reduce((s, v) => s + (v.totalResult || 0), 0);
  const melhorVideo = rankedByRPL[0];

  return (
    <div className="p-6 space-y-6">
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

      {/* Ranking de vídeos */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Ranking por CPL</h3>
        <div className="space-y-2">
          {rankedByRPL.map((v, i) => (
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

      {/* Grid de cards de vídeos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {videoDataComRank.map(v => (
          <VideoCard key={v.videoId} vData={v} campanhas={campanhas} />
        ))}
      </div>
    </div>
  );
}
