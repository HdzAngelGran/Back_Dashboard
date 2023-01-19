const CryptoJS = require("crypto-js");

const { Calificacion } = require('../models');
const { calificacionTotal } = require("./eliminacionTotal");
const { calificacionVisual } = require("./eliminacionVisual");

const getCalificacion = async(query) => {
    try {
        const [total, calificacionesP] = await Promise.all([
            Calificacion.countDocuments({...query }),
            Calificacion.find({...query })
            .populate('estudiante', ['nombre', 'apellidoP', 'apellidoM'], )
        ]);

        const calificaciones = calificacionesP.map(calificacion => {
            return {
                ...calificacion._doc,
                _id: CryptoJS.AES.encrypt(calificacion._id.toString(), process.env.PASSWORDC).toString(),
                actividad: CryptoJS.AES.encrypt(calificacion.actividad.toString(), process.env.PASSWORDA).toString()
            }
        });

        return {
            total,
            calificaciones
        }
    } catch (error) {
        return { msg: `Calificaciones Get ${error}` }
    }
}

const postCalificacion = async(body) => {
    try {
        const calificacion = new Calificacion({...body });
        await calificacion.save();

        return {
            ...calificacion._doc,
            actividad: CryptoJS.AES.encrypt(calificacion.actividad.toString(), process.env.PASSWORDA).toString(),
            _id: CryptoJS.AES.encrypt(calificacion._id.toString(), process.env.PASSWORDC).toString()
        }
    } catch (error) {
        return { msg: `Calificaciones Post ${error}` }
    }
}

const putCalificacion = async(id, body) => {
    try {
        const calificacion = await Calificacion.findByIdAndUpdate(id, {...body }, { new: true });

        if (!calificacion)
            throw new Error(`La calificacion no se actualizó`);

        return {
            ...calificacion._doc,
            _id: CryptoJS.AES.encrypt(calificacion._id.toString(), process.env.PASSWORDC).toString()
        }
    } catch (error) {
        return { msg: `Calificaciones Put ${error}` }
    }
}

const deleteCalificacion = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = calificacionVisual(id);
        else
            eliminaciones = calificacionTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Calificaciones Delete ${error}` }
    }
}

module.exports = {
    getCalificacion,
    postCalificacion,
    putCalificacion,
    deleteCalificacion
}