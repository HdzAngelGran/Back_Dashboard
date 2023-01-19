import mongoose from 'mongoose';

import { ProyectoRecord } from "../../models/index.js";

const getProyectoRecord = async(idP, query) => {
    try {
        if (idP === null && query === null)
            return await ProyectoRecord.find();
        else
        if (query === null){
            return await ProyectoRecord.findById(idP);
        }
        else
            return await ProyectoRecord.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postProyectoRecord = async(body) => {
    try {
        const proyectorecord = new ProyectoRecord({...body });

        return await proyectorecord.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putProyectoRecord = async(id, body) => {
    try {
        return await ProyectoRecord.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delProyectoRecord = async(body) => {
    try {
        const { id } = body.params;
        await ProyectoRecord.findByIdAndDelete(id);

        return 1;
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getProyectoRecord, postProyectoRecord, putProyectoRecord, delProyectoRecord };