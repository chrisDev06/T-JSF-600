const express = require('express');

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
