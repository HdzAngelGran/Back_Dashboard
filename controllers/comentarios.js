import { response, request } from 'express';

import * as services from '../services/index.js';

const obtenerComentarios = async(req = request, resp = response) => {
    try {
        const header = req.headers.id;

        const comentarios = await services.mongo.comentarios.getComentario(null, {mensajePrincipal: header});

        return resp.status(200).json({
            comentarios: comentarios.sort(function(a, b) {
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

const crearComentario = async(req = request, resp = response) => {
    try {
        const { mensajePrincipal, fecha, comentario, usuario } = req.body;

        const comentarioDB = await services.mongo.comentarios.postComentario({ mensajePrincipal, fecha, comentario, usuario });

        return resp.status(200).json(comentarioDB);
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

export {
    obtenerComentarios,
    crearComentario
}