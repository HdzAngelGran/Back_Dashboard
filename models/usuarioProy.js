import pkg from 'mongoose';
const { Schema, model } = pkg;

const UsuarioProySchema = Schema({
    idP: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
        required: [true, 'El idP es obligatorio']
    },
    idU: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El idU es obligatorio']
    },
    rol: {
        type: String
    }
});

UsuarioProySchema.methods.toJSON = function() {
    const { __v, ...usuarioProy } = this.toObject();
    return usuarioProy;
}

export default model('UsuarioProy', UsuarioProySchema);