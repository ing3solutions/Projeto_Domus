import { useState } from 'react';
import { Megaphone, AlertTriangle, Wrench, Info, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface Aviso {
  id: number;
  titulo: string;
  conteudo: string;
  prioridade: string;
  dataExpiracao: string | null;
  createdAt: string;
}

export function Avisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([
    { id: 1, titulo: 'Interrupção de Água', conteudo: 'Haverá interrupção no fornecimento de água no dia 05/01 das 8h às 12h para manutenção preventiva.', prioridade: 'URGENTE', dataExpiracao: null, createdAt: new Date().toISOString() },
    { id: 2, titulo: 'Manutenção dos Elevadores', conteudo: 'Informamos que a manutenção mensal será realizada na próxima segunda-feira. Favor utilizar as escadas durante o período.', prioridade: 'MANUTENCAO', dataExpiracao: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, titulo: 'Nova Regra de Coleta Seletiva', conteudo: 'A partir de janeiro, a coleta seletiva será realizada às terças e quintas-feiras. Separe corretamente seu lixo.', prioridade: 'INFORMATIVO', dataExpiracao: null, createdAt: new Date(Date.now() - 172800000).toISOString() }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoAviso, setNovoAviso] = useState({ titulo: '', conteudo: '', prioridade: 'INFORMATIVO' });
  const [filter, setFilter] = useState('TODOS');

  const handleCriarAviso = () => {
    const novo: Aviso = {
      id: Date.now(),
      titulo: novoAviso.titulo,
      conteudo: novoAviso.conteudo,
      prioridade: novoAviso.prioridade,
      dataExpiracao: null,
      createdAt: new Date().toISOString()
    };
    setAvisos([novo, ...avisos]);
    setIsModalOpen(false);
    setNovoAviso({ titulo: '', conteudo: '', prioridade: 'INFORMATIVO' });
  };

  const handleDeletarAviso = (id: number) => {
    setAvisos(avisos.filter(a => a.id !== id));
  };

  const getPrioridadeStyle = (prioridade: string) => {
    switch (prioridade) {
      case 'URGENTE': return { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', badge: 'bg-red-100 text-red-800' };
      case 'MANUTENCAO': return { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-800' };
      case 'INFORMATIVO': return { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-500', badge: 'bg-green-100 text-green-800' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-500', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPrioridadeIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'URGENTE': return <AlertTriangle className="w-5 h-5" />;
      case 'MANUTENCAO': return <Wrench className="w-5 h-5" />;
      case 'INFORMATIVO': return <Info className="w-5 h-5" />;
      default: return <Megaphone className="w-5 h-5" />;
    }
  };

  const getPrioridadeText = (prioridade: string) => {
    switch (prioridade) {
      case 'URGENTE': return 'Urgente';
      case 'MANUTENCAO': return 'Manutenção';
      case 'INFORMATIVO': return 'Informativo';
      default: return prioridade;
    }
  };

  const filteredAvisos = avisos.filter(a => filter === 'TODOS' || a.prioridade === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#3A5A40]">Mural de Avisos</h1>
          <p className="text-gray-500 mt-1">Comunicados e avisos do condomínio</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3A5A40] hover:bg-[#2D4830] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Aviso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Novo Aviso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input 
                  type="text"
                  value={novoAviso.titulo}
                  onChange={(e) => setNovoAviso({...novoAviso, titulo: e.target.value})}
                  placeholder="Ex: Aviso sobre manutenção"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
                <textarea 
                  value={novoAviso.conteudo}
                  onChange={(e) => setNovoAviso({...novoAviso, conteudo: e.target.value})}
                  placeholder="Descreva o aviso em detalhes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] h-32 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'INFORMATIVO', label: 'Informativo', color: 'bg-green-100 text-green-800 border-green-200' },
                    { value: 'MANUTENCAO', label: 'Manutenção', color: 'bg-amber-100 text-amber-800 border-amber-200' },
                    { value: 'URGENTE', label: 'Urgente', color: 'bg-red-100 text-red-800 border-red-200' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNovoAviso({...novoAviso, prioridade: option.value})}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        novoAviso.prioridade === option.value 
                          ? option.color + ' ring-2 ring-offset-1' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleCriarAviso}
                disabled={!novoAviso.titulo || !novoAviso.conteudo}
                className="w-full bg-[#3A5A40] hover:bg-[#2D4830] text-white"
              >
                Publicar Aviso
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        {['TODOS', 'URGENTE', 'MANUTENCAO', 'INFORMATIVO'].map((prioridade) => (
          <button
            key={prioridade}
            onClick={() => setFilter(prioridade)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === prioridade 
                ? 'bg-[#3A5A40] text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {prioridade === 'TODOS' ? 'Todos' : getPrioridadeText(prioridade)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAvisos.map((aviso) => {
          const style = getPrioridadeStyle(aviso.prioridade);
          return (
            <div key={aviso.id} className={`${style.bg} ${style.border} border rounded-2xl p-5 transition-all hover:shadow-md`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.icon} bg-white`}>
                    {getPrioridadeIcon(aviso.prioridade)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{aviso.titulo}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                        {getPrioridadeText(aviso.prioridade)}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{aviso.conteudo}</p>
                    <p className="text-sm text-gray-500 mt-3">
                      Publicado em {new Date(aviso.createdAt).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletarAviso(aviso.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredAvisos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Nenhum aviso encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
