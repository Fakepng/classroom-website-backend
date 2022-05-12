const { model, Schema } = require('mongoose');

module.exports = model('homework', new Schema({
    Subject: String,
    Topic: String,
    DateGiven: { type: Date, default: Date.now },
    DateDue: { type: Date, default: Date.now },
}));