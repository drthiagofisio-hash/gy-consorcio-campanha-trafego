import { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { parseMetaCSV, validarCSV, COLUMN_ALIASES } from '../../utils/csvParser';
import { fmtBRL, fmtNum } from '../../utils/calculations';
import { Upload, CheckCircle, AlertCircle, FileText, Clock, Trash2 } from 'lucide-react';

function ColumnMapEditor({ headers, columnMap, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {Object.keys(COLUMN_ALIASES).map(field => {
        const currentIdx = columnMap[field];
        return (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              {field} {['campaignName', 'spend'].includes(field) && <span className="text-red-500">*</span>}
            </label>
            <select
              value={currentIdx !== undefined ? currentIdx : ''}
              onChange={e => onChange(field, e.target.value !== '' ? Number(e.target.value) : undefined)}
              className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white"
            >
              <option value="">— Não mapeado —</option>
              {headers.map((h, i) => (
                <option key={i} value={i}>{h}</option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}

export function ImportCSV() {
  const { importWeekData, imports, weeklyData, setLoading } = useApp();
  const [step, setStep] = useState('idle'); // idle | preview | done | error
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [parseResult, setParseResult] = useState(null);
  const [validation, setValidation] = useState(null);
  const [columnMap, setColumnMap] = useState({});
  const [showColumnMap, setShowColumnMap] = useState(false);
  const [filename, setFilename] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (file) => {
    setFilename(file.name);
    setLoading(true);
    try {
      const text = await file.text();
      const result = parseMetaCSV(text);
      const val = validarCSV(result);
      setParseResult(result);
      setValidation(val);
      setColumnMap(result.columnMap);
      setStep('preview');
    } catch (e) {
      setValidation({ valido: false, erros: [`Erro ao ler o arquivo: ${e.message}`], avisos: [] });
      setStep('error');
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setValidation({ valido: false, erros: ['O arquivo deve ser um CSV (.csv)'], avisos: [] });
      setStep('error');
      return;
    }
    processFile(file);
  }, [processFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleConfirm = () => {
    if (!parseResult) return;
    importWeekData(selectedWeek, parseResult.rows, filename);
    setStep('done');
  };

  const handleColumnMapChange = (field, idx) => {
    setColumnMap(prev => ({ ...prev, [field]: idx }));
  };

  const resetar = () => {
    setStep('idle');
    setParseResult(null);
    setValidation(null);
    setColumnMap({});
    setFilename('');
  };

  // Histórico de importações
  const existeImport = (week) => imports.find(i => i.week === week);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Importar Relatório da Meta</h1>
        <p className="text-sm text-gray-500">Importe o CSV exportado pelo Gerenciador de Anúncios da Meta</p>
      </div>

      {/* Seleção de semana */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">1. Selecione a semana da campanha</h3>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map(w => {
            const imp = existeImport(w);
            return (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`flex-1 rounded-xl border-2 p-3 text-sm transition-all ${
                  selectedWeek === w
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="font-bold text-lg">S{w}</div>
                <div className="text-xs mt-1">Semana {w}</div>
                {imp && (
                  <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                    <CheckCircle size={10} /> Importado
                  </div>
                )}
                {!imp && (weeklyData[w]?.length || 0) > 0 && (
                  <div className="text-xs text-blue-500 mt-1">Dados mock</div>
                )}
              </button>
            );
          })}
        </div>
        {selectedWeek && existeImport(selectedWeek) && (
          <div className="mt-3 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
            ⚠️ A semana {selectedWeek} já tem dados importados. Uma nova importação vai substituí-los.
          </div>
        )}
      </div>

      {/* Upload */}
      {step === 'idle' && (
        <div
          className={`bg-white rounded-xl border-2 border-dashed p-10 text-center transition-all cursor-pointer shadow-sm ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('csv-input').click()}
        >
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
          />
          <Upload size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-sm font-semibold text-gray-700">Arraste o CSV aqui ou clique para selecionar</p>
          <p className="text-xs text-gray-400 mt-2">Suporta separador vírgula (,) ou ponto-e-vírgula (;)</p>
          <p className="text-xs text-gray-400">Números no formato brasileiro (1.234,56) são aceitos</p>
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && parseResult && (
        <div className="space-y-4">
          {/* Validação */}
          {validation && (
            <div className={`rounded-xl p-4 border ${validation.valido ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {validation.valido
                  ? <CheckCircle size={16} className="text-green-600" />
                  : <AlertCircle size={16} className="text-red-600" />
                }
                <span className={`text-sm font-semibold ${validation.valido ? 'text-green-700' : 'text-red-700'}`}>
                  {validation.valido ? 'Arquivo válido!' : 'Problemas encontrados'}
                </span>
              </div>
              {validation.erros.map((e, i) => <p key={i} className="text-xs text-red-600">❌ {e}</p>)}
              {validation.avisos.map((a, i) => <p key={i} className="text-xs text-amber-600">⚠️ {a}</p>)}
            </div>
          )}

          {/* Resumo do arquivo */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{filename}</p>
                <p className="text-xs text-gray-400">{parseResult.rows.length} linha(s) detectadas · Separador: '{parseResult.separator}'</p>
              </div>
            </div>

            {/* Preview das primeiras linhas */}
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-600">Campanha</th>
                    <th className="px-3 py-2 text-left text-gray-600">Anúncio</th>
                    <th className="px-3 py-2 text-right text-gray-600">Investido</th>
                    <th className="px-3 py-2 text-right text-gray-600">Leads</th>
                    <th className="px-3 py-2 text-right text-gray-600">Conversas</th>
                    <th className="px-3 py-2 text-right text-gray-600">Alcance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parseResult.rows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-700 max-w-[180px] truncate" title={row.campaignName}>{row.campaignName || '—'}</td>
                      <td className="px-3 py-2 text-gray-500 max-w-[140px] truncate" title={row.adName}>{row.adName || '—'}</td>
                      <td className="px-3 py-2 text-right font-mono">{fmtBRL(row.spend)}</td>
                      <td className="px-3 py-2 text-right font-mono">{fmtNum(row.leads)}</td>
                      <td className="px-3 py-2 text-right font-mono">{fmtNum(row.conversations)}</td>
                      <td className="px-3 py-2 text-right font-mono">{fmtNum(row.reach)}</td>
                    </tr>
                  ))}
                  {parseResult.rows.length > 5 && (
                    <tr><td colSpan={6} className="px-3 py-2 text-center text-gray-400">... e mais {parseResult.rows.length - 5} linha(s)</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mapeamento de colunas */}
            <button
              onClick={() => setShowColumnMap(c => !c)}
              className="mt-3 text-xs text-blue-600 hover:underline"
            >
              {showColumnMap ? '▲ Ocultar' : '▼ Ajustar'} mapeamento de colunas
            </button>
            {showColumnMap && (
              <ColumnMapEditor
                headers={parseResult.headers}
                columnMap={columnMap}
                onChange={handleColumnMapChange}
              />
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={resetar}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!validation?.valido}
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              ✓ Confirmar importação para a Semana {selectedWeek}
            </button>
          </div>
        </div>
      )}

      {/* Sucesso */}
      {step === 'done' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-bold text-green-800">Importação realizada com sucesso!</h3>
          <p className="text-sm text-green-600 mt-1">
            {parseResult?.rows.length} registros importados para a Semana {selectedWeek}
          </p>
          <button onClick={resetar}
            className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
            Importar outro arquivo
          </button>
        </div>
      )}

      {/* Erro */}
      {step === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
          <h3 className="text-base font-bold text-red-700">Não foi possível processar o arquivo</h3>
          {validation?.erros.map((e, i) => <p key={i} className="text-sm text-red-500 mt-1">{e}</p>)}
          <button onClick={resetar}
            className="mt-4 px-5 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Histórico */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Histórico de Importações</h3>
        </div>
        {imports.length === 0 ? (
          <p className="px-5 py-8 text-center text-gray-400 text-sm">Nenhuma importação realizada ainda.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {[...imports].sort((a, b) => a.week - b.week).map(imp => (
              <div key={imp.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs font-bold">
                    S{imp.week}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{imp.filename}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={10} />
                      {new Date(imp.importedAt).toLocaleString('pt-BR')}
                      · {imp.rowCount} linhas
                    </div>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  ✓ Importado
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
