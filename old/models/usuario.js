const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidoP: {
        type: String,
        required: [true, 'El apellido paterno es obligatorio']
    },
    apellidoM: {
        type: String,
        required: [true, 'El apellido materno es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    rol: {
        type: String,
        required: true,
        default: 'EST_ROLE',
        emun: ['PRO_ROLE', 'EST_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);