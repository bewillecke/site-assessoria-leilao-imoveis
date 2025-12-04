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
const USERS_PATH = path.join(process.cwd(), 'server', 'data', 'users.json');
const COMMENTS_PATH = path.join(process.cwd(), 'server', 'data', 'comments.json');

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

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeUsers(arr) {
  const data = JSON.stringify(arr, null, 2);
  await fs.writeFile(USERS_PATH, data, 'utf-8');
}

async function readComments() {
  try {
    const raw = await fs.readFile(COMMENTS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeComments(arr) {
  const data = JSON.stringify(arr, null, 2);
  await fs.writeFile(COMMENTS_PATH, data, 'utf-8');
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

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, sexo, idade } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    
    const users = await readUsers();
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, hash this!
      sexo,
      idade,
      role: 'user',
      favorites: []
    };

    users.push(newUser);
    await writeUsers(users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readUsers();
    const user = users.find(u => (u.email === email || u.username === email) && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.post('/api/users/:id/favorites', async (req, res) => {
  try {
    const { id } = req.params;
    const { imovelId } = req.body;
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = users[userIndex];
    if (!user.favorites) user.favorites = [];

    const favIndex = user.favorites.indexOf(imovelId);
    if (favIndex === -1) {
      user.favorites.push(imovelId);
    } else {
      user.favorites.splice(favIndex, 1);
    }

    users[userIndex] = user;
    await writeUsers(users);
    res.json(user.favorites);
  } catch (err) {
    console.error('Favorites error', err);
    res.status(500).json({ error: 'Erro ao atualizar favoritos' });
  }
});

app.get('/api/users/:id/favorites', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await readUsers();
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const users = await readUsers();
    const imoveis = await readImoveis();
    
    // Calculate most favorited
    const favCounts = {};
    users.forEach(u => {
      if (u.favorites) {
        u.favorites.forEach(fid => {
          favCounts[fid] = (favCounts[fid] || 0) + 1;
        });
      }
    });

    const topFavorites = Object.entries(favCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => {
        const imovel = imoveis.find(i => i.id === Number(id));
        return { ...imovel, count };
      });

    res.json({
      totalUsers: users.length,
      totalImoveis: imoveis.length,
      topFavorites
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Comments Routes
app.get('/api/comments', async (req, res) => {
  try {
    const { imovelId, status } = req.query;
    let comments = await readComments();
    
    if (imovelId) {
      comments = comments.filter(c => c.imovelId === Number(imovelId));
    }
    
    if (status) {
      comments = comments.filter(c => c.status === status);
    }
    
    res.json(comments);
  } catch (err) {
    console.error('GET /api/comments error', err);
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { imovelId, userId, userName, rating, texto } = req.body;
    
    if (!imovelId || !userId || !userName || !rating || !texto) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating deve ser entre 1 e 5' });
    }
    
    const comments = await readComments();
    const newComment = {
      id: Date.now(),
      imovelId: Number(imovelId),
      userId,
      userName,
      rating: Number(rating),
      texto,
      data: new Date().toISOString(),
      status: 'pending' // pending, approved, rejected
    };
    
    comments.push(newComment);
    await writeComments(comments);
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error('POST /api/comments error', err);
    res.status(500).json({ error: 'Erro ao criar comentário' });
  }
});

app.patch('/api/comments/:id/approve', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const comments = await readComments();
    const comment = comments.find(c => c.id === id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    comment.status = 'approved';
    await writeComments(comments);
    
    res.json(comment);
  } catch (err) {
    console.error('PATCH /api/comments/:id/approve error', err);
    res.status(500).json({ error: 'Erro ao aprovar comentário' });
  }
});

app.patch('/api/comments/:id/reject', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const comments = await readComments();
    const comment = comments.find(c => c.id === id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    comment.status = 'rejected';
    await writeComments(comments);
    
    res.json(comment);
  } catch (err) {
    console.error('PATCH /api/comments/:id/reject error', err);
    res.status(500).json({ error: 'Erro ao rejeitar comentário' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const comments = await readComments();
    const index = comments.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    
    const deletado = comments.splice(index, 1)[0];
    await writeComments(comments);
    
    res.json({ message: 'Comentário deletado com sucesso', comment: deletado });
  } catch (err) {
    console.error('DELETE /api/comments/:id error', err);
    res.status(500).json({ error: 'Erro ao deletar comentário' });
  }
});

app.get('/api/imoveis/:id/rating', async (req, res) => {
  try {
    const imovelId = Number(req.params.id);
    const comments = await readComments();
    const approvedComments = comments.filter(c => 
      c.imovelId === imovelId && c.status === 'approved'
    );
    
    if (approvedComments.length === 0) {
      return res.json({ averageRating: 0, totalRatings: 0 });
    }
    
    const sum = approvedComments.reduce((acc, c) => acc + c.rating, 0);
    const averageRating = sum / approvedComments.length;
    
    res.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: approvedComments.length
    });
  } catch (err) {
    console.error('GET /api/imoveis/:id/rating error', err);
    res.status(500).json({ error: 'Erro ao buscar rating' });
  }
});

app.listen(PORT, () => {
  console.log(`Imoveis server listening on http://localhost:${PORT}`);
});
