import { useState } from 'react';
import { CAMPANHAS, FLUXOS } from '../../data/campaigns';
import { VIDEOS } from '../../data/videos';
import { Copy, CheckCheck, BookOpen, Film, Megaphone, Layers, Target } from 'lucide-react';
import { TempBadge, FluxoBadge } from '../ui/Badge';

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

// Convenção de nome dos anúncios: V[id]_[NomeResumido]_[CampanhaID]
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
];

const FLUXO_COLORS = {
  bittrex: 'bg-purple-50 border-purple-200',
  grupoGT: 'bg-teal-50 border-teal-200',
  davi: 'bg-indigo-50 border-indigo-200',
};

// ── Dados de segmentação por temperatura ──────────────────────
const SEGMENTACAO = [
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
    ],
  },
];

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
      {aba === 'segmentacao' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Referência completa de públicos, vídeos e localidades por temperatura de audiência.
            Use como guia na hora de configurar cada conjunto de anúncios no Meta Ads.
          </p>

          {SEGMENTACAO.map(({ temperatura, emoji, label, cor, publicos }) => (
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
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 w-1/5">Localidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {publicos.map((p, i) => (
                      <tr key={i} className={`${cor.linha} transition-colors`}>
                        {/* Público */}
                        <td className="px-4 py-3 align-top">
                          <p className="text-gray-800 text-sm leading-snug">{p.publico}</p>
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
                            {p.videos.map((v, vi) => {
                              const videoId = v.split(' — ')[0];
                              return (
                                <div key={vi} className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-purple-600 w-5 shrink-0">{videoId}</span>
                                  <span className="text-xs text-gray-600">{v.split(' — ')[1]}</span>
                                </div>
                              );
                            })}
                          </div>
                        </td>

                        {/* Localidade */}
                        <td className="px-4 py-3 align-top">
                          <span className="text-xs text-gray-600 bg-gray-100 rounded-lg px-2 py-1 inline-block leading-snug">
                            📍 {p.localidade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Resumo visual rápido */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">Resumo rápido dos vídeos por temperatura</p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-bold text-red-700 mb-1">🔴 Quente</p>
                <p className="text-gray-600">V4 — Plano Sem Lance</p>
                <p className="text-gray-600">V8 — Traduzindo Consórcio</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="font-bold text-orange-700 mb-1">🟡 Morno</p>
                <p className="text-gray-600">V1 — 3 Formas de Comprá-lo</p>
                <p className="text-gray-600">V2 — Aluguel Disfarçado</p>
                <p className="text-gray-600">V3 — Erro Financeiro</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="font-bold text-blue-700 mb-1">🔵 Frio</p>
                <p className="text-gray-600">V5 — BYD</p>
                <p className="text-gray-600">V6 — Corolla</p>
                <p className="text-gray-600">V7 — Picape</p>
                <p className="text-gray-600">V9 — H9/Haval</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
