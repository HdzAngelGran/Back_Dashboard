import { schedule } from 'node-cron';

import * as services from '../services/index.js';
import * as generators from '../generators/index.js';
import * as mappings from '../mapping/index.js';

const record = () => {
    console.log('Tareas programadas: Record');

    const fecha = new Date();
    fecha.setUTCHours(parseInt(process.env.HORA1), 0, 0, 0);

    schedule(`37 ${fecha.getHours()} * * *`, async() => {
        console.log('Tarea: Actualizar Records de Proyectos');
        console.time('ARP');

        try{
            const tablerosJ = await services.jira.tableros.getTablerosProyectos();
            const proyM = await services.mongo.proyectos.getProyecto();
            const proyTableros = mappings.proyectos.proyectosConTableros(proyM, tablerosJ.values);
            const proys = await mappings.proyectoRecords.proyectosConTareas(proyTableros);
            
            const fecha = new Date();
            
            const proyRM = await services.mongo.proyectoRecords.getProyectoRecord(null, {fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}`});

            if(proyRM.length === 0){
                const proysRecords = await generators.proyectos.proyectoConRecord(proyM);
                const contentProys = (await Promise.all(proys)).filter(proyecto => proyecto);
                const contentRMN = await Promise.all(proysRecords);
                const proysCross = await generators.proyectoRecords.proyectosConTareas(contentRMN, contentProys);
                await Promise.all(proysCross);
            }
            else{
                const contentProys = (await Promise.all(proys)).filter(proyecto => proyecto);
    
                const proysCross = await generators.proyectoRecords.proyectosConTareas(proyRM, contentProys);
                await Promise.all(proysCross);
            }
        }catch(err){
            console.log(err);
        }

        console.timeEnd('ARP');
    });

    schedule(`37 ${fecha.getHours()} * * *`, async() => {
        console.log('Tarea: Actualizar Records de Tableros');
        console.time('ART');
        
        try{
            const tablerosJ = await services.jira.tableros.getTablerosProyectos();
            const proyM = await services.mongo.proyectos.getProyecto();
            const proyTableros = mappings.proyectos.proyectosConTableros(proyM, tablerosJ.values);
            const proys = await mappings.proyectoRecords.proyectosConEstadoTareas(proyTableros);
            const contentProys = (await Promise.all(proys)).filter(proyecto => proyecto).filter(proyecto => proyecto.tareas.length > 0);

            const tareas = contentProys.map(async(proyecto) => {
                let desarrollo = 0;
                let qa = 0;
                let listo = proyecto.tareasTotales - proyecto.tareas.length;

                proyecto.tareas.forEach(tarea => {
                    if (tarea.estadoN == '1 Backlog Dev.' || tarea.estadoN == '2 In Progress' || tarea.estadoN == '2.1 En pausa' || tarea.estadoN == '3 Listo para integrar')
                        desarrollo++;
                    if (tarea.estadoN == '4 Listo para QA' || tarea.estadoN == '4.1 Listo sin QA')
                        qa++;
                    if (tarea.estadoN == '5 Listo con QA' || tarea.estadoN == '6 Done')
                        listo++;
                });

                const fecha = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
                const record = await services.mongo.proyectoRecords.getProyectoRecord(null, {fecha, idJ: proyecto.id});
                const recordA = await services.mongo.proyectoRecords.putProyectoRecord(record[0]._id, {desarrollo, qa, listo});

                return recordA;
            });

            await Promise.all(tareas)
        }catch(err){
            console.log(err);
        }

        console.timeEnd('ART');
    });
}

export {
    record
}