import { Plus, Phone, Mail, AlertCircle } from 'lucide-react';

interface Prestador {
  id: number;
  nome: string;
  servico: string;
  contrato: {
    inicio: string;
    vencimento: string;
    diasRestantes: number;
  };
  contato: {
    telefone: string;
    email: string;
  };
  status: 'ativo' | 'atencao' | 'vencido';
}

export function Prestadores() {
  const prestadores: Prestador[] = [
    {
      id: 1,
      nome: 'CleanPro Limpeza',
      servico: 'Limpeza e Conservação',
      contrato: {
        inicio: '01 Jan 2024',
        vencimento: '31 Dez 2024',
        diasRestantes: 3,
      },
      contato: {
        telefone: '(11) 98765-4321',
        email: 'contato@cleanpro.com.br',
      },
      status: 'atencao',
    },
    {
      id: 2,
      nome: 'SecureGuard',
      servico: 'Segurança e Portaria',
      contrato: {
        inicio: '15 Mar 2024',
        vencimento: '15 Mar 2025',
        diasRestantes: 77,
      },
      contato: {
        telefone: '(11) 97654-3210',
        email: 'contato@secureguard.com.br',
      },
      status: 'ativo',
    },
    {
      id: 3,
      nome: 'TechLift Elevadores',
      servico: 'Manutenção de Elevadores',
      contrato: {
        inicio: '01 Jun 2024',
        vencimento: '01 Jun 2025',
        diasRestantes: 155,
      },
      contato: {
        telefone: '(11) 96543-2109',
        email: 'suporte@techlift.com.br',
      },
      status: 'ativo',
    },
    {
      id: 4,
      nome: 'JardimVerde',
      servico: 'Jardinagem',
      contrato: {
        inicio: '10 Ago 2024',
        vencimento: '10 Ago 2025',
        diasRestantes: 225,
      },
      contato: {
        telefone: '(11) 95432-1098',
        email: 'contato@jardimverde.com.br',
      },
      status: 'ativo',
    },
  ];

  const getStatusConfig = (status: string, diasRestantes: number) => {
    if (status === 'vencido' || diasRestantes < 0) {
      return {
        label: 'Vencido',
        color: '#EF4444',
        bg: 'bg-[#EF4444]/10',
        text: 'text-[#EF4444]',
        border: 'border-[#EF4444]',
      };
    }
    if (diasRestantes <= 30) {
      return {
        label: `Vence em ${diasRestantes} dias`,
        color: '#FACC15',
        bg: 'bg-[#FACC15]/10',
        text: 'text-[#FACC15]',
        border: 'border-[#FACC15]',
      };
    }
    return {
      label: 'Ativo',
      color: '#22C55E',
      bg: 'bg-[#22C55E]/10',
      text: 'text-[#22C55E]',
      border: 'border-[#22C55E]',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A]">Prestadores & Contratos</h2>
          <p className="text-sm text-[#64748B] mt-1">Gerencie empresas e contratos ativos</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Novo Prestador
        </button>
      </div>

      {/* Grid de Prestadores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {prestadores.map((prestador) => {
          const statusConfig = getStatusConfig(prestador.status, prestador.contrato.diasRestantes);
          
          return (
            <div
              key={prestador.id}
              className={`
                bg-[#DAD7CD] rounded-2xl p-6 hover:shadow-md transition-all
                border-l-4 ${statusConfig.border}
              `}
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0F172A] mb-1">{prestador.nome}</h3>
                  <p className="text-sm text-[#64748B]">{prestador.servico}</p>
                </div>
                {prestador.contrato.diasRestantes <= 30 && (
                  <AlertCircle className="w-5 h-5 text-[#FACC15] flex-shrink-0" />
                )}
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>

              {/* Contrato Info */}
              <div className="space-y-2 mb-4 p-4 bg-white/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Início:</span>
                  <span className="font-medium text-[#0F172A]">{prestador.contrato.inicio}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Vencimento:</span>
                  <span className="font-medium text-[#0F172A]">{prestador.contrato.vencimento}</span>
                </div>
              </div>

              {/* Contatos */}
              <div className="space-y-2 pt-4 border-t border-[#A3B18A]/30">
                <a
                  href={`tel:${prestador.contato.telefone}`}
                  className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#588157] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {prestador.contato.telefone}
                </a>
                <a
                  href={`mailto:${prestador.contato.email}`}
                  className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#588157] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {prestador.contato.email}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerta de Atenção */}
      <div className="bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#FACC15] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-[#0F172A] mb-1">Contratos próximos do vencimento</h4>
            <p className="text-sm text-[#64748B]">
              {prestadores.filter(p => p.contrato.diasRestantes <= 30).length} contrato(s) 
              vence(m) nos próximos 30 dias. Agende uma renovação para evitar interrupções.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
