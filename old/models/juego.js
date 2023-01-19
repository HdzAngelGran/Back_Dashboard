const { Schema, model } = require('mongoose');

const JuegoSchema = Schema({
    actividad: {
        type: Schema.Types.ObjectId,
        ref: 'Actividad',
        require: true
    },
    profesor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    codigo: {
        type: String,
        default: ''
    },
    respuesta: {
        type: String,
        default: '',
    },
    blocked: {
        type: Boolean,
        default: false,
        require: true
    },
    tiempo: {
        type: Number
    },
    estado: {
        type: Boolean,
        require: true,
        default: true
    }
});

JuegoSchema.methods.toJSON = function() {
    const { __v, estado, ...juego } = this.toObject();
    return juego;
}

module.exports = model('Juego', JuegoSchema);