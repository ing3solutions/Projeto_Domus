import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const app = express();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const condominioId = 1;
    
    const [chamadosAbertos, prazoProximos, contratosVencer, totalChamados, chamadosResolvidos] = await Promise.all([
      prisma.chamado.count({ where: { condominioId, status: 'ABERTO' } }),
      prisma.evento.count({ 
        where: { 
          condominioId, 
          data: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          status: 'AGENDADO'
        } 
      }),
      prisma.prestador.count({ 
        where: { 
          condominioId,
          contratoVencimento: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        } 
      }),
      prisma.chamado.count({ where: { condominioId } }),
      prisma.chamado.count({ where: { condominioId, status: 'RESOLVIDO' } })
    ]);

    const taxaResolucao = totalChamados > 0 ? Math.round((chamadosResolvidos / totalChamados) * 100) : 0;

    res.json({
      chamadosAbertos,
      prazoProximos,
      contratosVencer,
      taxaResolucao
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Atividades Recentes
app.get('/api/dashboard/atividades', async (req, res) => {
  try {
    const condominioId = 1;
    
    const [chamados, eventos, avisos] = await Promise.all([
      prisma.chamado.findMany({ 
        where: { condominioId }, 
        orderBy: { createdAt: 'desc' }, 
        take: 5,
        include: { criador: { select: { nome: true } } }
      }),
      prisma.evento.findMany({ 
        where: { condominioId }, 
        orderBy: { data: 'asc' }, 
        take: 5 
      }),
      prisma.aviso.findMany({
        where: { condominioId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const atividades = [
      ...chamados.map(c => ({
        id: `chamado-${c.id}`,
        tipo: 'chamado',
        titulo: c.titulo,
        descricao: c.descricao,
        data: c.createdAt,
        status: c.status
      })),
      ...eventos.map(e => ({
        id: `evento-${e.id}`,
        tipo: e.tipo.toLowerCase(),
        titulo: e.titulo,
        descricao: e.descricao,
        data: e.data,
        status: e.status
      })),
      ...avisos.map(a => ({
        id: `aviso-${a.id}`,
        tipo: 'aviso',
        titulo: a.titulo,
        descricao: a.conteudo,
        data: a.createdAt,
        prioridade: a.prioridade
      }))
    ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 10);

    res.json(atividades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atividades' });
  }
});

// CRUD Chamados
app.get('/api/chamados', async (req, res) => {
  try {
    const { status } = req.query;
    const where: any = { condominioId: 1 };
    if (status && status !== 'TODOS') where.status = status;
    
    const chamados = await prisma.chamado.findMany({ 
      where, 
      orderBy: { createdAt: 'desc' },
      include: { criador: { select: { nome: true } }, responsavel: { select: { nome: true } } }
    });
    res.json(chamados);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar chamados' });
  }
});

app.post('/api/chamados', async (req, res) => {
  try {
    const chamado = await prisma.chamado.create({
      data: { ...req.body, condominioId: 1, criadorId: 1 }
    });
    res.status(201).json(chamado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar chamado' });
  }
});

app.patch('/api/chamados/:id', async (req, res) => {
  try {
    const chamado = await prisma.chamado.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(chamado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar chamado' });
  }
});

app.delete('/api/chamados/:id', async (req, res) => {
  try {
    await prisma.chamado.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar chamado' });
  }
});

// CRUD Eventos/Prazos
app.get('/api/eventos', async (req, res) => {
  try {
    const eventos = await prisma.evento.findMany({ 
      where: { condominioId: 1 }, 
      orderBy: { data: 'asc' } 
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

app.post('/api/eventos', async (req, res) => {
  try {
    const evento = await prisma.evento.create({
      data: { ...req.body, condominioId: 1 }
    });
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

app.patch('/api/eventos/:id', async (req, res) => {
  try {
    const evento = await prisma.evento.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

app.delete('/api/eventos/:id', async (req, res) => {
  try {
    await prisma.evento.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar evento' });
  }
});

// CRUD Documentos
app.get('/api/documentos', async (req, res) => {
  try {
    const { categoria } = req.query;
    const where: any = { condominioId: 1 };
    if (categoria) where.categoria = categoria;
    
    const documentos = await prisma.documento.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar documentos' });
  }
});

app.post('/api/documentos', async (req, res) => {
  try {
    const documento = await prisma.documento.create({
      data: { ...req.body, condominioId: 1 }
    });
    res.status(201).json(documento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar documento' });
  }
});

app.delete('/api/documentos/:id', async (req, res) => {
  try {
    await prisma.documento.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar documento' });
  }
});

// CRUD Prestadores
app.get('/api/prestadores', async (req, res) => {
  try {
    const prestadores = await prisma.prestador.findMany({ 
      where: { condominioId: 1 }, 
      orderBy: { nome: 'asc' } 
    });
    res.json(prestadores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar prestadores' });
  }
});

app.post('/api/prestadores', async (req, res) => {
  try {
    const prestador = await prisma.prestador.create({
      data: { ...req.body, condominioId: 1 }
    });
    res.status(201).json(prestador);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar prestador' });
  }
});

app.patch('/api/prestadores/:id', async (req, res) => {
  try {
    const prestador = await prisma.prestador.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(prestador);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar prestador' });
  }
});

app.delete('/api/prestadores/:id', async (req, res) => {
  try {
    await prisma.prestador.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar prestador' });
  }
});

// CRUD Espaços e Reservas
app.get('/api/espacos', async (req, res) => {
  try {
    const espacos = await prisma.espaco.findMany({ 
      where: { condominioId: 1 },
      include: { reservas: { where: { status: 'APROVADA' } } }
    });
    res.json(espacos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar espaços' });
  }
});

app.post('/api/espacos', async (req, res) => {
  try {
    const espaco = await prisma.espaco.create({
      data: { ...req.body, condominioId: 1 }
    });
    res.status(201).json(espaco);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar espaço' });
  }
});

app.get('/api/reservas', async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({ 
      include: { 
        espaco: { select: { nome: true } }, 
        morador: { select: { nome: true, unidade: { select: { numero: true, bloco: { select: { nome: true } } } } } } 
      },
      orderBy: { data: 'desc' }
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
});

app.post('/api/reservas', async (req, res) => {
  try {
    const { espacoId, data } = req.body;
    const existente = await prisma.reserva.findFirst({
      where: { espacoId, data: new Date(data), status: { in: ['PENDENTE', 'APROVADA'] } }
    });
    
    if (existente) {
      return res.status(400).json({ error: 'Já existe uma reserva para este espaço nesta data' });
    }
    
    const reserva = await prisma.reserva.create({
      data: { ...req.body, moradorId: 1 }
    });
    res.status(201).json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar reserva' });
  }
});

app.patch('/api/reservas/:id', async (req, res) => {
  try {
    const reserva = await prisma.reserva.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar reserva' });
  }
});

// CRUD Encomendas
app.get('/api/encomendas', async (req, res) => {
  try {
    const encomendas = await prisma.encomenda.findMany({
      include: { 
        destinatario: { 
          select: { 
            nome: true, 
            unidade: { select: { numero: true, bloco: { select: { nome: true } } } } 
          } 
        } 
      },
      orderBy: { dataRecebimento: 'desc' }
    });
    res.json(encomendas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar encomendas' });
  }
});

app.post('/api/encomendas', async (req, res) => {
  try {
    const encomenda = await prisma.encomenda.create({
      data: req.body
    });
    res.status(201).json(encomenda);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar encomenda' });
  }
});

app.patch('/api/encomendas/:id/entregar', async (req, res) => {
  try {
    const encomenda = await prisma.encomenda.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'ENTREGUE', dataEntrega: new Date() }
    });
    res.json(encomenda);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao marcar encomenda como entregue' });
  }
});

// CRUD Avisos
app.get('/api/avisos', async (req, res) => {
  try {
    const avisos = await prisma.aviso.findMany({ 
      where: { condominioId: 1 }, 
      orderBy: { createdAt: 'desc' } 
    });
    res.json(avisos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avisos' });
  }
});

app.post('/api/avisos', async (req, res) => {
  try {
    const aviso = await prisma.aviso.create({
      data: { ...req.body, condominioId: 1 }
    });
    res.status(201).json(aviso);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar aviso' });
  }
});

app.delete('/api/avisos/:id', async (req, res) => {
  try {
    await prisma.aviso.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aviso' });
  }
});

// CRUD Unidades/Blocos/Moradores
app.get('/api/blocos', async (req, res) => {
  try {
    const blocos = await prisma.bloco.findMany({ 
      where: { condominioId: 1 },
      include: { 
        unidades: { 
          include: { 
            moradores: { 
              select: { id: true, nome: true, email: true, telefone: true, veiculos: true, pets: true } 
            } 
          } 
        } 
      }
    });
    res.json(blocos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar blocos' });
  }
});

app.post('/api/blocos', async (req, res) => {
  try {
    const bloco = await prisma.bloco.create({
      data: { ...req.body, condominioId: 1 }
    });
    res.status(201).json(bloco);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar bloco' });
  }
});

app.post('/api/unidades', async (req, res) => {
  try {
    const unidade = await prisma.unidade.create({
      data: req.body
    });
    res.status(201).json(unidade);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar unidade' });
  }
});

app.get('/api/moradores', async (req, res) => {
  try {
    const moradores = await prisma.user.findMany({
      where: { condominioId: 1, role: 'MORADOR' },
      include: { 
        unidade: { include: { bloco: true } },
        veiculos: true,
        pets: true
      }
    });
    res.json(moradores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar moradores' });
  }
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
