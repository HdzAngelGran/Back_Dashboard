import { RecordGeneral } from "../../models/index.js";

const getRecordGeneral = async(idP, query) => {
    try {
        if (idP === null && query === null)
            return await RecordGeneral.find();
        else
        if (query === null)
            return await RecordGeneral.findById(idP);
        else
            return await RecordGeneral.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postRecordGeneral = async(body) => {
    try {
        const proyectorecord = new RecordGeneral({...body });

        return await proyectorecord.save();
    } catch (e) {
        throw new Error(e.message);
    }
}

const putRecordGeneral = async(id, body) => {
    try {
        return await RecordGeneral.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delRecordGeneral = async(body) => {
    try {
        const { id } = body.params;
        await RecordGeneral.findByIdAndDelete(id);

        return 1;
    } catch (e) {
        throw new Error(e.message);
    }
}

export { getRecordGeneral, postRecordGeneral, putRecordGeneral, delRecordGeneral };