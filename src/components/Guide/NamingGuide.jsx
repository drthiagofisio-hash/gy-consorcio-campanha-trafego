import { useState } from 'react';
import { CAMPANHAS, FLUXOS } from '../../data/campaigns';
import { VIDEOS } from '../../data/videos';
import { useApp } from '../../context/AppContext';
import {
  Copy, CheckCheck, BookOpen, Film, Megaphone, Layers, Target,
  Pencil, Trash2, Plus, Check, X,
} from 'lucide-react';
import { TempBadge, FluxoBadge } from '../ui/Badge';

// ── Botão copiar ─────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-md transition-all ${copied ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
      title="Copiar"
    >
      {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
    </button>
  );
}

function CopyCell({ value }) {
  return (
    <div className="flex items-center gap-1 font-mono text-xs text-gray-800 bg-gray-50 rounded px-2 py-1 border border-gray-200 w-fit">
      <span>{value}</span>
      <CopyButton text={value} />
    </div>
  );
}

// ── Convenção de nome dos anúncios ───────────────────────────────
const CONVENCAO_ANUNCIO = [
  { campanha: 'RAB_WA_01', videosRecomendados: ['V4', 'V8'], exemplos: ['V4_PlanSemLance_WA01', 'V8_TraduzindoConsorcio_WA01'] },
  { campanha: 'RAB_WA_02', videosRecomendados: ['V4', 'V8'], exemplos: ['V4_PlanSemLance_WA02', 'V8_TraduzindoConsorcio_WA02'] },
  { campanha: 'RAB_WA_03', videosRecomendados: ['V1', 'V2', 'V3'], exemplos: ['V1_3Formas_WA03', 'V2_AluguelDisfarcado_WA03', 'V3_ErroFinanceiro_WA03'] },
  { campanha: 'RAB_WA_04', videosRecomendados: ['V1', 'V2'], exemplos: ['V1_3Formas_WA04', 'V2_AluguelDisfarcado_WA04'] },
  { campanha: 'RAB_WA_05', videosRecomendados: ['V5', 'V6', 'V7'], exemplos: ['V5_TelaDivididaBYD_WA05', 'V6_TelaDivididaCorolla_WA05', 'V7_TelaDivididaPicape_WA05'] },
  { campanha: 'RAB_WA_06', videosRecomendados: ['V5', 'V7', 'V9'], exemplos: ['V5_TelaDivididaBYD_WA06', 'V7_TelaDivididaPicape_WA06', 'V9_VideoHaval_WA06'] },
  { campanha: 'RAB_FORM_01', videosRecomendados: ['V4', 'V8'], exemplos: ['V4_PlanSemLance_FORM01', 'V8_TraduzindoConsorcio_FORM01'] },
  { campanha: 'RAB_FORM_02', videosRecomendados: ['V1', 'V2', 'V3'], exemplos: ['V1_3Formas_FORM02', 'V2_AluguelDisfarcado_FORM02', 'V3_ErroFinanceiro_FORM02'] },
  { campanha: 'RAB_FORM_03', videosRecomendados: ['V6', 'V7'], exemplos: ['V6_TelaDivididaCorolla_FORM03', 'V7_TelaDivididaPicape_FORM03'] },
  { campanha: 'RAB_DAVI_01', videosRecomendados: ['V5', 'V9'], exemplos: ['V5_TelaDivididaBYD_DAVI01', 'V9_VideoHaval_DAVI01'] },
  { campanha: 'RAB_DAVI_02', videosRecomendados: ['V2', 'V3'], exemplos: ['V2_AluguelDisfarcado_DAVI02', 'V3_ErroFinanceiro_DAVI02'] },
  { campanha: 'RAB_WA_07',   videosRecomendados: ['V1', 'V2', 'V3'], exemplos: ['V1_3Formas_WA07', 'V2_AluguelDisfarcado_WA07', 'V3_ErroFinanceiro_WA07'] },
  { campanha: 'RAB_WA_08',   videosRecomendados: ['V5', 'V6', 'V7'], exemplos: ['V5_TelaDivididaBYD_WA08', 'V6_TelaDivididaCorolla_WA08', 'V7_TelaDivididaPicape_WA08'] },
];

const FLUXO_COLORS = {
  bittrex: 'bg-purple-50 border-purple-200',
  grupoGT: 'bg-teal-50 border-teal-200',
  davi: 'bg-indigo-50 border-indigo-200',
};

// ── Componente: aba de segmentação editável ──────────────────────
function SegmentacaoTab() {
  const { segmentacao, updateSegmentacao } = useApp();

  // editando = { tIdx, pIdx } — qual linha está em edição, ou null
  const [editando, setEditando] = useState(null);
  const [rascunho, setRascunho] = useState(null);

  // Inicia edição de uma linha
  function iniciarEdicao(tIdx, pIdx) {
    setEditando({ tIdx, pIdx });
    setRascunho({ ...segmentacao[tIdx].publicos[pIdx] });
  }

  // Cancela edição
  function cancelar() {
    setEditando(null);
    setRascunho(null);
  }

  // Salva edição
  function salvar() {
    const { tIdx, pIdx } = editando;
    const nova = segmentacao.map((grupo, gi) => {
      if (gi !== tIdx) return grupo;
      return {
        ...grupo,
        publicos: grupo.publicos.map((p, pi) => (pi === pIdx ? { ...rascunho } : p)),
      };
    });
    updateSegmentacao(nova);
    cancelar();
  }

  // Remove uma linha (com confirmação simples)
  function remover(tIdx, pIdx) {
    if (!window.confirm('Remover este público?')) return;
    const nova = segmentacao.map((grupo, gi) => {
      if (gi !== tIdx) return grupo;
      return { ...grupo, publicos: grupo.publicos.filter((_, pi) => pi !== pIdx) };
    });
    updateSegmentacao(nova);
    if (editando?.tIdx === tIdx && editando?.pIdx === pIdx) cancelar();
  }

  // Adiciona linha em branco em um grupo
  function adicionarPublico(tIdx) {
    const nova = segmentacao.map((grupo, gi) => {
      if (gi !== tIdx) return grupo;
      return {
        ...grupo,
        publicos: [
          ...grupo.publicos,
          { publico: '', videos: [], localidade: '', campanhas: [] },
        ],
      };
    });
    updateSegmentacao(nova);
    // Abre edição automaticamente na nova linha
    const novoIdx = segmentacao[tIdx].publicos.length;
    setEditando({ tIdx, pIdx: novoIdx });
    setRascunho({ publico: '', videos: [], localidade: '', campanhas: [] });
  }

  // Toggle de vídeo no rascunho
  function toggleVideo(videoStr) {
    setRascunho(r => ({
      ...r,
      videos: r.videos.includes(videoStr)
        ? r.videos.filter(v => v !== videoStr)
        : [...r.videos, videoStr],
    }));
  }

  // Toggle de campanha no rascunho
  function toggleCampanha(campId) {
    setRascunho(r => ({
      ...r,
      campanhas: r.campanhas.includes(campId)
        ? r.campanhas.filter(c => c !== campId)
        : [...r.campanhas, campId],
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-600">
          Referência de públicos, vídeos e localidades por temperatura de audiência.
          Clique em <strong>✏️</strong> em qualquer linha para editar, ou em <strong>+</strong> para adicionar um novo público.
        </p>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-lg px-2.5 py-1 shrink-0 whitespace-nowrap">
          💾 Salvo automaticamente
        </span>
      </div>

      {segmentacao.map((grupo, tIdx) => {
        const { temperatura, emoji, label, cor, publicos } = grupo;

        return (
          <div key={temperatura} className={`rounded-xl border-2 overflow-hidden ${cor.borda}`}>
            {/* Header da temperatura */}
            <div className={`${cor.header} px-5 py-3 flex items-center gap-2`}>
              <span className="text-lg">{emoji}</span>
              <span className="text-white font-bold text-sm tracking-wide">{label}</span>
              <span className="text-white/70 text-xs ml-auto">{publicos.length} público(s)</span>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm bg-white">
                <thead className={`${cor.fundo} border-b ${cor.borda}`}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 w-2/5">Público</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 w-2/5">Vídeos</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Localidade</th>
                    <th className="px-3 py-3 text-center font-semibold text-gray-600 w-20">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {publicos.map((p, pIdx) => {
                    const estaEditando = editando?.tIdx === tIdx && editando?.pIdx === pIdx;

                    if (estaEditando && rascunho) {
                      // ── MODO EDIÇÃO ──
                      return (
                        <tr key={pIdx} className="bg-amber-50">
                          {/* Público + Campanhas (edit) */}
                          <td className="px-4 py-3 align-top">
                            <textarea
                              className="w-full text-sm border border-amber-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                              rows={3}
                              value={rascunho.publico}
                              onChange={e => setRascunho(r => ({ ...r, publico: e.target.value }))}
                              placeholder="Descrição do público..."
                            />
                            {/* Campanhas */}
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-500 mb-1">Campanhas:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {CAMPANHAS.map(camp => {
                                  const ativa = rascunho.campanhas.includes(camp.id);
                                  return (
                                    <button
                                      key={camp.id}
                                      onClick={() => toggleCampanha(camp.id)}
                                      className={`text-xs px-2 py-0.5 rounded font-mono font-semibold border transition-all ${
                                        ativa
                                          ? `${cor.badge} border-current`
                                          : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200'
                                      }`}
                                    >
                                      {camp.id}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </td>

                          {/* Vídeos (edit) */}
                          <td className="px-4 py-3 align-top">
                            <p className="text-xs font-semibold text-gray-500 mb-2">Selecione os vídeos:</p>
                            <div className="grid grid-cols-1 gap-1">
                              {VIDEOS.map(v => {
                                const videoStr = `${v.id} — ${v.nome}`;
                                const ativo = rascunho.videos.includes(videoStr);
                                return (
                                  <label
                                    key={v.id}
                                    className={`flex items-center gap-2 text-xs cursor-pointer rounded px-2 py-1 transition-colors ${
                                      ativo ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={ativo}
                                      onChange={() => toggleVideo(videoStr)}
                                      className="accent-purple-600"
                                    />
                                    <span className="font-bold w-5 text-purple-600">{v.id}</span>
                                    <span>{v.nome}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </td>

                          {/* Localidade (edit) */}
                          <td className="px-4 py-3 align-top">
                            <input
                              type="text"
                              className="w-full text-xs border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                              value={rascunho.localidade}
                              onChange={e => setRascunho(r => ({ ...r, localidade: e.target.value }))}
                              placeholder="Ex: Todo o Ceará"
                            />
                          </td>

                          {/* Ações (edit) */}
                          <td className="px-3 py-3 align-top">
                            <div className="flex flex-col gap-1.5 items-center">
                              <button
                                onClick={salvar}
                                title="Salvar"
                                className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                onClick={cancelar}
                                title="Cancelar"
                                className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    // ── MODO VISUALIZAÇÃO ──
                    return (
                      <tr key={pIdx} className={`${cor.linha} transition-colors group`}>
                        {/* Público */}
                        <td className="px-4 py-3 align-top">
                          <p className="text-gray-800 text-sm leading-snug">{p.publico || <span className="text-gray-400 italic">sem descrição</span>}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.campanhas.map(c => (
                              <span key={c} className={`text-xs px-1.5 py-0.5 rounded font-mono font-semibold ${cor.badge}`}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Vídeos */}
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-col gap-1">
                            {p.videos.length === 0 && (
                              <span className="text-xs text-gray-400 italic">nenhum vídeo</span>
                            )}
                            {p.videos.map((v, vi) => {
                              const partes = v.split(' — ');
                              const videoId = partes[0];
                              const videoNome = partes[1];
                              return (
                                <div key={vi} className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-purple-600 w-5 shrink-0">{videoId}</span>
                                  <span className="text-xs text-gray-600">{videoNome}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>

                        {/* Localidade */}
                        <td className="px-4 py-3 align-top">
                          <span className="text-xs text-gray-600 bg-gray-100 rounded-lg px-2 py-1 inline-block leading-snug">
                            📍 {p.localidade || '—'}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="px-3 py-3 align-top">
                          <div className="flex flex-col gap-1.5 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => iniciarEdicao(tIdx, pIdx)}
                              title="Editar"
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => remover(tIdx, pIdx)}
                              title="Remover"
                              className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Botão adicionar público */}
            <div className={`${cor.fundo} px-4 py-2.5 border-t ${cor.borda}`}>
              <button
                onClick={() => adicionarPublico(tIdx)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Plus size={14} />
                Adicionar público {label.toLowerCase()}
              </button>
            </div>
          </div>
        );
      })}

      {/* Resumo visual */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">Resumo rápido dos vídeos por temperatura</p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {segmentacao.map(grupo => (
            <div
              key={grupo.temperatura}
              className={`rounded-lg p-3 border ${grupo.cor.borda} ${grupo.cor.fundo}`}
            >
              <p className="font-bold mb-1" style={{ color: 'inherit' }}>
                {grupo.emoji} {grupo.label.charAt(0) + grupo.label.slice(1).toLowerCase()}
              </p>
              {Array.from(
                new Set(grupo.publicos.flatMap(p => p.videos))
              ).map(v => (
                <p key={v} className="text-gray-600">{v}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────
export function NamingGuide() {
  const [aba, setAba] = useState('campanhas');

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-blue-100 rounded-lg">
          <BookOpen size={22} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Guia de Nomes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Nomes exatos para criar as campanhas no Meta Ads Manager. Copie e cole direto no Meta.
          </p>
        </div>
      </div>

      {/* Aviso importante */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚠️ Por que os nomes precisam ser exatos?</p>
        <p>Quando você importar o CSV da Meta, o sistema identifica cada campanha pelo nome. Se o nome no Meta for diferente do nome aqui, os dados não serão vinculados corretamente e não aparecerão nos relatórios.</p>
      </div>

      {/* Abas */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {[
          { id: 'campanhas',   label: 'Campanhas',            icon: Megaphone },
          { id: 'conjuntos',   label: 'Conjuntos de Anúncios', icon: Layers },
          { id: 'anuncios',    label: 'Anúncios (Criativos)',  icon: Film },
          { id: 'segmentacao', label: 'Segmentação',           icon: Target },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              aba === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ABA: CAMPANHAS */}
      {aba === 'campanhas' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Crie <strong>3 campanhas por fluxo</strong> no Meta Ads, usando exatamente os nomes abaixo no campo <strong>"Nome da campanha"</strong>:
          </p>

          {Object.entries(FLUXOS).map(([fluxoId, fluxo]) => {
            const camps = CAMPANHAS.filter(c => c.fluxo === fluxoId);
            return (
              <div key={fluxoId} className={`rounded-xl border-2 p-4 ${FLUXO_COLORS[fluxoId]}`}>
                <div className="flex items-center gap-2 mb-3">
                  <FluxoBadge fluxo={fluxoId} />
                  <span className="text-sm font-semibold text-gray-700">{fluxo.nome}</span>
                  <span className="text-xs text-gray-400">· {fluxo.percentual}% da verba · R$ {fluxo.verbaSemanal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /semana</span>
                </div>
                <div className="space-y-2">
                  {camps.map(camp => (
                    <div key={camp.id} className="flex flex-wrap items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-2.5">
                      <span className="text-xs font-bold text-gray-400 w-24 shrink-0">{camp.id}</span>
                      <CopyCell value={camp.nome} />
                      <TempBadge temperatura={camp.temperatura} />
                      <span className="text-xs text-gray-400 hidden md:block">{camp.geo}</span>
                      <span className="text-xs text-gray-400 ml-auto">R$ {camp.verbaSemanal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/sem</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ABA: CONJUNTOS DE ANÚNCIOS */}
      {aba === 'conjuntos' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            O nome do conjunto de anúncios <strong>não precisa ser exato</strong> — ele é usado apenas para referência nos relatórios. Sugestões abaixo:
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
            ✅ Você tem liberdade para nomear os conjuntos como quiser. Recomendamos seguir o padrão abaixo para facilitar a leitura nos relatórios.
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm bg-white">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Campanha</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Nome sugerido para o Conjunto</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Segmentação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CAMPANHAS.map(camp => (
                  <tr key={camp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-semibold text-gray-700">{camp.nome}</span>
                    </td>
                    <td className="px-4 py-3">
                      <CopyCell value={`${camp.id}_Conjunto`} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs">{camp.segmentacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA: ANÚNCIOS (CRIATIVOS) */}
      {aba === 'anuncios' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              O nome do anúncio <strong>precisa seguir o padrão exato</strong> abaixo para que o sistema consiga vincular cada anúncio ao seu vídeo (V1–V9) e medir a performance por criativo.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
              <p className="font-semibold mb-1">📐 Padrão de nomenclatura dos anúncios:</p>
              <p className="font-mono text-blue-700 bg-blue-100 rounded px-2 py-1 inline-block">V[número]_[NomeResumido]_[CódCampanha]</p>
              <p className="mt-1.5">Exemplo: <span className="font-mono font-semibold">V4_PlanSemLance_WA01</span> → Vídeo V4 rodando na campanha RAB_WA_01</p>
            </div>
          </div>

          {/* Referência dos vídeos */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Referência rápida dos vídeos (V1–V9)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {VIDEOS.map(v => (
                <div key={v.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <span className="text-xs font-bold text-purple-700 w-6">{v.id}</span>
                  <span className="text-xs font-semibold text-gray-800 flex-1">{v.nome}</span>
                  <TempBadge temperatura={v.temperatura} />
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de nomes por campanha */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Nomes exatos dos anúncios por campanha</h3>
            <p className="text-xs text-gray-500">Cada linha = um anúncio que você vai criar no Meta. Use o nome exato no campo "Nome do anúncio".</p>
            {CONVENCAO_ANUNCIO.map(({ campanha, videosRecomendados, exemplos }) => {
              const campDef = CAMPANHAS.find(c => c.id === campanha);
              if (!campDef) return null;
              return (
                <div key={campanha} className={`rounded-xl border-2 p-4 ${FLUXO_COLORS[campDef.fluxo]}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-gray-500">{campanha}</span>
                    <span className="text-sm font-semibold text-gray-800">{campDef.nome}</span>
                    <FluxoBadge fluxo={campDef.fluxo} />
                    <TempBadge temperatura={campDef.temperatura} />
                    <span className="text-xs text-gray-400 ml-auto">
                      Vídeos: {videosRecomendados.join(', ')}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {exemplos.map((nome, i) => {
                      const videoId = videosRecomendados[i];
                      const video = VIDEOS.find(v => v.id === videoId);
                      return (
                        <div key={nome} className="flex flex-wrap items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                          <span className="text-xs font-bold text-purple-600 w-6">{videoId}</span>
                          <CopyCell value={nome} />
                          <span className="text-xs text-gray-400 hidden sm:block">{video?.nome}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aviso final */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-700 mb-1">💡 Após criar os anúncios no Meta:</p>
            <p>Acesse <strong>Configurações → Mapeamento Anúncio × Vídeo</strong> e confirme que todos os nomes estão cadastrados. O sistema já vem com os nomes desta lista pré-mapeados — se usar exatamente estes nomes, não precisa fazer nada extra!</p>
          </div>
        </div>
      )}

      {/* ABA: SEGMENTAÇÃO */}
      {aba === 'segmentacao' && <SegmentacaoTab />}
    </div>
  );
}
