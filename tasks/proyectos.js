import { schedule } from 'node-cron';

import * as services from '../services/index.js';
import * as generators from '../generators/index.js';

const proyectos = () => {
    console.log('Tareas programadas: Proyectos');

    const fecha = new Date();
    fecha.setUTCHours(parseInt(process.env.HORA1), 0, 0, 0);
    console.log(fecha.getHours());

    schedule(`36 ${fecha.getHours()} * * *`, async() => {
        console.log('Tarea: Verificar Proyectos Nuevos');
        console.time('VPN');

        try{
            const proyTD = services.timeDoctor.proyectos.getProyectos();
            const proyJ = services.jira.proyectos.getProyectos();
            const proyM = services.mongo.proyectos.getProyecto();
            
            let contentM = await proyM;
            const contentTD = await proyTD;
            
            const array = await generators.proyectos.crossProyectsMD(contentM, contentTD.count);
            await Promise.all(array);
            
            contentM = await services.mongo.proyectos.getProyecto();
            
            const contentJ = await proyJ;
            const array2 = await generators.proyectos.crossProyectsMJ(contentM, contentJ);
            await Promise.all(array2);
        }catch(err){
            console.log(err);
        }
        
        console.timeEnd('VPN');
    });

    schedule(`37 ${fecha.getHours()} * * *`, async() => {
        console.log('Tarea: Verificar Proyectos Nuevos');
        console.time('VPN');

        try{
            const proyJ = services.jira.proyectos.getProyectos();
            const proyM = await services.mongo.proyectos.getProyecto();
            
            const contentJ = await proyJ;
            const array2 = await generators.proyectos.renombrarProy(proyM, contentJ);

            await Promise.all(array2);
        }catch(err){
            console.log(err);
        }
        
        console.timeEnd('VPN');
    });
}

export {
    proyectos
}