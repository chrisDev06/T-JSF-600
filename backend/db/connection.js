const mongoose = require('mongoose');

const url = `mongodb+srv://christopherChat:Manon@christopher.cnpn748.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url, {
})
    .then(() => console.log('Connected to DB'))
    .catch((e) => console.log('Error', e))