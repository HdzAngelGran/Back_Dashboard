import { UsuarioProy } from "../../models/index.js";

const getUsuarioProy = async(idU, query) => {
    try {
        if (idU === null && query === null)
            return await UsuarioProy.find();
        else
        if (query === null){
            return await UsuarioProy.findById(idU);
        }
        else
            return await UsuarioProy.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postUsuarioProy = async(body) => {
    try {
        const proyectorecord = new UsuarioProy({...body });

        return await proyectorecord.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putUsuarioProy = async(id, body) => {
    try {
        return await UsuarioProy.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delUsuarioProy = async(id) => {
    try {
        return await UsuarioProy.findByIdAndDelete(id);
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getUsuarioProy, postUsuarioProy, putUsuarioProy, delUsuarioProy };