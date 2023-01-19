import pkg from 'mongoose';
const { Schema, model } = pkg;

const ProyectoRecordSchema = Schema({
    idP: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
    },
    idPT: {
        type: Number
    },
    idJ: {
        type: Number,
    },
    fecha: {
        type: String,
        required: [true, 'La fecha de la imagen es obligatorio']
    },
    record: {
        type: Number,
        required: [true, 'El record es obligatorio']
    },
    desarrollo: {
        type: Number,
        required: [true, 'El desarrollo es obligatorio']
    },
    qa: {
        type: Number,
        required: [true, 'El qa es obligatorio']
    },
    listo: {
        type: Number,
        required: [true, 'El listo es obligatorio']
    },
});

ProyectoRecordSchema.methods.toJSON = function() {
    const { __v, ...proyectoRecord } = this.toObject();
    return proyectoRecord;
}

export default model('ProyectoRecord', ProyectoRecordSchema);