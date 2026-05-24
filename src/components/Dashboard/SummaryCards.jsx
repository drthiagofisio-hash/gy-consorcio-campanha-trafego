import { DollarSign, Users, MessageSquare, FileText, MessagesSquare, Target, Eye } from 'lucide-react';
import { fmtBRL, fmtNum, fmtPct } from '../../utils/calculations';

function Card({ icon: Icon, label, value, sub, color, trend }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   text: 'text-blue-700' },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-100 text-green-600', text: 'text-green-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-700' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', text: 'text-orange-700' },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-100 text-red-600',    text: 'text-red-700' },
    teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-100 text-teal-600',  text: 'text-teal-700' },
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', text: 'text-indigo-700' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className={`${c.bg} rounded-xl p-5 border border-white shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${c.icon}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && trend !== null && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${c.text}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function SummaryCards({ resumo, resumoAnterior }) {
  if (!resumo) return null;

  const trend = (atual, anterior, inverter = false) => {
    if (!anterior || anterior === 0) return null;
    const v = ((atual - anterior) / anterior) * 100;
    return inverter ? -v : v;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
      {/* 1 — Total Investido */}
      <Card
        icon={DollarSign}
        label="Total Investido"
        value={fmtBRL(resumo.totalSpend)}
        sub="na semana selecionada"
        color="blue"
        trend={trend(resumo.totalSpend, resumoAnterior?.totalSpend)}
      />

      {/* 2 — Total de Leads (formulários) */}
      <Card
        icon={Users}
        label="Total de Leads"
        value={fmtNum(resumo.totalLeads)}
        sub="formulários preenchidos"
        color="green"
        trend={trend(resumo.totalLeads, resumoAnterior?.totalLeads)}
      />

      {/* 3 — Conversas WhatsApp */}
      <Card
        icon={MessageSquare}
        label="Conversas WA"
        value={fmtNum(resumo.totalConversations)}
        sub="mensagens iniciadas"
        color="purple"
        trend={trend(resumo.totalConversations, resumoAnterior?.totalConversations)}
      />

      {/* 4 — Custo por Lead (formulário) */}
      <Card
        icon={FileText}
        label="Custo por Lead"
        value={resumo.cplLead != null ? fmtBRL(resumo.cplLead) : '—'}
        sub="form GT · form Davi"
        color="teal"
        trend={trend(resumo.cplLead, resumoAnterior?.cplLead, true)}
      />

      {/* 5 — Custo por Conversa WA */}
      <Card
        icon={MessagesSquare}
        label="Custo por Conv. WA"
        value={resumo.cplConversa != null ? fmtBRL(resumo.cplConversa) : '—'}
        sub="mensagem WhatsApp"
        color="indigo"
        trend={trend(resumo.cplConversa, resumoAnterior?.cplConversa, true)}
      />

      {/* 6 — Taxa de Lead */}
      <Card
        icon={Target}
        label="Taxa de Lead"
        value={fmtPct(resumo.taxaLeadMedia, 2)}
        sub="leads ÷ alcance"
        color="orange"
        trend={trend(resumo.taxaLeadMedia, resumoAnterior?.taxaLeadMedia)}
      />

      {/* 7 — Alcance Total */}
      <Card
        icon={Eye}
        label="Alcance Total"
        value={fmtNum(resumo.totalReach)}
        sub="pessoas alcançadas"
        color="red"
        trend={trend(resumo.totalReach, resumoAnterior?.totalReach)}
      />
    </div>
  );
}
