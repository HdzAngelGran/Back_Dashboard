import { schedule } from 'node-cron';

import * as services from '../services/index.js';
import * as generators from '../generators/index.js';

const usuarios = () => {
    console.log('Tareas programadas: Usuarios');

    const fecha = new Date();
    fecha.setUTCHours(parseInt(process.env.HORA1), 0, 0, 0);

    schedule(`37 ${fecha.getHours()} * * *`, async() => {
        console.log('Tarea: Verificar Usuarios');
        console.time('VU');

        try{
            const usuarioTD = services.timeDoctor.trabajadores.getTrabajadores();
            const usuarioM = services.mongo.usuarios.getUsuario(null, null);
            
            let contentM = await usuarioM;
            const contentTD = await usuarioTD;

            const arrayT = await generators.usuarios.crossUsers(contentM, contentTD.users);
            const arrayM = await generators.usuarios.verifyUsers(contentM, contentTD.users);
            
            await Promise.all(arrayT);
            await Promise.all(arrayM);
        }catch(err){
            console.log(err);
        }
        
        console.timeEnd('VU');
    });
}

export {
    usuarios
}