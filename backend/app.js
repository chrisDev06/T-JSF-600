const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// connect db
require('./db/connection');

const Users = require('./models/Users');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
            if (err) {
              return res.status(500).send('Error while creating JWT token');
            }

            await Users.updateOne({ _id: user._id }, {
              $set: { token }
            });

            return res.status(200).json({ user: { email: user.email, fullName: user.fullName }, token: user.token });
          });
        }
      }
    }
  } catch (error) {
    console.log(error, 'error');
    return res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
