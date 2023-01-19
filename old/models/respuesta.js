const { Schema, model } = require('mongoose');

const RespuestaSchema = Schema({
    respuestas: {
        type: [String],
        required: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
});

RespuestaSchema.methods.toJSON = function() {
    const { __v, estado, ...respuesta } = this.toObject();
    return respuesta;
}

module.exports = model('Respuesta', RespuestaSchema);