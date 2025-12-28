import { useState } from 'react';
import { X, Save, Trash2, Clock, User, MapPin, AlertCircle, Paperclip, MessageSquare, Upload, Download } from 'lucide-react';

interface ChamadoDetalheProps {
  chamado: Chamado | null;
  onClose: () => void;
  onSave: (chamado: Chamado) => void;
  onDelete?: (id: number) => void;
}

interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_andamento' | 'resolvido';
  tipo: 'manutencao' | 'reclamacao' | 'sugestao' | 'ocorrencia';
  local: 'area_comum' | 'apartamento';
  numeroApto?: string;
  prioridade: 'alta' | 'media' | 'baixa';
  responsavel?: string;
  unidade: string;
  data: string;
  anexos?: Anexo[];
  historico?: HistoricoItem[];
  comentarios?: Comentario[];
}

interface Anexo {
  id: number;
  nome: string;
  tipo: string;
  tamanho: string;
  url: string;
}

interface HistoricoItem {
  id: number;
  tipo: 'criacao' | 'status' | 'comentario' | 'anexo';
  autor: string;
  data: string;
  descricao: string;
}

interface Comentario {
  id: number;
  autor: string;
  data: string;
  texto: string;
}

export function ChamadoDetalhe({ chamado, onClose, onSave, onDelete }: ChamadoDetalheProps) {
  const isNew = !chamado || chamado.id === 0;
  const [formData, setFormData] = useState<Chamado>(
    chamado || {
      id: 0,
      titulo: '',
      descricao: '',
      status: 'aberto',
      tipo: 'manutencao',
      local: 'area_comum',
      prioridade: 'media',
      unidade: '',
      data: new Date().toLocaleString('pt-BR'),
      anexos: [],
      historico: [],
      comentarios: [],
    }
  );
  const [novoComentario, setNovoComentario] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isResolvido = formData.status === 'resolvido';
  const canEdit = !isResolvido || isNew;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleAddComentario = () => {
    if (!novoComentario.trim()) return;

    const newComentario: Comentario = {
      id: Date.now(),
      autor: 'Você',
      data: new Date().toLocaleString('pt-BR'),
      texto: novoComentario,
    };

    setFormData({
      ...formData,
      comentarios: [...(formData.comentarios || []), newComentario],
    });
    setNovoComentario('');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'aberto':
        return { label: 'Aberto', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' };
      case 'em_andamento':
        return { label: 'Em Andamento', bg: 'bg-[#FACC15]/10', text: 'text-[#FACC15]' };
      case 'resolvido':
        return { label: 'Resolvido', bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]' };
      default:
        return { label: status, bg: 'bg-[#64748B]/10', text: 'text-[#64748B]' };
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'criacao':
        return <Clock className="w-4 h-4" />;
      case 'status':
        return <AlertCircle className="w-4 h-4" />;
      case 'comentario':
        return <MessageSquare className="w-4 h-4" />;
      case 'anexo':
        return <Paperclip className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-[#F8F9FA] rounded-2xl w-full max-w-4xl my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-[#3A5A40] rounded-t-2xl p-6 border-b border-white/10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              {canEdit ? (
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título do chamado"
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
            {/* Status Selector */}
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              disabled={!canEdit}
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusConfig(formData.status).bg} ${getStatusConfig(formData.status).text} border-none focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50`}
            >
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="resolvido">Resolvido</option>
            </select>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors"
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
          {/* Form Principal */}
          <div className="bg-[#DAD7CD] rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-[#0F172A] mb-4">Informações do Chamado</h3>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Descrição Detalhada
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                disabled={!canEdit}
                rows={4}
                className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50 resize-none"
                placeholder="Descreva o problema ou solicitação..."
              />
            </div>

            {/* Grid de Campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                  disabled={!canEdit}
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                >
                  <option value="manutencao">Manutenção</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="ocorrencia">Ocorrência</option>
                </select>
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Prioridade</label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as any })}
                  disabled={!canEdit}
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Local */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Local</label>
                <select
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value as any })}
                  disabled={!canEdit}
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                >
                  <option value="area_comum">Área Comum</option>
                  <option value="apartamento">Apartamento</option>
                </select>
              </div>

              {/* Número do Apto (condicional) */}
              {formData.local === 'apartamento' && (
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Número do Apartamento
                  </label>
                  <input
                    type="text"
                    value={formData.numeroApto || ''}
                    onChange={(e) => setFormData({ ...formData, numeroApto: e.target.value })}
                    disabled={!canEdit}
                    placeholder="Ex: 301"
                    className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                  />
                </div>
              )}

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Responsável</label>
                <select
                  value={formData.responsavel || ''}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  disabled={!canEdit}
                  className="w-full px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#588157] disabled:opacity-50"
                >
                  <option value="">Não atribuído</option>
                  <option value="João Silva">João Silva</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="CleanPro">CleanPro Limpeza</option>
                  <option value="TechLift">TechLift Elevadores</option>
                </select>
              </div>
            </div>
          </div>

          {/* Anexos */}
          <div className="bg-[#DAD7CD] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0F172A]">Anexos</h3>
              {canEdit && (
                <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              )}
            </div>

            {formData.anexos && formData.anexos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.anexos.map((anexo) => (
                  <div
                    key={anexo.id}
                    className="bg-white/50 rounded-lg p-3 hover:bg-white/80 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Paperclip className="w-4 h-4 text-[#588157]" />
                      <button className="p-1 hover:bg-[#588157]/10 rounded">
                        <Download className="w-3 h-3 text-[#64748B]" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-[#0F172A] truncate">{anexo.nome}</p>
                    <p className="text-xs text-[#64748B]">{anexo.tamanho}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B] text-center py-4">Nenhum anexo</p>
            )}
          </div>

          {/* Histórico */}
          {!isNew && (
            <div className="bg-[#DAD7CD] rounded-xl p-6">
              <h3 className="font-semibold text-[#0F172A] mb-4">Histórico</h3>
              <div className="space-y-3">
                {/* Histórico de exemplo */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#588157]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#588157]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0F172A]">Chamado criado</p>
                    <p className="text-xs text-[#64748B]">por Você • {formData.data}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comentários */}
          {!isNew && (
            <div className="bg-[#DAD7CD] rounded-xl p-6">
              <h3 className="font-semibold text-[#0F172A] mb-4">Comentários</h3>

              {/* Lista de Comentários */}
              <div className="space-y-3 mb-4">
                {formData.comentarios && formData.comentarios.length > 0 ? (
                  formData.comentarios.map((comentario) => (
                    <div key={comentario.id} className="bg-white/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-[#64748B]" />
                        <span className="text-sm font-medium text-[#0F172A]">{comentario.autor}</span>
                        <span className="text-xs text-[#64748B]">• {comentario.data}</span>
                      </div>
                      <p className="text-sm text-[#0F172A]">{comentario.texto}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#64748B] text-center py-4">Nenhum comentário ainda</p>
                )}
              </div>

              {/* Novo Comentário */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComentario()}
                  placeholder="Adicionar comentário..."
                  className="flex-1 px-4 py-2.5 bg-white/50 border border-transparent rounded-lg text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
                <button
                  onClick={handleAddComentario}
                  className="px-4 py-2.5 bg-[#588157] text-white rounded-lg hover:bg-[#3A5A40] transition-colors"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#DAD7CD] rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Excluir Chamado</h3>
              <p className="text-sm text-[#64748B] mb-6">
                Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.
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
