const CryptoJS = require("crypto-js");

const { Respuesta } = require('../models');
const { respuestaTotal } = require("./eliminacionTotal");
const { respuestaVisual } = require("./eliminacionVisual");

const getRespuesta = async(query) => {
    try {
        const [total, respuestas] = await Promise.all([
            Respuesta.countDocuments({...query }),
            Respuesta.find({...query })
        ]);

        return {
            total,
            respuestas
        }
    } catch (error) {
        return { msg: `Respuestas Get ${error}` }
    }
}

const postRespuesta = async(body) => {
    try {
        const respuesta = new Respuesta({...body });
        await respuesta.save();

        const idR = CryptoJS.AES.encrypt(respuesta._id.toString(), process.env.PASSWORDR).toString();

        return {
            ...respuesta._doc,
            _id: CryptoJS.AES.encrypt(idR.toString(), process.env.PASSWORDJ).toString()
        }
    } catch (error) {
        return { msg: `Respuestas Post ${error}` }
    }
}

const putRespuesta = async(id, body) => {
    try {
        const respuesta = await Respuesta.findByIdAndUpdate(id, {...body }, { new: true });

        if (!respuesta)
            throw new Error(`La respuesta no se actualizó`);

        const idR = CryptoJS.AES.encrypt(respuesta._id.toString(), process.env.PASSWORDR).toString();

        return {
            ...respuesta._doc,
            _id: CryptoJS.AES.encrypt(idR.toString(), process.env.PASSWORDJ).toString()
        }
    } catch (error) {
        return { msg: `Respuestas Put ${error}` }
    }
}

const deleteRespuesta = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = respuestaVisual(id);
        else
            eliminaciones = respuestaTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Respuestas Delete ${error}` }
    }
}

module.exports = {
    getRespuesta,
    postRespuesta,
    putRespuesta,
    deleteRespuesta
}