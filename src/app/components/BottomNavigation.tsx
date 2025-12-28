import { Home, AlertCircle, Calendar, FileText, Users } from 'lucide-react';

type Section = 'dashboard' | 'chamados' | 'prazos' | 'documentos' | 'prestadores';

interface BottomNavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const navItems = [
  { id: 'dashboard' as Section, label: 'Início', icon: Home },
  { id: 'chamados' as Section, label: 'Chamados', icon: AlertCircle },
  { id: 'prazos' as Section, label: 'Agenda', icon: Calendar },
  { id: 'documentos' as Section, label: 'Docs', icon: FileText },
  { id: 'prestadores' as Section, label: 'Equipe', icon: Users },
];

export function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#3A5A40] border-t border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
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
      </div>
    </nav>
  );
}
