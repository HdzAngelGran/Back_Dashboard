const { Schema, model } = require('mongoose');

const ComentarioSchema = Schema({
    actividad: {
        type: Schema.Types.ObjectId,
        ref: 'Actividad',
        require: true
    },
    comentarios: {
        type: [Array],
        required: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
});

ComentarioSchema.methods.toJSON = function() {
    const { __v, estado, ...comentario } = this.toObject();
    return comentario;
}

module.exports = model('Comentario', ComentarioSchema);