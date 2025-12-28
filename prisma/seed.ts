import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const condominio = await prisma.condominio.create({
    data: {
      nome: 'Residencial Domus',
      endereco: 'Rua das Palmeiras, 123 - São Paulo, SP',
      cnpj: '12.345.678/0001-90'
    }
  });

  const bloco = await prisma.bloco.create({
    data: {
      nome: 'Bloco A',
      condominioId: condominio.id
    }
  });

  const unidade = await prisma.unidade.create({
    data: {
      numero: '101',
      andar: 1,
      blocoId: bloco.id
    }
  });

  const senhaCriptografada = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      nome: 'Admin Domus',
      email: 'admin@domus.com',
      senha: senhaCriptografada,
      role: 'ADMIN',
      condominioId: condominio.id
    }
  });

  const morador = await prisma.user.create({
    data: {
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: senhaCriptografada,
      role: 'MORADOR',
      telefone: '(11) 99999-9999',
      condominioId: condominio.id,
      unidadeId: unidade.id
    }
  });

  await prisma.veiculo.create({
    data: {
      placa: 'ABC-1234',
      modelo: 'Honda Civic',
      cor: 'Prata',
      moradorId: morador.id
    }
  });

  await prisma.pet.create({
    data: {
      nome: 'Rex',
      tipo: 'Cachorro',
      raca: 'Labrador',
      moradorId: morador.id
    }
  });

  await prisma.chamado.createMany({
    data: [
      { titulo: 'Lâmpada queimada no corredor', descricao: 'A lâmpada do 3º andar está queimada', tipo: 'MANUTENCAO', status: 'ABERTO', prioridade: 'MEDIA', local: 'Corredor 3º andar', criadorId: morador.id, condominioId: condominio.id },
      { titulo: 'Vazamento na garagem', descricao: 'Identificado vazamento no teto da garagem', tipo: 'MANUTENCAO', status: 'EM_ANDAMENTO', prioridade: 'ALTA', local: 'Garagem', criadorId: morador.id, condominioId: condominio.id },
      { titulo: 'Barulho excessivo no Apto 502', descricao: 'Música alta após as 22h', tipo: 'BARULHO', status: 'ABERTO', prioridade: 'MEDIA', local: 'Apto 502', criadorId: admin.id, condominioId: condominio.id },
      { titulo: 'Fechadura do portão quebrada', descricao: 'Portão social não está trancando', tipo: 'SEGURANCA', status: 'RESOLVIDO', prioridade: 'URGENTE', local: 'Portão social', criadorId: morador.id, condominioId: condominio.id }
    ]
  });

  const hoje = new Date();
  await prisma.evento.createMany({
    data: [
      { titulo: 'Assembleia Geral Ordinária', descricao: 'Aprovação de obras e prestação de contas', data: new Date(hoje.getTime() + 5 * 24 * 60 * 60 * 1000), hora: '19:00', local: 'Salão de Festas', tipo: 'ASSEMBLEIA', status: 'AGENDADO', condominioId: condominio.id },
      { titulo: 'Manutenção do Elevador', descricao: 'Manutenção preventiva mensal', data: new Date(hoje.getTime() + 2 * 24 * 60 * 60 * 1000), hora: '14:00', local: 'Elevadores', tipo: 'MANUTENCAO', status: 'AGENDADO', condominioId: condominio.id },
      { titulo: 'Vistoria Corpo de Bombeiros', descricao: 'Renovação do AVCB', data: new Date(hoje.getTime() + 15 * 24 * 60 * 60 * 1000), hora: '10:00', local: 'Todo o prédio', tipo: 'VISTORIA', status: 'AGENDADO', condominioId: condominio.id }
    ]
  });

  await prisma.prestador.createMany({
    data: [
      { nome: 'TechLift Elevadores', servico: 'Manutenção de Elevadores', telefone: '(11) 3333-4444', email: 'contato@techlift.com.br', contratoVencimento: new Date(hoje.getTime() + 60 * 24 * 60 * 60 * 1000), condominioId: condominio.id },
      { nome: 'CleanMax', servico: 'Limpeza', telefone: '(11) 2222-3333', contratoVencimento: new Date(hoje.getTime() + 90 * 24 * 60 * 60 * 1000), condominioId: condominio.id },
      { nome: 'Segurança Total', servico: 'Portaria e Vigilância', telefone: '(11) 5555-6666', contratoVencimento: new Date(hoje.getTime() + 20 * 24 * 60 * 60 * 1000), condominioId: condominio.id }
    ]
  });

  await prisma.espaco.createMany({
    data: [
      { nome: 'Salão de Festas', descricao: 'Espaço para eventos e comemorações', capacidade: 100, valorReserva: 300, regras: 'Horário máximo: 23h. Responsável pela limpeza após uso.', condominioId: condominio.id },
      { nome: 'Churrasqueira', descricao: 'Área de churrasqueira coberta', capacidade: 30, valorReserva: 150, regras: 'Horário máximo: 22h. Limpar após uso.', condominioId: condominio.id },
      { nome: 'Academia', descricao: 'Academia equipada', capacidade: 15, valorReserva: 0, regras: 'Uso de toalha obrigatório. Horário: 6h às 22h.', condominioId: condominio.id }
    ]
  });

  await prisma.aviso.createMany({
    data: [
      { titulo: 'Interrupção de Água', conteudo: 'Haverá interrupção no fornecimento de água no dia 05/01 das 8h às 12h para manutenção preventiva.', prioridade: 'URGENTE', condominioId: condominio.id },
      { titulo: 'Nova Regra de Coleta Seletiva', conteudo: 'A partir de janeiro, a coleta seletiva será realizada às terças e quintas-feiras.', prioridade: 'INFORMATIVO', condominioId: condominio.id },
      { titulo: 'Manutenção dos Elevadores', conteudo: 'Informamos que a manutenção mensal será realizada na próxima segunda-feira.', prioridade: 'MANUTENCAO', condominioId: condominio.id }
    ]
  });

  await prisma.encomenda.createMany({
    data: [
      { descricao: 'Caixa Amazon', remetente: 'Amazon', status: 'NA_PORTARIA', destinatarioId: morador.id },
      { descricao: 'Envelope Correios', remetente: 'Correios', status: 'NOTIFICADO', destinatarioId: morador.id }
    ]
  });

  await prisma.documento.createMany({
    data: [
      { nome: 'Ata Assembleia Dezembro 2024', url: '/docs/ata-dez-2024.pdf', categoria: 'ATA', visibilidade: 'TODOS', condominioId: condominio.id },
      { nome: 'Contrato Elevadores 2024', url: '/docs/contrato-elevadores.pdf', categoria: 'CONTRATO', visibilidade: 'SINDICO', condominioId: condominio.id },
      { nome: 'Balancete Novembro 2024', url: '/docs/balancete-nov-2024.pdf', categoria: 'BALANCETE', visibilidade: 'TODOS', condominioId: condominio.id }
    ]
  });

  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
