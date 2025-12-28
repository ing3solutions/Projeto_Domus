import { useState } from 'react';
import { Package, Check, Clock, Search, Plus, Building, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface Encomenda {
  id: number;
  descricao: string;
  remetente: string | null;
  status: string;
  dataRecebimento: string;
  dataEntrega: string | null;
  destinatario: { 
    nome: string; 
    unidade?: { numero: string; bloco: { nome: string } } 
  };
}

export function Encomendas() {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([
    { id: 1, descricao: 'Caixa Amazon', remetente: 'Amazon', status: 'NA_PORTARIA', dataRecebimento: new Date().toISOString(), dataEntrega: null, destinatario: { nome: 'João Silva', unidade: { numero: '101', bloco: { nome: 'Bloco A' } } } },
    { id: 2, descricao: 'Envelope Correios', remetente: 'Correios', status: 'NOTIFICADO', dataRecebimento: new Date(Date.now() - 86400000).toISOString(), dataEntrega: null, destinatario: { nome: 'Maria Santos', unidade: { numero: '202', bloco: { nome: 'Bloco B' } } } },
    { id: 3, descricao: 'Pacote Magazine Luiza', remetente: 'Magazine Luiza', status: 'ENTREGUE', dataRecebimento: new Date(Date.now() - 172800000).toISOString(), dataEntrega: new Date(Date.now() - 86400000).toISOString(), destinatario: { nome: 'Carlos Oliveira', unidade: { numero: '303', bloco: { nome: 'Bloco A' } } } }
  ]);
  const [filter, setFilter] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaEncomenda, setNovaEncomenda] = useState({ descricao: '', remetente: '', apartamento: '' });

  const handleMarcarEntregue = (id: number) => {
    setEncomendas(encomendas.map(e => 
      e.id === id ? { ...e, status: 'ENTREGUE', dataEntrega: new Date().toISOString() } : e
    ));
  };

  const handleAdicionarEncomenda = () => {
    const nova: Encomenda = {
      id: Date.now(),
      descricao: novaEncomenda.descricao,
      remetente: novaEncomenda.remetente,
      status: 'NA_PORTARIA',
      dataRecebimento: new Date().toISOString(),
      dataEntrega: null,
      destinatario: { 
        nome: 'Morador', 
        unidade: { numero: novaEncomenda.apartamento, bloco: { nome: 'Bloco A' } } 
      }
    };
    setEncomendas([nova, ...encomendas]);
    setIsModalOpen(false);
    setNovaEncomenda({ descricao: '', remetente: '', apartamento: '' });
  };

  const filteredEncomendas = encomendas.filter(e => {
    const matchesFilter = filter === 'TODOS' || e.status === filter;
    const matchesSearch = e.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.destinatario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (e.destinatario.unidade?.numero || '').includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NA_PORTARIA': return 'bg-yellow-100 text-yellow-800';
      case 'NOTIFICADO': return 'bg-blue-100 text-blue-800';
      case 'ENTREGUE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NA_PORTARIA': return 'Na Portaria';
      case 'NOTIFICADO': return 'Notificado';
      case 'ENTREGUE': return 'Entregue';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NA_PORTARIA': return <Package className="w-5 h-5" />;
      case 'NOTIFICADO': return <Clock className="w-5 h-5" />;
      case 'ENTREGUE': return <Check className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#3A5A40]">Encomendas</h1>
          <p className="text-gray-500 mt-1">Gestão de encomendas da portaria</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3A5A40] hover:bg-[#2D4830] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Encomenda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Encomenda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input 
                  type="text"
                  value={novaEncomenda.descricao}
                  onChange={(e) => setNovaEncomenda({...novaEncomenda, descricao: e.target.value})}
                  placeholder="Ex: Caixa grande, envelope, etc."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remetente</label>
                <input 
                  type="text"
                  value={novaEncomenda.remetente}
                  onChange={(e) => setNovaEncomenda({...novaEncomenda, remetente: e.target.value})}
                  placeholder="Ex: Amazon, Correios, Mercado Livre"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apartamento</label>
                <input 
                  type="text"
                  value={novaEncomenda.apartamento}
                  onChange={(e) => setNovaEncomenda({...novaEncomenda, apartamento: e.target.value})}
                  placeholder="Ex: 101, 202, etc."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
              <Button 
                onClick={handleAdicionarEncomenda}
                disabled={!novaEncomenda.descricao || !novaEncomenda.apartamento}
                className="w-full bg-[#3A5A40] hover:bg-[#2D4830] text-white"
              >
                Registrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição, morador ou apartamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157]"
          />
        </div>
        <div className="flex gap-2">
          {['TODOS', 'NA_PORTARIA', 'NOTIFICADO', 'ENTREGUE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-[#3A5A40] text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'TODOS' ? 'Todos' : getStatusText(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Encomenda</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinatário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Chegada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEncomendas.map((encomenda) => (
              <tr key={encomenda.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#588157]/10 rounded-lg flex items-center justify-center">
                      {getStatusIcon(encomenda.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{encomenda.descricao}</p>
                      {encomenda.remetente && (
                        <p className="text-sm text-gray-500">{encomenda.remetente}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-900">{encomenda.destinatario.nome}</p>
                      {encomenda.destinatario.unidade && (
                        <p className="text-sm text-gray-500">
                          {encomenda.destinatario.unidade.bloco.nome} - Apto {encomenda.destinatario.unidade.numero}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(encomenda.dataRecebimento).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(encomenda.status)}`}>
                    {getStatusText(encomenda.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {encomenda.status !== 'ENTREGUE' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMarcarEntregue(encomenda.id)}
                      className="text-[#588157] border-[#588157] hover:bg-[#588157] hover:text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Entregar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEncomendas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma encomenda encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
