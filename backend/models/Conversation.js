const mongoose = require('mongoose');

const conversationShema = mongoose.Schema({
    members: {
        type: Array,
        required: true,
    }
})

const Conversation = mongoose.model('Conversation', conversationShema);

module.exports = Conversation;