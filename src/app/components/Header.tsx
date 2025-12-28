import { Bell, Menu, Search } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-xl bg-[#3A5A40]/90 border-b border-white/10">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-white/90" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#588157] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">SC</span>
            </div>
            <span className="text-white/90 font-medium hidden sm:block">SíndCondo</span>
          </div>
        </div>

        {/* Center - Search (desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white/90 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-white/90" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#588157] to-[#A3B18A] p-0.5">
            <div className="w-full h-full rounded-full bg-[#3A5A40] flex items-center justify-center">
              <span className="text-white/90 text-sm">AB</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
