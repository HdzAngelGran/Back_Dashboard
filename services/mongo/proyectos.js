import { Proyecto } from "../../models/index.js";

const getProyecto = async(idP, query) => {
    try {
        if (idP === null && query === null)
            return await Proyecto.find();
        else
            if (query === null)
                return await Proyecto.findById(idP);
            else
                return await Proyecto.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postProyecto = async(body) => {
    try {
        const proyecto = new Proyecto({...body });
        return await proyecto.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putProyecto = async(id, body) => {
    try {
        return await Proyecto.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delProyecto = async(id) => {
    try {
        return await Proyecto.findByIdAndDelete(id);
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getProyecto, postProyecto, putProyecto, delProyecto };