import { response, request } from 'express';

import * as services from '../services/index.js';

const obtenerMensajes = async(req = request, resp = response) => {
    try {
        const header = req.headers.id;

        const mensajes = await services.mongo.mensajes.getMensaje(null, {idP: header});

        return resp.status(200).json({
            mensajes: mensajes.sort(function(a, b) {
                const fechaA = a.fecha.split('/');
                const fechaB = b.fecha.split('/');
                const as = fechaA.pop();
                const bs = fechaB.pop();
                fechaA.push(...as.split(' '));
                fechaB.push(...bs.split(' '));
                const ah = fechaA.pop();
                const bh = fechaB.pop();
                fechaA.push(...ah.split(':'));
                fechaB.push(...bh.split(':'));
                const fechaAN = fechaA.map(num => parseInt(num));
                const fechaBN = fechaB.map(num => parseInt(num));

                if (fechaAN[2] < fechaBN[2])
                    return 1;
                else 
                    if (fechaAN[2] === fechaBN[2])
                        if (fechaAN[1] < fechaBN[1])
                                return 1;
                        else
                            if (fechaAN[1] === fechaBN[1])
                                if (fechaAN[0] < fechaBN[0])
                                    return 1;
                                else
                                    if (fechaAN[0] === fechaBN[0])
                                        if (fechaAN[3] < fechaBN[3])
                                            return 1;
                                        else
                                            if (fechaAN[3] === fechaBN[3])
                                                if (fechaAN[4] < fechaBN[4])
                                                    return 1;
                                                else
                                                    if (fechaAN[4] === fechaBN[4])
                                                        return 0;
                                                    else
                                                        return -1;
                                            else
                                                return -1;
                                    else
                                        return -1;
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

const obtenerMensaje = async(req = request, resp = response) => {
    try {
        const header = req.headers.id;

        const mensajes = await services.mongo.mensajes.getMensaje(header);

        return resp.status(200).json(mensajes);
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const crearMensaje = async(req = request, resp = response) => {
    try {
        const { idP, fecha, mensaje } = req.body;

        const mensajeDB = await services.mongo.mensajes.postMensaje({ idP, fecha, mensaje });

        return resp.status(200).json(mensajeDB);
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const actualizarMensaje = async(req = request, resp = response) => {
    try {
        const header = req.headers.id;
        const body = req.body;

        const mensajes = await services.mongo.mensajes.putMensaje(header, {mensaje: body.mensaje});

        return resp.status(200).json(mensajes);
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

export {
    obtenerMensaje,
    obtenerMensajes,
    crearMensaje,
    actualizarMensaje
}