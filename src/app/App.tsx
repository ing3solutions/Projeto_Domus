import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { Chamados } from './components/Chamados';
import { Prazos } from './components/Prazos';
import { Documentos } from './components/Documentos';
import { Prestadores } from './components/Prestadores';
import { Configuracoes } from './components/Configuracoes';

type Section = 'dashboard' | 'chamados' | 'prazos' | 'documentos' | 'prestadores' | 'configuracoes';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'chamados':
        return <Chamados />;
      case 'prazos':
        return <Prazos />;
      case 'documentos':
        return <Documentos />;
      case 'prestadores':
        return <Prestadores />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar (Desktop + Mobile) */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <main className="pt-16 lg:pl-64 pb-20 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation
        activeSection={activeSection as any}
        onSectionChange={handleSectionChange as any}
      />
    </div>
  );
}
