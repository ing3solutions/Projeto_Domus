import { AlertCircle, Clock, FileText, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function Dashboard() {
  const metrics = [
    {
      id: 1,
      title: 'Chamados Abertos',
      value: '12',
      description: '3 novos hoje',
      icon: AlertCircle,
      color: '#588157',
      bgColor: 'rgba(88, 129, 87, 0.1)',
    },
    {
      id: 2,
      title: 'Prazos Próximos',
      value: '5',
      description: 'Nos próximos 7 dias',
      icon: Clock,
      color: '#FACC15',
      bgColor: 'rgba(250, 204, 21, 0.1)',
    },
    {
      id: 3,
      title: 'Contratos a Vencer',
      value: '3',
      description: 'Requerem atenção',
      icon: FileText,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      id: 4,
      title: 'Taxa de Resolução',
      value: '94%',
      description: '+5% este mês',
      icon: TrendingUp,
      color: '#22C55E',
      bgColor: 'rgba(34, 197, 94, 0.1)',
    },
  ];

  const alerts = [
    {
      id: 1,
      title: 'Manutenção do elevador agendada',
      time: 'Hoje às 14h',
      status: 'warning' as const,
      description: 'Prestador: TechLift Elevadores',
    },
    {
      id: 2,
      title: 'Assembleia geral marcada',
      time: 'Sexta, 03 Jan',
      status: 'info' as const,
      description: 'Pauta: Aprovação de obras',
    },
    {
      id: 3,
      title: 'Vistoria do corpo de bombeiros',
      time: '15 Jan',
      status: 'warning' as const,
      description: 'Documentação em dia',
    },
    {
      id: 4,
      title: 'Novo morador cadastrado',
      time: 'Ontem',
      status: 'success' as const,
      description: 'Apto 501 - Bloco B',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning':
        return 'bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20';
      case 'success':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      default:
        return 'bg-[#588157]/10 text-[#588157] border-[#588157]/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="bg-[#DAD7CD] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: metric.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: metric.color }} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-semibold text-[#0F172A]">{metric.value}</p>
                <p className="text-sm font-medium text-[#0F172A]">{metric.title}</p>
                <p className="text-xs text-[#64748B]">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline de Alertas */}
      <div className="bg-[#DAD7CD] rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">Atividades Recentes</h3>
            <p className="text-sm text-[#64748B] mt-1">Acompanhe os eventos importantes</p>
          </div>
          <button className="text-sm font-medium text-[#588157] hover:text-[#3A5A40] transition-colors">
            Ver tudo
          </button>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all"
            >
              <div
                className={`
                  p-2 rounded-lg border
                  ${getStatusColor(alert.status)}
                `}
              >
                {getStatusIcon(alert.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#0F172A]">{alert.title}</p>
                <p className="text-sm text-[#64748B] mt-1">{alert.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-[#64748B]">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
