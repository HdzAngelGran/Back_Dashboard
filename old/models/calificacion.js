const { Schema, model } = require('mongoose');

const CalificacionSchema = Schema({
    actividad: {
        type: Schema.Types.ObjectId,
        ref: 'Actividad',
        required: true
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    realizada: {
        type: Boolean,
        default: false
    },
    calificacion: {
        type: Number,
        default: -1
    },
    intentos: {
        type: Number,
        required: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
});

CalificacionSchema.methods.toJSON = function() {
    const { __v, estado, ...calificacion } = this.toObject();
    return calificacion;
}

module.exports = model('Calificacion', CalificacionSchema);