import { useState } from 'react';
import { X, Save, Trash2, Calendar as CalendarIcon, Clock, MapPin, User, FileText, Bell } from 'lucide-react';

interface PrazoDetalheProps {
  prazo: Prazo | null;
  onClose: () => void;
  onSave: (prazo: Prazo) => void;
  onDelete?: (id: number) => void;
}

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
  notificacoes: {
    dias7: boolean;
    dias3: boolean;
    dia1: boolean;
  };
  canais: {
    sistema: boolean;
    email: boolean;
  };
  status?: 'futuro' | 'hoje' | 'concluido' | 'atrasado';
}

export function PrazoDetalhe({ prazo, onClose, onSave, onDelete }: PrazoDetalheProps) {
  const isNew = !prazo || prazo.id === 0;
  const [formData, setFormData] = useState<Prazo>(
    prazo || {
      id: 0,
      titulo: '',
      tipo: 'assembleia',
      data: '',
      hora: '',
      local: '',
      responsavel: '',
      descricao: '',
      documentoRelacionado: '',
      notificacoes: {
        dias7: true,
        dias3: true,
        dia1: true,
      },
      canais: {
        sistema: true,
        email: false,
      },
    }
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isPast = formData.status === 'concluido' || formData.status === 'atrasado';
  const canEdit = !isPast || isNew;

  const handleSave = () => {
    if (!formData.titulo || !formData.data) return;
    onSave(formData);
    onClose();
  };

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

  const tipoConfig = getTipoConfig(formData.tipo);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-[#F8F9FA] rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-[#3A5A40] rounded-t-2xl p-6 border-b border-white/10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              {canEdit ? (
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título do evento"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              ) : (
                <h2 className="text-xl font-semibold text-white">{formData.titulo}</h2>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/90" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tipo Selector */}
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
              disabled={!canEdit}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${tipoConfig.bg} border-none focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50`}
              style={{ color: tipoConfig.color }}
            >
              <option value="assembleia">Assembleia</option>
              <option value="vistoria">Vistoria</option>
              <option value="manutencao">Manutenção</option>
              <option value="pagamento">Pagamento</option>
            </select>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleSave}
                disabled={!canEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              {!isNew && onDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-[#EF4444]/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-[#EF4444]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-240px)] overflow-y-auto">
          {/* Informações Principais */}
          <div className="bg-[#DAD7CD] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[#0F172A] mb-4">Informações do Evento</h3>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                disabled={!canEdit}
                rows={3}
                className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50 resize-none"
                placeholder="Descreva o evento e sua importância..."
              />
            </div>

            {/* Grid de Campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  disabled={!canEdit}
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                />
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  disabled={!canEdit}
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                />
              </div>

              {/* Local */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Local
                </label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  disabled={!canEdit}
                  placeholder="Ex: Salão de Festas"
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                />
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Responsável
                </label>
                <select
                  value={formData.responsavel || ''}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  disabled={!canEdit}
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                >
                  <option value="">Não atribuído</option>
                  <option value="Síndico">Síndico</option>
                  <option value="João Silva">João Silva</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="Administradora">Administradora</option>
                </select>
              </div>

              {/* Documento Relacionado */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Documento Relacionado
                </label>
                <select
                  value={formData.documentoRelacionado || ''}
                  onChange={(e) => setFormData({ ...formData, documentoRelacionado: e.target.value })}
                  disabled={!canEdit}
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                >
                  <option value="">Nenhum</option>
                  <option value="AVCB_2024.pdf">AVCB_2024.pdf</option>
                  <option value="Seguro_Predial.pdf">Seguro_Predial.pdf</option>
                  <option value="Ata_Assembleia.pdf">Ata_Assembleia.pdf</option>
                </select>
              </div>
            </div>
          </div>

          {/* Alertas & Lembretes */}
          <div className="bg-[#DAD7CD] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#588157]" />
              <h3 className="font-semibold text-[#0F172A]">Alertas & Lembretes</h3>
            </div>

            {/* Notificações */}
            <div>
              <p className="text-sm font-medium text-[#0F172A] mb-3">Notificar antes do evento:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.notificacoes.dias7}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notificacoes: { ...formData.notificacoes, dias7: e.target.checked },
                      })
                    }
                    disabled={!canEdit}
                    className="w-4 h-4 text-[#588157] border-[#A3B18A] rounded focus:ring-[#588157]"
                  />
                  <span className="text-sm text-[#0F172A]">7 dias antes</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.notificacoes.dias3}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notificacoes: { ...formData.notificacoes, dias3: e.target.checked },
                      })
                    }
                    disabled={!canEdit}
                    className="w-4 h-4 text-[#588157] border-[#A3B18A] rounded focus:ring-[#588157]"
                  />
                  <span className="text-sm text-[#0F172A]">3 dias antes</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.notificacoes.dia1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notificacoes: { ...formData.notificacoes, dia1: e.target.checked },
                      })
                    }
                    disabled={!canEdit}
                    className="w-4 h-4 text-[#588157] border-[#A3B18A] rounded focus:ring-[#588157]"
                  />
                  <span className="text-sm text-[#0F172A]">1 dia antes</span>
                </label>
              </div>
            </div>

            {/* Canais */}
            <div>
              <p className="text-sm font-medium text-[#0F172A] mb-3">Canais de notificação:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.canais.sistema}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        canais: { ...formData.canais, sistema: e.target.checked },
                      })
                    }
                    disabled={!canEdit}
                    className="w-4 h-4 text-[#588157] border-[#A3B18A] rounded focus:ring-[#588157]"
                  />
                  <span className="text-sm text-[#0F172A]">Sistema (Push)</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.canais.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        canais: { ...formData.canais, email: e.target.checked },
                      })
                    }
                    disabled={!canEdit}
                    className="w-4 h-4 text-[#588157] border-[#A3B18A] rounded focus:ring-[#588157]"
                  />
                  <span className="text-sm text-[#0F172A]">Email</span>
                </label>
              </div>
            </div>
          </div>

          {/* Info sobre Status */}
          {isPast && (
            <div className="bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-xl p-4">
              <p className="text-sm text-[#64748B]">
                ℹ️ Este evento já passou e está bloqueado para edição.
              </p>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#DAD7CD] rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Excluir Evento</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors text-[#0F172A]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onDelete?.(formData.id);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2 bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
