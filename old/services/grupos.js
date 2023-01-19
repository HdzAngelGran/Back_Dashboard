const CryptoJS = require("crypto-js");

const { Grupo } = require('../models');
const { grupoTotal } = require("./eliminacionTotal");
const { grupoVisual } = require("./eliminacionVisual");

const getGrupo = async(query) => {
    try {
        const [total, gruposP] = await Promise.all([
            Grupo.countDocuments({...query }),
            Grupo.find({...query })
        ]);

        const grupos = gruposP.map(grupo => {
            return {
                ...grupo._doc,
                _id: CryptoJS.AES.encrypt(grupo._id.toString(), process.env.PASSWORDG).toString(),
            }
        });

        return {
            total,
            grupos
        }
    } catch (e) {
        return { msg: `Grupos Get ${e}` }
    }
}

const postGrupo = async(body) => {
    try {
        const grupo = new Grupo({...body });
        await grupo.save();

        return {
            ...grupo._doc,
            _id: CryptoJS.AES.encrypt(grupo._id.toString(), process.env.PASSWORDG).toString()
        }
    } catch (error) {
        return { msg: `Grupos Post ${error}` }
    }
}

const putGrupo = async(id, body) => {
    try {
        const grupo = await Grupo.findByIdAndUpdate(id, {...body }, { new: true });

        if (!grupo)
            throw new Error(`El grupo no se actualizó`);

        return {
            ...grupo._doc,
            _id: CryptoJS.AES.encrypt(grupo._id.toString(), process.env.PASSWORDG).toString()
        }
    } catch (error) {
        return { msg: `Grupos Put ${error}` }
    }
}

const deleteGrupo = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = await grupoVisual(id);
        else
            eliminaciones = await grupoTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Grupos Delete ${error}` }
    }
}

module.exports = {
    getGrupo,
    postGrupo,
    putGrupo,
    deleteGrupo
}