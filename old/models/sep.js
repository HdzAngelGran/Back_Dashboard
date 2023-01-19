const { Schema, model } = require('mongoose');

const SepSchema = Schema({
    grado: {
        type: Number,
        required: [true, 'El grado es obligatorio'],
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    }
});

SepSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Sep', SepSchema);