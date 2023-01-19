const { Schema, model } = require('mongoose');

const InscritoSchema = Schema({
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    grupo: {
        type: Schema.Types.ObjectId,
        ref: 'Grupo',
        required: true
    }
});

InscritoSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Inscrito', InscritoSchema);