import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CampaignReport } from './components/Campaigns/CampaignReport';
import { AdsReport } from './components/Ads/AdsReport';
import { CreativesMap } from './components/Creatives/CreativesMap';
import { WeeklyComparison } from './components/Weekly/WeeklyComparison';
import { ImportCSV } from './components/Import/ImportCSV';
import { Settings } from './components/Settings/Settings';
import { NamingGuide } from './components/Guide/NamingGuide';

const PAGES = {
  dashboard:    Dashboard,
  campanhas:    CampaignReport,
  anuncios:     AdsReport,
  criativos:    CreativesMap,
  semanal:      WeeklyComparison,
  importar:     ImportCSV,
  guia:         NamingGuide,
  configuracoes: Settings,
};

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        <PageComponent />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
