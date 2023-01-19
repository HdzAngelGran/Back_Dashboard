import { Mensaje } from "../../models/index.js";

const getMensaje = async(idP, query) => {
    try {
        if (idP === null && query === null)
            return await Mensaje.find();
        else
        if (query === null)
            return await Mensaje.findById(idP);
        else
            return await Mensaje.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postMensaje = async(body) => {
    try {
        const proyectorecord = new Mensaje({...body });

        return await proyectorecord.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putMensaje = async(id, body) => {
    try {
        return await Mensaje.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delMensaje = async(body) => {
    try {
        const { id } = body.params;
        await Mensaje.findByIdAndDelete(id);

        return 1;
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getMensaje, postMensaje, putMensaje, delMensaje };