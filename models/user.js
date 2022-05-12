const { model, Schema } = require('mongoose');

module.exports = model('user', new Schema({
    user: String,
    password: String,
    token: String,
}));