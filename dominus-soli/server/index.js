import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'public')));

const IMOVEIS_PATH = path.join(process.cwd(), 'public', 'imoveis.json');
const MENSAGENS_PATH = path.join(process.cwd(), 'public', 'mensagens.json');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'seu-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'sua-senha-app'
  }
});

async function enviarEmailResposta(destinatario, nomeCliente, mensagemOriginal, respostaTexto) {
  try {
    const mailOptions = {
      from: `"Dominus Soli" <${process.env.EMAIL_USER || 'seu-email@gmail.com'}>`,
      to: destinatario,
      subject: 'Resposta da Dominus Soli - Assessoria em Leilão de Imóveis',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #11397a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🏠 Dominus Soli</h1>
            <p style="color: #e6b952; margin: 5px 0 0 0;">Assessoria em Leilão de Imóveis</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #11397a; margin-top: 0;">Olá, ${nomeCliente}! 👋</h2>
            
            <p style="color: #333; line-height: 1.6;">Obrigado por entrar em contato conosco! Temos uma resposta para você:</p>
            
            <div style="background-color: #f0f7ff; border-left: 4px solid #11397a; padding: 15px; margin: 20px 0;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;"><strong>Sua mensagem:</strong></p>
              <p style="color: #333; margin: 0; font-style: italic;">${mensagemOriginal}</p>
            </div>
            
            <div style="background-color: #fff8e6; border-left: 4px solid #e6b952; padding: 15px; margin: 20px 0;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;"><strong>Nossa resposta:</strong></p>
              <p style="color: #333; margin: 0; white-space: pre-wrap;">${respostaTexto}</p>
            </div>
            
            <p style="color: #333; line-height: 1.6;">Se você tiver mais dúvidas, não hesite em nos contatar novamente!</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
            
            <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
              <strong>Dominus Soli</strong> - Assessoria em Leilão de Imóveis<br/>
              📧 Email: contato@dominussoli.com.br | 📱 WhatsApp: (11) 99999-9999
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error: error.message };
  }
}

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

app.put('/api/imoveis/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;

    const imoveis = await readImoveis();
    const index = imoveis.findIndex(im => im.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }

    imoveis[index] = { ...imoveis[index], ...updates, id };
    await writeImoveis(imoveis);
    res.json(imoveis[index]);
  } catch (err) {
    console.error('PUT /api/imoveis/:id error', err);
    res.status(500).json({ error: 'Erro ao atualizar imóvel' });
  }
});

app.delete('/api/imoveis/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const imoveis = await readImoveis();
    const index = imoveis.findIndex(im => im.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Imóvel não encontrado' });
    }

    const deletado = imoveis.splice(index, 1)[0];
    await writeImoveis(imoveis);
    res.json({ message: 'Imóvel deletado com sucesso', imovel: deletado });
  } catch (err) {
    console.error('DELETE /api/imoveis/:id error', err);
    res.status(500).json({ error: 'Erro ao deletar imóvel' });
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

app.post('/api/mensagens/:id/responder', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { resposta } = req.body;

    if (!resposta) {
      return res.status(400).json({ error: 'Resposta é obrigatória' });
    }

    const mensagens = await readMensagens();
    const mensagem = mensagens.find(m => m.id === id);
    
    if (!mensagem) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    mensagem.resposta = resposta;
    mensagem.dataResposta = new Date().toISOString();
    mensagem.lida = true;
    
    const emailResult = await enviarEmailResposta(
      mensagem.email,
      mensagem.nome,
      mensagem.mensagem,
      resposta
    );
    
    mensagem.emailEnviado = emailResult.success;
    
    await writeMensagens(mensagens);
    res.json({ 
      ...mensagem, 
      emailStatus: emailResult.success ? 'E-mail enviado com sucesso!' : 'Resposta salva, mas e-mail não foi enviado'
    });
  } catch (err) {
    console.error('POST /api/mensagens/:id/responder error', err);
    res.status(500).json({ error: 'Erro ao responder mensagem' });
  }
});

app.delete('/api/mensagens/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const mensagens = await readMensagens();
    const index = mensagens.findIndex(m => m.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    const deletada = mensagens.splice(index, 1)[0];
    await writeMensagens(mensagens);
    res.json({ message: 'Mensagem deletada com sucesso', mensagem: deletada });
  } catch (err) {
    console.error('DELETE /api/mensagens/:id error', err);
    res.status(500).json({ error: 'Erro ao deletar mensagem' });
  }
});

app.listen(PORT, () => {
  console.log(`Imoveis server listening on http://localhost:${PORT}`);
});
