const { Sep } = require('../models');
const { sepTotal } = require("./eliminacionTotal");
const { sepVisual } = require("./eliminacionVisual");

const getSep = async(query) => {
    try {
        const [total, seps] = await Promise.all([
            Sep.countDocuments({...query }),
            Sep.find({...query })
        ]);

        return {
            total,
            seps
        }
    } catch (error) {
        return { msg: `Seps Get ${error}` }
    }
}

const postSep = async(body) => {
    try {
        const sep = new Sep({...body });
        await sep.save();

        return sep;
    } catch (error) {
        return { msg: `Seps Post ${error}` }
    }
}

const putSep = async(id, body) => {
    try {
        const sep = await Sep.findByIdAndUpdate(id, {...body }, { new: true });

        if (!sep)
            throw new Error(`La sep no se actualizó`);

        return sep;
    } catch (error) {
        return { msg: `Seps Put ${error}` }
    }
}

const deleteSep = async(grado) => {
    try {
        let eliminaciones;

        eliminaciones = await sepTotal({ grado });

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Seps Delete ${error}` }
    }
}

module.exports = {
    getSep,
    postSep,
    putSep,
    deleteSep
}