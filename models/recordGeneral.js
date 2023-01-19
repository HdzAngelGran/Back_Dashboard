import pkg from 'mongoose';
const { Schema, model } = pkg;

const RecordGeneralSchema = Schema({
    fecha: {
        type: String,
        unique: true,
        required: [true, 'La fecha de la imagen es obligatorio']
    },
    proyectos: {
        type: Number,
        required: [true, 'El número de proyectos es obligatorio']
    },
    clientes: {
        type: Number,
        required: [true, 'El número de clientes es obligatorio']
    },
    equipo: {
        type: Number,
        required: [true, 'El número de equipo es obligatorio']
    },
    usuarios: {
        type: Number,
        required: [true, 'El número de usuarios es obligatorio']
    },
});

RecordGeneralSchema.methods.toJSON = function() {
    const { __v, ...recordGeneral } = this.toObject();
    return recordGeneral;
}

export default model('RecordGeneral', RecordGeneralSchema);