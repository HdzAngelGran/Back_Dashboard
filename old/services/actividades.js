const CryptoJS = require("crypto-js");

const { Actividad } = require('../models');
const { actividadTotal } = require("./eliminacionTotal");
const { actividadVisual } = require("./eliminacionVisual");

const getActividad = async(query) => {
    try {
        const [total, actividadesP] = await Promise.all([
            Actividad.countDocuments({...query }),
            Actividad.find({...query })
            .populate('juego', 'blocked')
            .populate('materia', 'nombre')
        ]);

        const actividades = actividadesP.map(actividad => {
            if (actividad.juego)
                return {
                    ...actividad._doc,
                    _id: CryptoJS.AES.encrypt(actividad._id.toString(), process.env.PASSWORDA).toString(),
                    materia: {
                        _id: CryptoJS.AES.encrypt(actividad.materia.toString(), process.env.PASSWORDM).toString(),
                        nombre: actividad.materia.nombre
                    },
                    juego: {
                        _id: CryptoJS.AES.encrypt(actividad.juego._id.toString(), process.env.PASSWORDJ).toString(),
                        blocked: actividad.juego.blocked
                    }
                }
            else
                return {
                    ...actividad._doc,
                    materia: {
                        _id: CryptoJS.AES.encrypt(actividad.materia.toString(), process.env.PASSWORDM).toString(),
                        nombre: actividad.materia.nombre
                    },
                    _id: CryptoJS.AES.encrypt(actividad._id.toString(), process.env.PASSWORDA).toString(),
                }
        });

        return {
            total,
            actividades
        }
    } catch (error) {
        return { msg: `Actividades Get ${error}` }
    }
}

const postActividad = async(body) => {
    try {
        const actividad = new Actividad({...body });
        await actividad.save();

        return {
            ...actividad._doc,
            _id: CryptoJS.AES.encrypt(actividad._id.toString(), process.env.PASSWORDA).toString()
        }
    } catch (error) {
        return { msg: `Actividades Post ${error}` }
    }
}

const putActividad = async(id, body) => {
    try {
        const actividad = await Actividad.findByIdAndUpdate(id, {...body }, { new: true });

        if (!actividad)
            throw new Error(`La actividad no se actualizó`);

        return {
            ...actividad._doc,
            materia: CryptoJS.AES.encrypt(actividad.materia.toString(), process.env.PASSWORDM).toString(),
            _id: CryptoJS.AES.encrypt(actividad._id.toString(), process.env.PASSWORDA).toString()
        }
    } catch (error) {
        return { msg: `Actividades Put ${error}` }
    }
}

const deleteActividad = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = actividadVisual(id);
        else
            eliminaciones = actividadTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Actividades Delete ${error}` }
    }
}

module.exports = {
    getActividad,
    postActividad,
    putActividad,
    deleteActividad
}