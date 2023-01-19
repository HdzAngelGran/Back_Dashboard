import { response, request } from 'express';
import * as services from '../services/index.js';

const obtenerRecordGeneral = async(req = request, resp = response) => {
    try {
        const fecha = new Date();
        let record = await services.mongo.recordsGenerales.getRecordGeneral(null, { fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}` });
        let recordA;

        if (fecha.getMonth() === 0)
            recordA = await services.mongo.recordsGenerales.getRecordGeneral(null, { fecha: `12/${fecha.getFullYear() - 1}` });
        else
            recordA = await services.mongo.recordsGenerales.getRecordGeneral(null, { fecha: `${fecha.getMonth()}/${fecha.getFullYear()}` });

        if (record.length === 0) {
            if (recordA.length !== 0) {
                const recordGeneral = await services.mongo.recordsGenerales.postRecordGeneral({
                    fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}`,
                    clientes: recordA[0].clientes,
                    proyectos: recordA[0].proyectos,
                    equipo: recordA[0].equipo,
                    usuarios: recordA[0].usuarios
                });

                return resp.status(201).json({ recordGeneral, recordAnterior: recordA[0] });
            } else {
                const proyectos = await services.mongo.proyectos.getProyecto(null, null);
                const equipo = await services.mongo.usuarios.getUsuario(null, null);
                const clientes = proyectos.length;

                const recordGeneral = await services.mongo.recordsGenerales.postRecordGeneral({
                    fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}`,
                    clientes,
                    proyectos: clientes,
                    equipo: equipo.length,
                    usuarios: 0
                });

                return resp.status(201).json({ recordGeneral, recordAnterior: recordA[0] });
            }
        } else
        if (recordA.length === 0)
            return resp.status(206).json({ recordGeneral: record[0], recordAnterior: recordA[0] });
        else
            return resp.status(200).json({ recordGeneral: record[0], recordAnterior: recordA[0] });
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const obtenerRecordsGenerales = async(req = request, resp = response) => {
    try {
        const inicio = req.headers.inicio;
        const fin = req.headers.fin;
        const arrayQuery = [];

        if (!inicio || !fin)
            throw new Error('No se han enviado los headers de inicio y fin');

        let corredor = inicio;

        while (corredor != fin) {
            arrayQuery.push({ fecha: corredor });
            
            const fechaC = corredor.split('/');
            const fecha = fechaC.map(fec => parseInt(fec));

            if((fecha[0] + 1) > 12)
                corredor = `1/${fecha[1] + 1}`;
            else
                corredor = `${fecha[0] + 1}/${fecha[1]}`;
        }

        arrayQuery.push({ fecha: corredor });

        const record = await services.mongo.recordsGenerales.getRecordGeneral(null, { $or: arrayQuery });

        return resp.status(200).json({
            records: record.sort(function(a, b) {
                const fechaA = a.fecha.split('/');
                const fechaB = b.fecha.split('/');

                const fechaAN = fechaA.map(num => parseInt(num));
                const fechaBN = fechaB.map(num => parseInt(num));

                if (fechaAN[1] < fechaBN[1])
                        return 1;
                else
                    if (fechaAN[1] === fechaBN[1])
                        if (fechaAN[0] < fechaBN[0])
                            return 1;
                        else
                            if (fechaAN[0] === fechaBN[0])
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
    obtenerRecordGeneral,
    obtenerRecordsGenerales
}