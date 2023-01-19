import { Usuario } from "../../models/index.js";

const getUsuario = async(idU, query) => {
    try {
        if (idU === null && query === null)
            return await Usuario.find();
        else
        if (query === null)
            return await Usuario.findById(idU);
        else
            return await Usuario.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postUsuario = async(body) => {
    try {
        const usuario = new Usuario({...body });
        await usuario.save();

        return 'Usuario creado';
    } catch (e) {
        throw new Error(e.message);
    }
}

const putUsuario = async(id, body) => {
    try {
        return await Usuario.findByIdAndUpdate(id, {...body });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delUsuario = async(id) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(id);
        console.log(`EL usuario ${usuario.nombre} fue eliminado`);
        
        return res.status(200).json({ msg: 'Usuario eliminado' });
    } catch (e) {
        throw new Error(e.message);
    }
}

export {
    getUsuario,
    postUsuario,
    putUsuario,
    delUsuario
};