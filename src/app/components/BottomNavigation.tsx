import { useState } from 'react';
import { Home, AlertCircle, CalendarCheck, Megaphone, MoreHorizontal, X, Calendar, Package, Building, FileText, Users, Settings } from 'lucide-react';

type Section = 'dashboard' | 'chamados' | 'prazos' | 'documentos' | 'prestadores' | 'reservas' | 'encomendas' | 'avisos' | 'unidades' | 'configuracoes';

interface BottomNavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const mainNavItems = [
  { id: 'dashboard' as Section, label: 'Início', icon: Home },
  { id: 'chamados' as Section, label: 'Chamados', icon: AlertCircle },
  { id: 'reservas' as Section, label: 'Reservas', icon: CalendarCheck },
  { id: 'avisos' as Section, label: 'Avisos', icon: Megaphone },
];

const moreNavItems = [
  { id: 'prazos' as Section, label: 'Prazos', icon: Calendar },
  { id: 'encomendas' as Section, label: 'Encomendas', icon: Package },
  { id: 'unidades' as Section, label: 'Unidades', icon: Building },
  { id: 'documentos' as Section, label: 'Documentos', icon: FileText },
  { id: 'prestadores' as Section, label: 'Prestadores', icon: Users },
  { id: 'configuracoes' as Section, label: 'Configurações', icon: Settings },
];

export function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleSectionChange = (section: Section) => {
    onSectionChange(section);
    setIsMoreOpen(false);
  };

  const isActiveInMore = moreNavItems.some(item => item.id === activeSection);

  return (
    <>
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMoreOpen(false)}>
          <div 
            className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Mais opções</h3>
              <button onClick={() => setIsMoreOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 p-4">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                      isActive ? 'bg-[#588157] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#3A5A40] border-t border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px]
                  ${isActive ? 'text-white' : 'text-white/60'}
                `}
              >
                <div
                  className={`
                    p-1.5 rounded-lg transition-all
                    ${isActive ? 'bg-[#588157]' : ''}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px]
              ${isActiveInMore || isMoreOpen ? 'text-white' : 'text-white/60'}
            `}
          >
            <div
              className={`
                p-1.5 rounded-lg transition-all
                ${isActiveInMore || isMoreOpen ? 'bg-[#588157]' : ''}
              `}
            >
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}
