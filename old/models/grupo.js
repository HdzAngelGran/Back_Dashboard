const { Schema, model } = require('mongoose');

const GrupoSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    grado: {
        type: Number,
        required: [true, 'El grado es obligatorio']
    },
    grupo: {
        type: String,
        required: [true, 'El grupo es obligatorio']
    },
    saludo: {
        type: String,
        required: [true, 'El saludo es obligatorio']
    },
    disponible: {
        type: Boolean,
        default: false,
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});

GrupoSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Grupo', GrupoSchema);