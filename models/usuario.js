import pkg from 'mongoose';
const { Schema, model } = pkg;

const UsuarioSchema = Schema({
    apellidoP: {
        type: String,
    },
    apellidoM: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio'],
    },
    idU: {
        type: Number,
        unique: true,
        required: [true, 'El id paterno es obligatorio']
    },
    imagen: {
        type: String,
        required: [true, 'El url de la imagen es obligatorio']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    celular: {
        type: Number,
    },
    rol: {
        rol: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: [true, 'El rol es obligatorio']
        },
        nombre: {
            type: String,
            required: [true, 'El nombre del rol es obligatorio'],
        }
    },
    sesion: {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.methods.toJSON = function() {
    const { __v, rol, ...usuario } = this.toObject();
    return {...usuario, rol: rol.nombre };
}

export default model('Usuario', UsuarioSchema);