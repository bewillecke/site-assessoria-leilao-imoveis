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

async function readImoveis() {
  const raw = await fs.readFile(IMOVEIS_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeImoveis(arr) {
  const data = JSON.stringify(arr, null, 2);
  await fs.writeFile(IMOVEIS_PATH, data, 'utf-8');
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

app.listen(PORT, () => {
  console.log(`Imoveis server listening on http://localhost:${PORT}`);
});
