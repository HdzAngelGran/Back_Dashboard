import { Comentario } from "../../models/index.js";

const getComentario = async(idP, query) => {
    try {
        if (idP === null && query === null)
            return await Comentario.find();
        else
        if (query === null)
            return await Comentario.findById(idP);
        else
            return await Comentario.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postComentario = async(body) => {
    try {
        const proyectorecord = new Comentario({...body });

        return await proyectorecord.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putComentario = async(id, body) => {
    try {
        return await Comentario.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delComentario = async(id) => {
    try {
        await Comentario.findByIdAndDelete(id);

        return 1;
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getComentario, postComentario, putComentario, delComentario };