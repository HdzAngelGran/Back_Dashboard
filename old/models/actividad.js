const { Schema, model } = require('mongoose');

const ActividadSchema = Schema({
    materia: {
        type: Schema.Types.ObjectId,
        ref: 'Materia',
        required: true
    },
    juego: {
        type: Schema.Types.ObjectId,
        ref: 'Juego'
    },
    nombre: {
        type: String,
        required: [true, 'El nombre de la actividad es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion de la actividad es obligatoria']
    },
    objetivo: {
        type: String,
        required: [true, 'El objetivo de la actividad es obligatorio']
    },
    disponible: {
        type: Boolean,
        default: false,
        required: true
    },
    intentos: {
        type: Number,
        default: 0
    },
    tipoJuego: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});

ActividadSchema.methods.toJSON = function() {
    const { __v, estado, ...actividad } = this.toObject();
    return actividad;
}

module.exports = model('Actividad', ActividadSchema);