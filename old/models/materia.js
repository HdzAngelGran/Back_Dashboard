const { Schema, model } = require('mongoose');

const MateriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    color: {
        type: String,
        required: [true, 'Elige un color']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    grupo: {
        type: Schema.Types.ObjectId,
        ref: 'Grupo',
        required: true
    }
});

MateriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Materia', MateriaSchema);