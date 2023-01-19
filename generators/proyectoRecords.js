import { mongo } from "../services/index.js";

const proyectosConTareas = async(recordM, recordJ) => {
    return recordM.map(async(proyectoM) => {
        try {
            const pasa = recordJ.map(record => {
                if (proyectoM.idJ === record.idP)
                    return {
                        id: proyectoM._id,
                        record: record.record,
                    }
            }).filter(record => record);

            if (pasa.length === 0)
                throw new Error('No se pudo obtener el record del proyecto');

            const act = await mongo.proyectoRecords.putProyectoRecord(pasa[0].id, { record: pasa[0].record });

            return act;
        } catch (error) {
        }
    });
}

export {
    proyectosConTareas
}