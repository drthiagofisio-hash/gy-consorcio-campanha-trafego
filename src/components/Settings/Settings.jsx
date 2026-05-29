import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, RotateCcw, Plus, Trash2 } from 'lucide-react';

export function Settings() {
  const { config, updateConfig, resetToMock, campanhas, videos } = useApp();
  const [form, setForm] = useState({ ...config });
  const [saved, setSaved] = useState(false);
  const [newAdName, setNewAdName] = useState('');
  const [newVideoId, setNewVideoId] = useState('V1');

  const handleSave = () => {
    updateConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCplTarget = (fluxo, value) => {
    setForm(f => ({
      ...f,
      cplTargets: { ...f.cplTargets, [fluxo]: parseFloat(value) || 0 }
    }));
  };

  const handleVerbaSemanal = (campId, value) => {
    setForm(f => ({
      ...f,
      verbaSemanalOverrides: { ...(f.verbaSemanalOverrides || {}), [campId]: parseFloat(value) || 0 }
    }));
  };

  const addAdVideoMap = () => {
    if (!newAdName.trim()) return;
    setForm(f => ({
      ...f,
      adVideoMap: { ...f.adVideoMap, [newAdName.trim()]: newVideoId }
    }));
    setNewAdName('');
  };

  const removeAdVideoMap = (key) => {
    setForm(f => {
      const m = { ...f.adVideoMap };
      delete m[key];
      return { ...f, adVideoMap: m };
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Configurações</h1>
          <p className="text-sm text-gray-500">Ajuste os parâmetros do sistema — BM: {config.bmName}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { if (confirm('Restaurar todos os dados de exemplo?')) resetToMock(); }}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            <RotateCcw size={14} /> Restaurar mock
          </button>
          <button onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-semibold transition-colors ${
              saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}>
            <Save size={14} /> {saved ? '✓ Salvo!' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Informações do cliente */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Informações do Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome do Cliente</label>
            <input
              type="text"
              value={form.clientName}
              onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nome da BM</label>
            <input
              type="text"
              value={form.bmName}
              onChange={e => setForm(f => ({ ...f, bmName: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* CPL Meta por fluxo */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">CPL Meta por Fluxo</h3>
        <p className="text-xs text-gray-400 mb-4">O sistema usa esses valores para calcular os status das campanhas</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'bittrex', label: 'WhatsApp Bitrix' },
            { id: 'grupoGT', label: 'Formulário Grupo GT' },
            { id: 'davi', label: 'Formulário Davi' },
            { id: 'eliana', label: 'Formulário Eliana' },
          ].map(f => (
            <div key={f.id}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                <span className="px-2 text-gray-400 text-sm bg-gray-50">R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={form.cplTargets?.[f.id] || 0}
                  onChange={e => handleCplTarget(f.id, e.target.value)}
                  className="flex-1 px-2 py-2 text-sm outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verba por campanha */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Verba Semanal por Campanha</h3>
        <p className="text-xs text-gray-400 mb-4">Ajuste caso a verba mude no meio da campanha</p>
        <div className="space-y-2">
          {campanhas.map(camp => (
            <div key={camp.id} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 flex-1">{camp.nome}</span>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden w-36">
                <span className="px-2 text-gray-400 text-xs bg-gray-50">R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  defaultValue={camp.verbaSemanal}
                  onChange={e => handleVerbaSemanal(camp.id, e.target.value)}
                  className="flex-1 px-2 py-1.5 text-xs outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mapeamento anúncio × vídeo */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Mapeamento Anúncio × Vídeo</h3>
        <p className="text-xs text-gray-400 mb-4">
          Digite o nome exato do anúncio como aparece no CSV e vincule ao vídeo correspondente.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nome do anúncio (exato, como no CSV)"
            value={newAdName}
            onChange={e => setNewAdName(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            onKeyDown={e => e.key === 'Enter' && addAdVideoMap()}
          />
          <select
            value={newVideoId}
            onChange={e => setNewVideoId(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            {videos.map(v => (
              <option key={v.id} value={v.id}>{v.id} — {v.nome}</option>
            ))}
          </select>
          <button onClick={addAdVideoMap}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            <Plus size={14} /> Adicionar
          </button>
        </div>

        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {Object.entries(form.adVideoMap || {}).map(([adName, videoId]) => {
            const video = videos.find(v => v.id === videoId);
            return (
              <div key={adName} className="flex items-center gap-2 py-1.5 px-3 bg-gray-50 rounded-lg group">
                <span className="text-xs font-mono text-gray-700 flex-1 truncate" title={adName}>{adName}</span>
                <span className="text-xs text-purple-600 font-semibold w-16">{videoId}</span>
                <span className="text-xs text-gray-400 flex-1 truncate hidden sm:block">{video?.nome}</span>
                <button onClick={() => removeAdVideoMap(adName)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-opacity">
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm rounded-lg font-semibold transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
          <Save size={14} /> {saved ? '✓ Configurações salvas!' : 'Salvar configurações'}
        </button>
      </div>
    </div>
  );
}
