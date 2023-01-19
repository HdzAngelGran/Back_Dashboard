import { response, request } from 'express';
import * as services from '../services/index.js';

const obtenerRecordProyecto = async(req = request, resp = response) => {
    try {
        const id = req.headers.id;

        const record = await services.mongo.proyectoRecords.getProyectoRecord(id, null);

        return resp.status(200).json({ record });
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const obtenerRecordsProyecto = async(req = request, resp = response) => {
    try {
        const id = req.headers.id;

        const record = await services.mongo.proyectoRecords.getProyectoRecord(null, {idP: id});

        return resp.status(200).json({ record: record.sort((a, b) => {
            const fechaA = a.fecha.split('/');
            const fechaB = b.fecha.split('/');

            if (fechaA[1] < fechaB[1])
                return 1;
            else
                if (fechaA[1] === fechaB[1])
                    if (fechaA[0] < fechaB[0])
                        return 1;
                    else
                        if (fechaA[0] === fechaB[0])
                            return 0;
                        else
                            return -1;
                else
                    return -1;
            })
        });
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

export {
    obtenerRecordProyecto,
    obtenerRecordsProyecto
}