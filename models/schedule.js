const { model, Schema } = require('mongoose');

module.exports = model('schedule', new Schema({
    Topic: String,
    UseUntil: { type: Date, default: Date.now },
    StartUse: { type: Date, default: Date.now },
    Time1: String,
    Class1: String,
    Time2: String,
    Class2: String,
    Time3: String,
    Class3: String,
    Time4: String,
    Class4: String,
    Time5: String,
    Class5: String,
    Time6: String,
    Class6: String,
    Time7: String,
    Class7: String,
    Time8: String,
    Class8: String,
    Time9: String,
    Class9: String,
    Time10: String,
    Class10: String
}));