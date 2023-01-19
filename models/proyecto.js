import pkg from 'mongoose';
const { Schema, model } = pkg;

const ProyectoSchema = Schema({
    idP: {
        type: Number
    },
    idJ: {
        type: Number,
        required: [true, 'El id de Jira es obligatorio'],
        unique: true
    },
    imagen: {
        type: String,
        required: [true, 'El url de la imagen es obligatorio']
    },
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es obligatorio']
    },
    idPR: {
        type: Schema.Types.ObjectId,
        unique: true,
        ref: 'ProyectoRecord',
        required: [true, 'El id de record de proyecto es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});

ProyectoSchema.methods.toJSON = function() {
    const { __v, _id, ...proyecto } = this.toObject();
    return proyecto;
}

export default model('Proyecto', ProyectoSchema);