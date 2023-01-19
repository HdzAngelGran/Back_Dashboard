const CryptoJS = require("crypto-js");

const { Materia } = require('../models');
const { materiaTotal } = require("./eliminacionTotal");
const { materiaVisual } = require("./eliminacionVisual");

const getMateria = async(query) => {
    try {
        const [total, materiasP] = await Promise.all([
            Materia.countDocuments({...query }),
            Materia.find({...query })
            .populate('grupo', 'disponible')
        ]);

        const materias = materiasP.map(materia => {
            return {
                ...materia._doc,
                grupo: {
                    _id: CryptoJS.AES.encrypt(materia.grupo._id.toString(), process.env.PASSWORDG).toString(),
                    disponible: materia.grupo.disponible
                },
                _id: CryptoJS.AES.encrypt(materia._id.toString(), process.env.PASSWORDM).toString()
            }
        });

        return {
            total,
            materias
        }
    } catch (error) {
        return { msg: `Materias Get ${error}` }
    }
}

const postMateria = async(body) => {
    try {
        const materia = new Materia({...body });
        await materia.save();

        return {
            ...materia._doc,
            grupo: CryptoJS.AES.encrypt(materia.grupo._id.toString(), process.env.PASSWORDG).toString(),
            _id: CryptoJS.AES.encrypt(materia._id.toString(), process.env.PASSWORDM).toString()
        }
    } catch (error) {
        return { msg: `Materias Post ${error}` }
    }
}

const putMateria = async(id, body) => {
    try {
        const materia = await Materia.findByIdAndUpdate(id, {...body }, { new: true });

        if (!materia)
            throw new Error(`El materia no se actualizó`);

        return {
            ...materia._doc,
            grupo: CryptoJS.AES.encrypt(materia.grupo._id.toString(), process.env.PASSWORDG).toString(),
            _id: CryptoJS.AES.encrypt(materia._id.toString(), process.env.PASSWORDM).toString()
        }
    } catch (error) {
        return { msg: `Materias Put ${error}` }
    }
}

const deleteMateria = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = await materiaVisual(id);
        else
            eliminaciones = await materiaTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Materias Delete ${error}` }
    }
}

module.exports = {
    getMateria,
    postMateria,
    putMateria,
    deleteMateria
}