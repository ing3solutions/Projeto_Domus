import { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { ChamadoDetalhe } from './ChamadoDetalhe';

type ChamadoStatus = 'aberto' | 'em_andamento' | 'resolvido';

interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: ChamadoStatus;
  prioridade: 'alta' | 'media' | 'baixa';
  tipo: 'manutencao' | 'reclamacao' | 'sugestao';
  local: 'apartamento' | 'area_comum';
  numeroApto?: string;
  unidade: string;
  data: string;
  responsavel?: string;
}

export function Chamados() {
  const [filterStatus, setFilterStatus] = useState<ChamadoStatus | 'todos'>('todos');
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
  const [showDetalhe, setShowDetalhe] = useState(false);
  const [chamados, setChamados] = useState<Chamado[]>([
    {
      id: 1,
      titulo: 'Vazamento na tubulação',
      descricao: 'Vazamento identificado no 3º andar',
      status: 'aberto',
      prioridade: 'alta',
      tipo: 'manutencao',
      local: 'apartamento',
      numeroApto: '301',
      unidade: 'Apto 301',
      data: '28 Dez, 10:30',
    },
    {
      id: 2,
      titulo: 'Lâmpada queimada no corredor',
      descricao: 'Corredor do 5º andar sem iluminação',
      status: 'em_andamento',
      prioridade: 'media',
      tipo: 'manutencao',
      local: 'area_comum',
      unidade: 'Área comum',
      data: '27 Dez, 15:20',
      responsavel: 'João Silva',
    },
    {
      id: 3,
      titulo: 'Interfone com defeito',
      descricao: 'Não consegue ouvir as ligações',
      status: 'aberto',
      prioridade: 'media',
      tipo: 'manutencao',
      local: 'apartamento',
      numeroApto: '102',
      unidade: 'Apto 102',
      data: '27 Dez, 09:15',
    },
    {
      id: 4,
      titulo: 'Limpeza da caixa d\'água',
      descricao: 'Manutenção preventiva agendada',
      status: 'resolvido',
      prioridade: 'baixa',
      tipo: 'manutencao',
      local: 'area_comum',
      unidade: 'Área comum',
      data: '25 Dez, 14:00',
      responsavel: 'Maria Santos',
    },
  ]);

  const getStatusConfig = (status: ChamadoStatus) => {
    switch (status) {
      case 'aberto':
        return { label: 'Aberto', color: '#EF4444', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' };
      case 'em_andamento':
        return { label: 'Em Andamento', color: '#FACC15', bg: 'bg-[#FACC15]/10', text: 'text-[#FACC15]' };
      case 'resolvido':
        return { label: 'Resolvido', color: '#22C55E', bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]' };
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return '#EF4444';
      case 'media':
        return '#FACC15';
      case 'baixa':
        return '#22C55E';
      default:
        return '#64748B';
    }
  };

  const handleNovoChamado = () => {
    setSelectedChamado({
      id: 0,
      titulo: '',
      descricao: '',
      status: 'aberto',
      tipo: 'manutencao',
      local: 'area_comum',
      prioridade: 'media',
      unidade: '',
      data: new Date().toLocaleString('pt-BR'),
    });
    setShowDetalhe(true);
  };

  const handleEditChamado = (chamado: Chamado) => {
    setSelectedChamado(chamado);
    setShowDetalhe(true);
  };

  const handleSaveChamado = (chamado: Chamado) => {
    if (chamado.id === 0) {
      // Novo chamado
      const novoChamado = { ...chamado, id: Date.now() };
      setChamados([novoChamado, ...chamados]);
    } else {
      // Editar existente
      setChamados(chamados.map(c => c.id === chamado.id ? chamado : c));
    }
    setShowDetalhe(false);
  };

  const handleDeleteChamado = (id: number) => {
    setChamados(chamados.filter(c => c.id !== id));
    setShowDetalhe(false);
  };

  const filteredChamados = filterStatus === 'todos'
    ? chamados
    : chamados.filter(c => c.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A]">Chamados & Ocorrências</h2>
          <p className="text-sm text-[#64748B] mt-1">Gerencie as solicitações do condomínio</p>
        </div>
        <button 
          onClick={handleNovoChamado}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Chamado
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Buscar chamados..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#DAD7CD] border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button className="p-2.5 bg-[#DAD7CD] rounded-lg hover:bg-[#A3B18A] transition-colors flex-shrink-0">
            <Filter className="w-5 h-5 text-[#0F172A]" />
          </button>
          {(['todos', 'aberto', 'em_andamento', 'resolvido'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0
                ${filterStatus === status
                  ? 'bg-[#588157] text-white'
                  : 'bg-[#DAD7CD] text-[#0F172A] hover:bg-[#A3B18A]'
                }
              `}
            >
              {status === 'todos' ? 'Todos' : getStatusConfig(status).label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Chamados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredChamados.map((chamado) => {
          const statusConfig = getStatusConfig(chamado.status);
          return (
            <div
              key={chamado.id}
              onClick={() => handleEditChamado(chamado)}
              className="bg-[#DAD7CD] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer border-l-4"
              style={{ borderLeftColor: statusConfig.color }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0F172A] mb-1">{chamado.titulo}</h3>
                  <p className="text-sm text-[#64748B]">{chamado.descricao}</p>
                </div>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                  style={{ backgroundColor: getPrioridadeColor(chamado.prioridade) }}
                />
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#A3B18A]/30">
                <div className="flex items-center gap-3 text-xs text-[#64748B]">
                  <span>{chamado.unidade}</span>
                  <span>•</span>
                  <span>{chamado.data}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>

              {chamado.responsavel && (
                <div className="mt-3 text-xs text-[#64748B]">
                  Responsável: <span className="font-medium text-[#0F172A]">{chamado.responsavel}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Detalhes */}
      {showDetalhe && selectedChamado && (
        <ChamadoDetalhe
          chamado={selectedChamado}
          onClose={() => setShowDetalhe(false)}
          onSave={handleSaveChamado}
          onDelete={handleDeleteChamado}
        />
      )}
    </div>
  );
}