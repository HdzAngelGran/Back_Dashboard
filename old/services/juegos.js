const CryptoJS = require("crypto-js");

const { Juego } = require('../models');
const { juegoTotal } = require("./eliminacionTotal");
const { juegoVisual } = require("./eliminacionVisual");

const getJuego = async(query) => {
    try {
        const [total, juegosP] = await Promise.all([
            Juego.countDocuments({...query }),
            Juego.find({...query })
        ]);

        const juegos = juegosP.map(juego => {
            return {
                ...juego._doc,
                _id: CryptoJS.AES.encrypt(juego._id.toString(), process.env.PASSWORDJ).toString(),
                actividad: CryptoJS.AES.encrypt(juego.actividad.toString(), process.env.PASSWORDA).toString()
            }
        });

        return {
            total,
            juegos
        }
    } catch (error) {
        return { msg: `Juegos Get ${error}` }
    }
}

const postJuego = async(body) => {
    try {
        const juego = new Juego({...body });
        await juego.save();

        return {
            ...juego._doc,
            _id: CryptoJS.AES.encrypt(juego._id.toString(), process.env.PASSWORDJ).toString()
        }
    } catch (error) {
        return { msg: `Juegos Post ${error}` }
    }
}

const putJuego = async(id, body) => {
    try {
        const juego = await Juego.findByIdAndUpdate(id, {...body }, { new: true });

        if (!juego)
            throw new Error(`El juego no se actualizó`);

        return {
            ...juego._doc,
            _id: CryptoJS.AES.encrypt(juego._id.toString(), process.env.PASSWORDJ).toString()
        }
    } catch (error) {
        return { msg: `Juegos Put ${error}` }
    }
}

const deleteJuego = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = juegoVisual(id);
        else
            eliminaciones = juegoTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Juegos Delete ${error}` }
    }
}

module.exports = {
    getJuego,
    postJuego,
    putJuego,
    deleteJuego
}