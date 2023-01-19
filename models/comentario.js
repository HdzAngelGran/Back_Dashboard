import pkg from 'mongoose';
const { Schema, model } = pkg;

const ComentarioSchema = Schema({
    fecha: {
        type: String,
        required: [true, 'La fecha del comentario es obligatoria']
    },
    comentario: {
        type: String,
        required: [true, 'El comentario es obligatorio']
    },
    mensajePrincipal: {
        type: Schema.Types.ObjectId,
        ref: 'Mensaje',
        required: [true, 'El mensaje principal es obligatorio']
    },
    usuario: {
        type: String,
        required: [true, 'El nombre del usuario es obligatorio']
    }
});

ComentarioSchema.methods.toJSON = function() {
    const { __v, _id, ...comentario } = this.toObject();
    return comentario;
}

export default model('Comentario', ComentarioSchema);