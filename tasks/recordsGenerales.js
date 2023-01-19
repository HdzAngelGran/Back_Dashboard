import { schedule } from 'node-cron';

import * as services from '../services/index.js';

const recordGeneral = () => {
    console.log('Tareas programadas: Record General');

    const fecha = new Date();
    fecha.setUTCHours(parseInt(process.env.HORA1), 0, 0, 0);

    schedule(`38 ${fecha.getHours()} * * *`, async() => {
        console.log('Tarea: Actualizar Record General');
        console.time('ARG');
        
        try{
            const fecha = new Date();
            const record = await services.mongo.recordsGenerales.getRecordGeneral(null, { fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}` });
            const proyectos = await services.mongo.proyectos.getProyecto(null, null);
            const proyectosA = await services.mongo.proyectos.getProyecto(null, {estado: true});
            const equipo = await services.mongo.usuarios.getUsuario(null, null);

            if(record.length === 0)
                await services.mongo.recordsGenerales.postRecordGeneral({
                    fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}`,
                    clientes: proyectos.length,
                    proyectos: proyectosA.length,
                    equipo: equipo.length,
                    usuarios: 0
                });
            else 
                await services.mongo.recordsGenerales.putRecordGeneral(record[0]._id ,{
                    clientes: proyectos.length,
                    proyectos: proyectosA.length,
                    equipo: equipo.length,
                });
            }catch(err){
                console.log(err);
            }

        console.timeEnd('ARG');
    });
}

export {
    recordGeneral
}