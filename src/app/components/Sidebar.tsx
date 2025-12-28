import { Home, AlertCircle, Calendar, FileText, Users, Settings } from 'lucide-react';

type Section = 'dashboard' | 'chamados' | 'prazos' | 'documentos' | 'prestadores' | 'configuracoes';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isOpen: boolean;
}

const menuItems = [
  { id: 'dashboard' as Section, label: 'Dashboard', icon: Home },
  { id: 'chamados' as Section, label: 'Chamados', icon: AlertCircle },
  { id: 'prazos' as Section, label: 'Prazos', icon: Calendar },
  { id: 'documentos' as Section, label: 'Documentos', icon: FileText },
  { id: 'prestadores' as Section, label: 'Prestadores', icon: Users },
  { id: 'configuracoes' as Section, label: 'Configurações', icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange, isOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => onSectionChange(activeSection)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 z-40 w-64 bg-[#3A5A40] border-r border-white/10
          transition-transform duration-300 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    isActive
                      ? 'bg-[#588157] text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
