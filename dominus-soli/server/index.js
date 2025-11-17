import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'public')));

const IMOVEIS_PATH = path.join(process.cwd(), 'public', 'imoveis.json');
const MENSAGENS_PATH = path.join(process.cwd(), 'public', 'mensagens.json');

async function readImoveis() {
  const raw = await fs.readFile(IMOVEIS_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeImoveis(arr) {
  const data = JSON.stringify(arr, null, 2);
  await fs.writeFile(IMOVEIS_PATH, data, 'utf-8');
}

async function readMensagens() {
  try {
    const raw = await fs.readFile(MENSAGENS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeMensagens(arr) {
  const data = JSON.stringify(arr, null, 2);
  await fs.writeFile(MENSAGENS_PATH, data, 'utf-8');
}

app.get('/api/imoveis', async (req, res) => {
  try {
    const imoveis = await readImoveis();
    res.json(imoveis);
  } catch (err) {
    console.error('GET /api/imoveis error', err);
    res.status(500).json({ error: 'Erro ao ler imoveis' });
  }
});

app.get('/api/imoveis/:id', async (req, res) => {
  try {
    const imoveis = await readImoveis();
    const imovel = imoveis.find(im => im.id === Number(req.params.id));
    if (!imovel) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }
    res.json(imovel);
  } catch (err) {
    console.error('GET /api/imoveis/:id error', err);
    res.status(500).json({ error: 'Erro ao ler imóvel' });
  }
});

app.get('/', (req, res) => {
  res.send('Imoveis server running. Use /api/imoveis to see data.');
});

app.post('/api/imoveis', async (req, res) => {
  try {
    const novo = req.body;

    const required = ['foto','cidade_estado','endereco','tamanho_m2','quartos','banheiros','preco','data_leilao','latitude','longitude'];
    for (const f of required) {
      if (novo[f] === undefined || novo[f] === null || String(novo[f]).trim() === '') {
        return res.status(400).json({ error: `Campo ${f} é obrigatório` });
      }
    }

    const imoveis = await readImoveis();
    const nextId = imoveis.length > 0 ? (imoveis[imoveis.length-1].id || imoveis.length) + 1 : 1;
    const novoComId = { id: nextId, ...novo };
    imoveis.push(novoComId);
    await writeImoveis(imoveis);
    res.status(201).json(novoComId);
  } catch (err) {
    console.error('POST /api/imoveis error', err);
    res.status(500).json({ error: 'Erro ao salvar imóvel' });
  }
});

app.get('/api/mensagens', async (req, res) => {
  try {
    const mensagens = await readMensagens();
    res.json(mensagens);
  } catch (err) {
    console.error('GET /api/mensagens error', err);
    res.status(500).json({ error: 'Erro ao ler mensagens' });
  }
});

app.post('/api/mensagens', async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const mensagens = await readMensagens();
    const novaMensagem = {
      id: mensagens.length > 0 ? mensagens[mensagens.length - 1].id + 1 : 1,
      nome,
      email,
      mensagem,
      data: new Date().toISOString(),
      lida: false
    };

    mensagens.push(novaMensagem);
    await writeMensagens(mensagens);
    res.status(201).json(novaMensagem);
  } catch (err) {
    console.error('POST /api/mensagens error', err);
    res.status(500).json({ error: 'Erro ao salvar mensagem' });
  }
});

app.patch('/api/mensagens/:id/lida', async (req, res) => {
  try {
    const mensagens = await readMensagens();
    const mensagem = mensagens.find(m => m.id === Number(req.params.id));
    
    if (!mensagem) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    mensagem.lida = true;
    await writeMensagens(mensagens);
    res.json(mensagem);
  } catch (err) {
    console.error('PATCH /api/mensagens/:id/lida error', err);
    res.status(500).json({ error: 'Erro ao atualizar mensagem' });
  }
});

app.listen(PORT, () => {
  console.log(`Imoveis server listening on http://localhost:${PORT}`);
});
