import pkg from 'mongoose';
const { Schema, model } = pkg;

const MensajeSchema = Schema({
    idP: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
        required: [true, 'El id del proyecto es obligatorio']
    },
    fecha: {
        type: String,
        required: [true, 'La fecha del mensaje es obligatoria']
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje es obligatorio']
    }
});

MensajeSchema.methods.toJSON = function() {
    const { __v, ...mensaje } = this.toObject();
    return mensaje;
}

export default model('Mensaje', MensajeSchema);