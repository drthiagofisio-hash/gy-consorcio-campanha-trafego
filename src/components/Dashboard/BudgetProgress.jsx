import { FLUXOS, CAMPANHAS } from '../../data/campaigns';
import { fmtBRL, fmtPct } from '../../utils/calculations';
import { encontrarCampanha } from '../../data/campaigns';

function ProgressBar({ value, max, cor = 'blue' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const colors = {
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    orange: 'bg-orange-500',
    red:    'bg-red-500',
    purple: 'bg-purple-500',
    teal:   'bg-teal-500',
  };
  const danger = pct > 100;
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${danger ? 'bg-red-500' : (colors[cor] || colors.blue)}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function BudgetProgress({ rows }) {
  const fluxosData = Object.entries(FLUXOS).map(([fluxoId, fluxo]) => {
    const fluxoRows = rows.filter(row => {
      const campDef = encontrarCampanha(row.campaignName) ||
        CAMPANHAS.find(c => c.id === row.campaignId);
      return campDef?.fluxo === fluxoId;
    });
    const invested = fluxoRows.reduce((s, r) => s + (r.spend || 0), 0);
    const pct = fluxo.verbaSemanal > 0 ? (invested / fluxo.verbaSemanal) * 100 : 0;
    return { fluxoId, fluxo, invested, pct };
  });

  const totalInvested = rows.reduce((s, r) => s + (r.spend || 0), 0);
  const totalPlanned = 2725;
  const totalPct = (totalInvested / totalPlanned) * 100;

  const fluxoColors = { bittrex: 'purple', grupoGT: 'teal', davi: 'indigo' };
  const fluxoColorClasses = {
    bittrex: 'bg-purple-100 text-purple-700',
    grupoGT: 'bg-teal-100 text-teal-700',
    davi:    'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Verba por Fluxo — Semana Atual</h3>

      {/* Total */}
      <div className="mb-5 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-semibold text-gray-700">Total Geral</span>
          <span className="text-sm font-bold text-gray-900">
            {fmtBRL(totalInvested)} <span className="text-gray-400 font-normal">/ {fmtBRL(totalPlanned)}</span>
          </span>
        </div>
        <ProgressBar value={totalInvested} max={totalPlanned} cor={totalPct > 100 ? 'red' : 'blue'} />
        <div className="flex justify-end mt-1">
          <span className={`text-xs font-medium ${totalPct > 100 ? 'text-red-600' : totalPct > 90 ? 'text-orange-600' : 'text-green-600'}`}>
            {fmtPct(totalPct, 1)} utilizado
          </span>
        </div>
      </div>

      {/* Por fluxo */}
      <div className="space-y-4">
        {fluxosData.map(({ fluxoId, fluxo, invested, pct }) => (
          <div key={fluxoId}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fluxoColorClasses[fluxoId]}`}>
                  {fluxo.percentual}%
                </span>
                <span className="text-sm text-gray-700">{fluxo.nome}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {fmtBRL(invested)} <span className="text-gray-400 font-normal text-xs">/ {fmtBRL(fluxo.verbaSemanal)}</span>
              </span>
            </div>
            <ProgressBar value={invested} max={fluxo.verbaSemanal} cor={fluxoColors[fluxoId] || 'blue'} />
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${pct > 100 ? 'text-red-600' : pct > 90 ? 'text-orange-600' : 'text-green-600'} font-medium`}>
                {fmtPct(pct, 1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
