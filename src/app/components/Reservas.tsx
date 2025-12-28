import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Plus, X, Check, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface Espaco {
  id: number;
  nome: string;
  descricao: string | null;
  capacidade: number | null;
  valorReserva: number | null;
  regras: string | null;
  imagem: string | null;
}

interface Reserva {
  id: number;
  data: string;
  horarioInicio: string | null;
  horarioFim: string | null;
  status: string;
  observacao: string | null;
  espaco: { nome: string };
  morador: { nome: string; unidade?: { numero: string; bloco: { nome: string } } };
}

const API_URL = '';

export function Reservas() {
  const [espacos, setEspacos] = useState<Espaco[]>([
    { id: 1, nome: 'Salão de Festas', descricao: 'Espaço para eventos e comemorações', capacidade: 100, valorReserva: 300, regras: 'Horário máximo: 23h', imagem: null },
    { id: 2, nome: 'Churrasqueira', descricao: 'Área de churrasqueira coberta', capacidade: 30, valorReserva: 150, regras: 'Horário máximo: 22h', imagem: null },
    { id: 3, nome: 'Academia', descricao: 'Academia equipada', capacidade: 15, valorReserva: 0, regras: 'Uso de toalha obrigatório', imagem: null }
  ]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [selectedEspaco, setSelectedEspaco] = useState<Espaco | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [observacao, setObservacao] = useState('');

  const handleReservar = async () => {
    if (!selectedEspaco || !selectedDate) return;
    
    const novaReserva: Reserva = {
      id: Date.now(),
      data: selectedDate,
      horarioInicio: '08:00',
      horarioFim: '18:00',
      status: 'PENDENTE',
      observacao,
      espaco: { nome: selectedEspaco.nome },
      morador: { nome: 'João Silva', unidade: { numero: '101', bloco: { nome: 'Bloco A' } } }
    };
    
    setReservas([novaReserva, ...reservas]);
    setIsModalOpen(false);
    setSelectedDate('');
    setObservacao('');
    setSelectedEspaco(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROVADA': return 'bg-green-100 text-green-800';
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
      case 'REJEITADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APROVADA': return 'Aprovada';
      case 'PENDENTE': return 'Pendente';
      case 'REJEITADA': return 'Rejeitada';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#3A5A40]">Reservas</h1>
          <p className="text-gray-500 mt-1">Gerencie as reservas de áreas comuns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {espacos.map((espaco) => (
          <div key={espaco.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gradient-to-br from-[#588157] to-[#3A5A40] flex items-center justify-center">
              <MapPin className="w-16 h-16 text-white/50" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900">{espaco.nome}</h3>
              <p className="text-gray-500 text-sm mt-1">{espaco.descricao}</p>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{espaco.capacidade} pessoas</span>
                </div>
                {espaco.valorReserva && espaco.valorReserva > 0 && (
                  <div className="text-[#588157] font-medium">
                    R$ {espaco.valorReserva}
                  </div>
                )}
              </div>

              <Dialog open={isModalOpen && selectedEspaco?.id === espaco.id} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (open) setSelectedEspaco(espaco);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full mt-4 bg-[#3A5A40] hover:bg-[#2D4830] text-white"
                    onClick={() => setSelectedEspaco(espaco)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reservar {espaco.nome}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data da Reserva</label>
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                      <textarea 
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder="Ex: Festa de aniversário, 50 convidados"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] h-24 resize-none"
                      />
                    </div>
                    {espaco.regras && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                          <strong>Regras:</strong> {espaco.regras}
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleReservar}
                      disabled={!selectedDate}
                      className="w-full bg-[#3A5A40] hover:bg-[#2D4830] text-white"
                    >
                      Confirmar Reserva
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

      {reservas.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Minhas Reservas</h2>
          <div className="space-y-3">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#588157]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#588157]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{reserva.espaco.nome}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(reserva.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reserva.status)}`}>
                  {getStatusText(reserva.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
