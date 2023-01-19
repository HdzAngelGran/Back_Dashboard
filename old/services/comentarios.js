const CryptoJS = require("crypto-js");

const { Comentario } = require('../models');
const { comentarioTotal } = require("./eliminacionTotal");
const { comentarioVisual } = require("./eliminacionVisual");

const getComentario = async(query) => {
    try {
        const [total, comentariosP] = await Promise.all([
            Comentario.countDocuments({...query }),
            Comentario.find({...query })
        ]);

        const comentarios = comentariosP.map(comentario => {
            return {
                ...comentario._doc,
                _id: CryptoJS.AES.encrypt(comentario._id.toString(), process.env.PASSWORDCO).toString(),
                actividad: CryptoJS.AES.encrypt(comentario.actividad.toString(), process.env.PASSWORDA).toString()
            }
        });

        return {
            total,
            comentarios
        }
    } catch (error) {
        return { msg: `Comentarios Get ${error}` }
    }
}

const postComentario = async(body) => {
    try {
        const comentario = new Comentario({...body });
        await comentario.save();

        return {
            ...comentario._doc,
            _id: CryptoJS.AES.encrypt(comentario._id.toString(), process.env.PASSWORDCO).toString(),
            actividad: CryptoJS.AES.encrypt(comentario.actividad.toString(), process.env.PASSWORDA)
        }
    } catch (error) {
        return { msg: `Comentarios Post ${error}` }
    }
}

/*const postJuego = async(body) => {
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
}*/

const putComentario = async(id, body) => {
    try {
        const comentario = await Comentario.findByIdAndUpdate(id, {...body }, { new: true });

        if (!comentario)
            throw new Error(`La comentario no se actualizó`);

        return {
            ...comentario._doc,
            _id: CryptoJS.AES.encrypt(comentario._id.toString(), process.env.PASSWORDCO).toString(),
            actividad: CryptoJS.AES.encrypt(comentario.actividad.toString(), process.env.PASSWORDA)
        }
    } catch (error) {
        return { msg: `Comentarios Put ${error}` }
    }
}

const deleteComentario = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = comentarioVisual(id);
        else
            eliminaciones = comentarioTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Comentarios Delete ${error}` }
    }
}

module.exports = {
    getComentario,
    postComentario,
    putComentario,
    deleteComentario
}