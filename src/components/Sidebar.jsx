import { useState } from 'react';
import {
  LayoutDashboard, BarChart2, FileText, Image, Upload, Settings,
  ChevronLeft, ChevronRight, CalendarDays, TrendingUp, BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'campanhas',    label: 'Campanhas',       icon: BarChart2 },
  { id: 'anuncios',     label: 'Anúncios',        icon: FileText },
  { id: 'criativos',    label: 'Criativos',       icon: Image },
  { id: 'semanal',      label: 'Comparativo',     icon: TrendingUp },
  { id: 'importar',     label: 'Importar CSV',    icon: Upload },
  { id: 'guia',         label: 'Guia de Nomes',   icon: BookOpen, destaque: true },
  { id: 'configuracoes', label: 'Configurações',  icon: Settings },
];

function fmtBRLSimple(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

export function Sidebar({ activePage, onPageChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const { activeBM, setActiveBM, verbaTotalCampanha, impostoInfo } = useApp();

  return (
    <aside
      className={`h-screen flex flex-col bg-slate-900 text-white transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } flex-shrink-0`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest truncate">Agora Marketing</span>
            <span className="text-sm font-bold text-white truncate">GT Consórcios</span>
            <span className={`text-xs truncate font-medium ${activeBM === 'excala' ? 'text-purple-400' : 'text-slate-400'}`}>
              BM {activeBM === 'excala' ? 'GT Excala' : 'Rodobens'}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Seletor de BM */}
      <div className={`${collapsed ? 'px-1 py-2' : 'px-3 pt-3'}`}>
        {collapsed ? (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveBM('rodobens')}
              title="BM Rodobens"
              className={`w-full py-1.5 rounded text-xs font-bold transition-colors ${
                activeBM === 'rodobens' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'
              }`}
            >R</button>
            <button
              onClick={() => setActiveBM('excala')}
              title="BM GT Excala"
              className={`w-full py-1.5 rounded text-xs font-bold transition-colors ${
                activeBM === 'excala' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-700'
              }`}
            >E</button>
          </div>
        ) : (
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            <button
              onClick={() => setActiveBM('rodobens')}
              className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                activeBM === 'rodobens'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Rodobens
            </button>
            <button
              onClick={() => setActiveBM('excala')}
              className={`flex-1 py-2 text-xs font-semibold transition-colors ${
                activeBM === 'excala'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              GT Excala
            </button>
          </div>
        )}
      </div>

      {/* Indicador de campanha */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-blue-400" />
            <span className="text-xs text-blue-300 font-medium">Campanha em andamento</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            4 semanas · {fmtBRLSimple(verbaTotalCampanha)}
            {impostoInfo.tem && (
              <span className="text-violet-400 ml-1">(liq. {impostoInfo.pct}% imp.)</span>
            )}
          </div>
        </div>
      )}

      {/* Navegação */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-600 text-white shadow'
                  : item.destaque
                  ? 'text-amber-300 hover:bg-amber-500/20 hover:text-amber-200'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.destaque && !active && (
                <span className="ml-auto text-xs bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded font-semibold">novo</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-slate-700">
          <p className="text-xs text-slate-500">© 2025 Agora Marketing</p>
        </div>
      )}
    </aside>
  );
}
