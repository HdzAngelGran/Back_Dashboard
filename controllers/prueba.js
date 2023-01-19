import { response, request } from 'express';

import * as services from '../services/index.js';
import * as generators from '../generators/index.js';
import * as mappings from '../mapping/index.js';

const prueba = async(req = request, resp = response) => {
    try {
        const usuarioTD = services.timeDoctor.trabajadores.getTrabajadores();
        const usuarioM = services.mongo.usuarios.getUsuario(null, null);
        
        let contentM = await usuarioM;
        const contentTD = await usuarioTD;

        const result = await contentTD.users.map(async (dataTD) => {

            const existe = contentM.filter(dataM => dataTD.id === dataM.idU);

            if (existe[0]) {
                try {
                    await services.mongo.usuarios.putUsuario(existe[0]._id, {
                        apellidoP: dataTD.last_name
                    });

                    return 1;
                } catch (error) {
                    console.error(error.message);
                    console.error(dataTD.full_name);

                    return 0;
                }
            }
        });

        const contentResult = await Promise.all(result);

        return resp.status(200).json(contentResult);
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

export {
    prueba
}