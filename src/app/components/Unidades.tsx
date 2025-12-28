import { useState } from 'react';
import { Building, Home, User, Car, Dog, Plus, ChevronDown, ChevronRight, Phone, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface Pet {
  id: number;
  nome: string;
  tipo: string | null;
  raca: string | null;
}

interface Veiculo {
  id: number;
  placa: string;
  modelo: string | null;
  cor: string | null;
}

interface Morador {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  veiculos: Veiculo[];
  pets: Pet[];
}

interface Unidade {
  id: number;
  numero: string;
  andar: number | null;
  moradores: Morador[];
}

interface Bloco {
  id: number;
  nome: string;
  unidades: Unidade[];
}

export function Unidades() {
  const [blocos, setBlocos] = useState<Bloco[]>([
    { 
      id: 1, 
      nome: 'Bloco A', 
      unidades: [
        { 
          id: 1, 
          numero: '101', 
          andar: 1, 
          moradores: [
            { 
              id: 1, 
              nome: 'João Silva', 
              email: 'joao@email.com', 
              telefone: '(11) 99999-9999',
              veiculos: [{ id: 1, placa: 'ABC-1234', modelo: 'Honda Civic', cor: 'Prata' }],
              pets: [{ id: 1, nome: 'Rex', tipo: 'Cachorro', raca: 'Labrador' }]
            }
          ]
        },
        { 
          id: 2, 
          numero: '102', 
          andar: 1, 
          moradores: [
            { 
              id: 2, 
              nome: 'Maria Santos', 
              email: 'maria@email.com', 
              telefone: '(11) 98888-8888',
              veiculos: [],
              pets: []
            }
          ]
        },
        { 
          id: 3, 
          numero: '201', 
          andar: 2, 
          moradores: []
        }
      ]
    },
    { 
      id: 2, 
      nome: 'Bloco B', 
      unidades: [
        { 
          id: 4, 
          numero: '101', 
          andar: 1, 
          moradores: [
            { 
              id: 3, 
              nome: 'Carlos Oliveira', 
              email: 'carlos@email.com', 
              telefone: '(11) 97777-7777',
              veiculos: [{ id: 2, placa: 'XYZ-5678', modelo: 'Toyota Corolla', cor: 'Preto' }],
              pets: []
            }
          ]
        }
      ]
    }
  ]);
  const [expandedBlocos, setExpandedBlocos] = useState<number[]>([1]);
  const [expandedUnidades, setExpandedUnidades] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoBloco, setNovoBloco] = useState('');

  const toggleBloco = (id: number) => {
    setExpandedBlocos(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleUnidade = (id: number) => {
    setExpandedUnidades(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const handleCriarBloco = () => {
    const novo: Bloco = {
      id: Date.now(),
      nome: novoBloco,
      unidades: []
    };
    setBlocos([...blocos, novo]);
    setIsModalOpen(false);
    setNovoBloco('');
  };

  const getTotalMoradores = () => {
    return blocos.reduce((acc, bloco) => 
      acc + bloco.unidades.reduce((uAcc, unidade) => uAcc + unidade.moradores.length, 0), 0
    );
  };

  const getTotalUnidades = () => {
    return blocos.reduce((acc, bloco) => acc + bloco.unidades.length, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#3A5A40]">Unidades & Moradores</h1>
          <p className="text-gray-500 mt-1">Cadastro de blocos, unidades e moradores</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3A5A40] hover:bg-[#2D4830] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Bloco
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Bloco</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Bloco</label>
                <input 
                  type="text"
                  value={novoBloco}
                  onChange={(e) => setNovoBloco(e.target.value)}
                  placeholder="Ex: Bloco C, Torre Norte"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157]"
                />
              </div>
              <Button 
                onClick={handleCriarBloco}
                disabled={!novoBloco}
                className="w-full bg-[#3A5A40] hover:bg-[#2D4830] text-white"
              >
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#588157]/10 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-[#588157]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{blocos.length}</p>
              <p className="text-sm text-gray-500">Blocos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#588157]/10 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-[#588157]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{getTotalUnidades()}</p>
              <p className="text-sm text-gray-500">Unidades</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#588157]/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[#588157]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{getTotalMoradores()}</p>
              <p className="text-sm text-gray-500">Moradores</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {blocos.map((bloco) => (
          <div key={bloco.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleBloco(bloco.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3A5A40] rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{bloco.nome}</h3>
                  <p className="text-sm text-gray-500">{bloco.unidades.length} unidades</p>
                </div>
              </div>
              {expandedBlocos.includes(bloco.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedBlocos.includes(bloco.id) && (
              <div className="border-t border-gray-100">
                {bloco.unidades.map((unidade) => (
                  <div key={unidade.id} className="border-b border-gray-50 last:border-b-0">
                    <button
                      onClick={() => toggleUnidade(unidade.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Home className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Apto {unidade.numero}</p>
                          <p className="text-sm text-gray-500">{unidade.moradores.length} morador(es)</p>
                        </div>
                      </div>
                      {expandedUnidades.includes(unidade.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {expandedUnidades.includes(unidade.id) && unidade.moradores.length > 0 && (
                      <div className="bg-gray-50 px-5 py-3 space-y-3">
                        {unidade.moradores.map((morador) => (
                          <div key={morador.id} className="bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#588157] to-[#3A5A40] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {morador.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{morador.nome}</h4>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                                  {morador.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {morador.email}
                                    </span>
                                  )}
                                  {morador.telefone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {morador.telefone}
                                    </span>
                                  )}
                                </div>

                                {(morador.veiculos.length > 0 || morador.pets.length > 0) && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {morador.veiculos.map((veiculo) => (
                                      <span key={veiculo.id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                                        <Car className="w-3 h-3" />
                                        {veiculo.placa} - {veiculo.modelo}
                                      </span>
                                    ))}
                                    {morador.pets.map((pet) => (
                                      <span key={pet.id} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs">
                                        <Dog className="w-3 h-3" />
                                        {pet.nome} ({pet.raca})
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {expandedUnidades.includes(unidade.id) && unidade.moradores.length === 0 && (
                      <div className="bg-gray-50 px-5 py-4 text-center text-gray-500 text-sm">
                        Nenhum morador cadastrado
                      </div>
                    )}
                  </div>
                ))}

                {bloco.unidades.length === 0 && (
                  <div className="px-5 py-8 text-center text-gray-500">
                    Nenhuma unidade cadastrada neste bloco
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
