const CryptoJS = require("crypto-js");

const { Inscrito } = require('../models');
const { inscritoTotal } = require("./eliminacionTotal");
const { inscritoVisual } = require("./eliminacionVisual");

const getInscrito = async(query) => {
    try {
        const [total, inscritosP] = await Promise.all([
            Inscrito.countDocuments({...query }),
            Inscrito.find({...query })
        ]);

        const inscritos = inscritosP.map(inscrito => {
            return {
                ...inscrito._doc,
                grupo: CryptoJS.AES.encrypt(inscrito.grupo.toString(), process.env.PASSWORDG).toString(),
                _id: CryptoJS.AES.encrypt(inscrito._id.toString(), process.env.PASSWORDI).toString()
            }
        });

        return {
            total,
            inscritos
        }
    } catch (error) {
        return { msg: `Inscritos Get ${error}` }
    }
}

const postInscrito = async(body) => {
    try {
        const inscrito = new Inscrito({...body });
        await inscrito.save();

        return {
            ...inscrito._doc,
            grupo: CryptoJS.AES.encrypt(inscrito.grupo.toString(), process.env.PASSWORDG).toString(),
            _id: CryptoJS.AES.encrypt(inscrito._id.toString(), process.env.PASSWORDI).toString()
        }
    } catch (error) {
        return { msg: `Inscritos Post ${error}` }
    }
}

const putInscrito = async(id, body) => {
    try {
        const inscrito = await Inscrito.findByIdAndUpdate(id, {...body }, { new: true });

        if (!inscrito)
            throw new Error(`El alumno inscrito no existe`);

        return {
            ...inscrito._doc,
            grupo: CryptoJS.AES.encrypt(inscrito.grupo.toString(), process.env.PASSWORDG).toString(),
            _id: CryptoJS.AES.encrypt(inscrito._id.toString(), process.env.PASSWORDI).toString()
        }
    } catch (error) {
        return { msg: `Inscritos Put ${error}` }
    }
}

const deleteInscrito = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = inscritoVisual(id);
        else
            eliminaciones = inscritoTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Inscritos Delete ${error}` }
    }
}

module.exports = {
    getInscrito,
    postInscrito,
    putInscrito,
    deleteInscrito
}