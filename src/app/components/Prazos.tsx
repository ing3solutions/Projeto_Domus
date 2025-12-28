import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, List } from 'lucide-react';
import { PrazoDetalhe } from './PrazoDetalhe';

type ViewMode = 'list' | 'calendar';

interface Prazo {
  id: number;
  titulo: string;
  tipo: 'assembleia' | 'vistoria' | 'manutencao' | 'pagamento';
  data: string;
  hora?: string;
  local?: string;
  responsavel?: string;
  descricao: string;
  documentoRelacionado?: string;
  notificacoes?: {
    dias7: boolean;
    dias3: boolean;
    dia1: boolean;
  };
  canais?: {
    sistema: boolean;
    email: boolean;
  };
}

export function Prazos() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showDetalhe, setShowDetalhe] = useState(false);
  const [selectedPrazo, setSelectedPrazo] = useState<Prazo | null>(null);

  const [prazos, setPrazos] = useState<Prazo[]>([
    {
      id: 1,
      titulo: 'Assembleia Geral Ordinária',
      tipo: 'assembleia',
      data: '2025-01-03',
      hora: '19:00',
      local: 'Salão de Festas',
      responsavel: 'Síndico',
      descricao: 'Pauta: Aprovação de obras e contas do ano',
      notificacoes: { dias7: true, dias3: true, dia1: true },
      canais: { sistema: true, email: true },
    },
    {
      id: 2,
      titulo: 'Vistoria Corpo de Bombeiros',
      tipo: 'vistoria',
      data: '2025-01-15',
      hora: '10:00',
      descricao: 'Renovação do AVCB',
      documentoRelacionado: 'AVCB_2024.pdf',
      notificacoes: { dias7: true, dias3: true, dia1: true },
      canais: { sistema: true, email: false },
    },
    {
      id: 3,
      titulo: 'Manutenção Elevadores',
      tipo: 'manutencao',
      data: '2024-12-29',
      hora: '14:00',
      descricao: 'Manutenção preventiva trimestral',
      responsavel: 'TechLift',
      notificacoes: { dias7: true, dias3: true, dia1: true },
      canais: { sistema: true, email: false },
    },
    {
      id: 4,
      titulo: 'Pagamento Seguro Predial',
      tipo: 'pagamento',
      data: '2025-01-10',
      descricao: 'Renovação anual do seguro',
      documentoRelacionado: 'Seguro_Predial.pdf',
      notificacoes: { dias7: true, dias3: true, dia1: true },
      canais: { sistema: true, email: true },
    },
  ]);

  const getTipoConfig = (tipo: string) => {
    switch (tipo) {
      case 'assembleia':
        return { label: 'Assembleia', color: '#588157', bg: 'bg-[#588157]/10' };
      case 'vistoria':
        return { label: 'Vistoria', color: '#FACC15', bg: 'bg-[#FACC15]/10' };
      case 'manutencao':
        return { label: 'Manutenção', color: '#3A5A40', bg: 'bg-[#3A5A40]/10' };
      case 'pagamento':
        return { label: 'Pagamento', color: '#EF4444', bg: 'bg-[#EF4444]/10' };
      default:
        return { label: tipo, color: '#64748B', bg: 'bg-[#64748B]/10' };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleNovoPrazo = () => {
    setSelectedPrazo({
      id: 0,
      titulo: '',
      tipo: 'assembleia',
      data: '',
      hora: '',
      local: '',
      responsavel: '',
      descricao: '',
      documentoRelacionado: '',
      notificacoes: { dias7: true, dias3: true, dia1: true },
      canais: { sistema: true, email: false },
    });
    setShowDetalhe(true);
  };

  const handleEditPrazo = (prazo: Prazo) => {
    setSelectedPrazo(prazo);
    setShowDetalhe(true);
  };

  const handleSavePrazo = (prazo: Prazo) => {
    if (prazo.id === 0) {
      const novoPrazo = { ...prazo, id: Date.now() };
      setPrazos([novoPrazo, ...prazos]);
    } else {
      setPrazos(prazos.map(p => p.id === prazo.id ? prazo : p));
    }
    setShowDetalhe(false);
  };

  const handleDeletePrazo = (id: number) => {
    setPrazos(prazos.filter(p => p.id !== id));
    setShowDetalhe(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A]">Prazos & Assembleias</h2>
          <p className="text-sm text-[#64748B] mt-1">Acompanhe eventos e compromissos importantes</p>
        </div>
        <button 
          onClick={handleNovoPrazo}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Prazo
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 p-1 bg-[#DAD7CD] rounded-lg w-fit">
        <button
          onClick={() => setViewMode('list')}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all
            ${viewMode === 'list'
              ? 'bg-white text-[#0F172A] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
            }
          `}
        >
          <List className="w-4 h-4" />
          Lista
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all
            ${viewMode === 'calendar'
              ? 'bg-white text-[#0F172A] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
            }
          `}
        >
          <CalendarIcon className="w-4 h-4" />
          Calendário
        </button>
      </div>

      {/* Lista */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {prazos.map((prazo) => {
            const tipoConfig = getTipoConfig(prazo.tipo);
            return (
              <div
                key={prazo.id}
                onClick={() => handleEditPrazo(prazo)}
                className="bg-[#DAD7CD] rounded-xl p-6 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#0F172A]">{prazo.titulo}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${tipoConfig.bg}`}
                        style={{ color: tipoConfig.color }}
                      >
                        {tipoConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-[#64748B]">{prazo.descricao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[#A3B18A]/30">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm font-medium text-[#0F172A]">{formatDate(prazo.data)}</span>
                  </div>
                  {prazo.hora && (
                    <>
                      <span className="text-[#64748B]">•</span>
                      <span className="text-sm text-[#64748B]">{prazo.hora}</span>
                    </>
                  )}
                  {prazo.local && (
                    <>
                      <span className="text-[#64748B]">•</span>
                      <span className="text-sm text-[#64748B]">{prazo.local}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Calendário (simplificado) */}
      {viewMode === 'calendar' && (
        <div className="bg-[#DAD7CD] rounded-2xl p-6 lg:p-8">
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-[#A3B18A] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Visualização de Calendário</h3>
            <p className="text-sm text-[#64748B]">
              Use a visualização em lista para ver todos os compromissos
            </p>
          </div>

          {/* Mini preview dos próximos eventos */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-[#0F172A] mb-3">Próximos Eventos</h4>
            {prazos.slice(0, 3).map((prazo) => (
              <div
                key={prazo.id}
                onClick={() => handleEditPrazo(prazo)}
                className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-all cursor-pointer"
              >
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: getTipoConfig(prazo.tipo).color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0F172A] text-sm">{prazo.titulo}</p>
                  <p className="text-xs text-[#64748B]">{formatDate(prazo.data)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetalhe && selectedPrazo && (
        <PrazoDetalhe
          prazo={selectedPrazo}
          onClose={() => setShowDetalhe(false)}
          onSave={handleSavePrazo}
          onDelete={handleDeletePrazo}
        />
      )}
    </div>
  );
}