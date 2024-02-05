const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// connect db
require('./db/connection');

const Users = require('./models/Users');
const Conversations = require('./models/Conversation');
const Messages = require('./models/Messages');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('welcome')
})

app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).send('Veuillez remplir tous les champs obligatoires');
    }

    const isAlreadyExist = await Users.findOne({ email });
    if (isAlreadyExist) {
      return res.status(400).send('L\'utilisateur existe déjà');
    }

    const newUser = new Users({ fullName, email });
    bcryptjs.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        // Handle bcrypt error
        return res.status(500).send('Error while hashing password');
      }

      newUser.set('password', hashedPassword);
      newUser.save()
        .then(() => res.status(200).send('User registered successfully'))
        .catch((saveError) => {
          // Handle save error
          console.error(saveError);
          res.status(500).send('Error while saving user');
        });
    });
  } catch (error) {
    // Handle other errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Veuillez remplir tous les champs obligatoires');
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).send('Identifiant incorrect');
      } else {
        const validateUser = await bcryptjs.compare(password, user.password)
        if (!validateUser) {
          return res.status(400).send('Identifiant incorrect');
        } else {
          const payload = {
            userId: user._id,
            email: user.email
          }
          const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';

          jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
            await Users.updateOne({ _id: user._id }, {
              $set: { token }
            })

            user.save();

            return res.status(200).json({
              user: { id: user._id, email: user.email, fullName: user.fullName },
              token: token
            });
          });
        }
      }
    }
  } catch (error) {
    console.log(error, 'error');
    return res.status(500).send('Internal Server Error');
  }
});

app.post('/api/conversation', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversations({ members: [senderId, receiverId] });
    await newConversation.save();

    res.status(200).send('Conversation créée');
  } catch (error) {
    console.log(error, 'Error');
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversations.find({ members: { $in: [userId] } });
    const conversationUserData = Promise.all(conversations.map(async (conversation) => {
      const receiverId = conversation.members.find((member) => member !== userId);
      const user = await Users.findById(receiverId);
      return { user: { email: user.email, fullName: user.fullName }, conversationId: conversation._id }
    }))
    res.status(200).json(await conversationUserData);
  } catch (error) {
    console.log(error, 'Error')
  }
})

app.post('/api/message', async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = '' } = req.body;

    // Validation des champs
    if (!senderId || !message) {
      return res.status(400).json({ error: 'Besoin de tous les champs' });
    }

    // Si conversationId n'est pas fourni, créer une nouvelle conversation
    if (!conversationId && receiverId) {
      const newConversation = new Conversations({ members: [senderId, receiverId] });
      await newConversation.save();
      const newMessage = new Messages({ conversationId: newConversation._id, senderId, message });
      await newMessage.save();
      return res.status(200).json({ message: 'Message Envoyé' });
    }

    // Sinon, ajouter un nouveau message à la conversation existante
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).json({ message: 'Message envoyé' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'envoi du message.' });
  }
});


app.get('/api/message/:conversationId', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    if (!conversationId === 'new') return res.status(200).json([])

    const messages = await Messages.find({ conversationId });
    const messageUserData = await Promise.all(messages.map(async (message) => {
      const user = await Users.findById(message.senderId);
      return { users: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message };
    }));

    res.status(200).json(messageUserData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des messages.' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await Users.find();
    console.log(users)
    const usersData = Promise.all(users.map(async (user) => {
      return { users: { email: user.email, fullName: user.fullName }, userId: user._id }
    }))
    res.status(200).json(await usersData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des messages.' });
  }
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
