import { User, Building, Bell, Shield } from 'lucide-react';

export function Configuracoes() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#0F172A]">Configurações</h2>
        <p className="text-sm text-[#64748B] mt-1">Personalize suas preferências</p>
      </div>

      {/* Seções de Configuração */}
      <div className="space-y-4">
        {/* Perfil */}
        <div className="bg-[#DAD7CD] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#588157]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#588157]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A]">Perfil do Usuário</h3>
              <p className="text-sm text-[#64748B]">Gerencie suas informações pessoais</p>
            </div>
          </div>
          <button className="text-sm font-medium text-[#588157] hover:text-[#3A5A40] transition-colors">
            Editar perfil →
          </button>
        </div>

        {/* Condomínio */}
        <div className="bg-[#DAD7CD] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#588157]/10 flex items-center justify-center">
              <Building className="w-5 h-5 text-[#588157]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A]">Dados do Condomínio</h3>
              <p className="text-sm text-[#64748B]">Informações e documentos cadastrais</p>
            </div>
          </div>
          <button className="text-sm font-medium text-[#588157] hover:text-[#3A5A40] transition-colors">
            Ver detalhes →
          </button>
        </div>

        {/* Notificações */}
        <div className="bg-[#DAD7CD] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#588157]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#588157]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A]">Notificações</h3>
              <p className="text-sm text-[#64748B]">Configure alertas e lembretes</p>
            </div>
          </div>
          <button className="text-sm font-medium text-[#588157] hover:text-[#3A5A40] transition-colors">
            Configurar →
          </button>
        </div>

        {/* Segurança */}
        <div className="bg-[#DAD7CD] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#588157]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#588157]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A]">Segurança</h3>
              <p className="text-sm text-[#64748B]">Senha e autenticação</p>
            </div>
          </div>
          <button className="text-sm font-medium text-[#588157] hover:text-[#3A5A40] transition-colors">
            Gerenciar →
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#588157]/10 border border-[#588157]/20 rounded-xl p-4">
        <p className="text-sm text-[#64748B]">
          <span className="font-medium text-[#0F172A]">SíndCondo</span> - Versão 1.0.0
        </p>
      </div>
    </div>
  );
}
