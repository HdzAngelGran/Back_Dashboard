import * as services from "../services/index.js";

const proyectoConComentariosTareas = async(proyecto) => {
    try {
        const pRecordT = await services.jira.tareas.getTareasPorTableroProyecto(proyecto.tablero, 'maxResults=1000&jql=resolution=null');
        const pRecordTC = await services.jira.tareas.getTareasPorTableroProyecto(proyecto.tablero, 'maxResults=1');
        
        return{
            tareasTotales: pRecordTC.total,
            tareas: (pRecordT.issues) 
                    ? pRecordT.issues.map(tarea => {
                        return{
                            key: (tarea.key) ? tarea.key : '',
                            estadoN: (tarea.fields.status) ? tarea.fields.status.name : 'Sin estado',
                            estadoI: (tarea.fields.status) ? tarea.fields.status.id : 'Sin estado',
                            asignada: (tarea.fields.assignee) ? tarea.fields.assignee.displayName : 'Sin asignar',
                            descripcion: (tarea.fields.summary) ? tarea.fields.summary : 'Sin descripción',
                            worklog: (tarea.fields.worklog)
                                ? (tarea.fields.worklog.worklogs) 
                                    ? tarea.fields.worklog.worklogs.map(worklog => {
                                        return{
                                            autor: worklog.updateAuthor.displayName,
                                            creada: new Date(worklog.created),
                                            actualizada: new Date(worklog.updated),
                                            empezada: new Date(worklog.started),
                                            tiempo: worklog.timeSpent,
                                        }
                                    })
                                    : []
                                : [],
                        comentarios: tarea.fields.comment.comments.map(comentario => {
                            if(comentario)
                                return {
                                    autor: comentario.author.displayName,
                                    creado: new Date(comentario.created),
                                    contenido: comentario.body,
                                }
                            else
                                return {}
                        })
                        }
                    })
                    : []
        }
    } catch (error) {
    }
}

const proyectosConEstadoTareas = async(proyectos) => {
    return proyectos.map(async(proyecto) => {
        try {
            const pRecordT = await services.jira.tareas.getTareasPorTableroProyecto(proyecto.tablero, 'maxResults=1000&jql=resolution=null');
            const pRecordTC = await services.jira.tareas.getTareasPorTableroProyecto(proyecto.tablero, 'maxResults=1');

            return {
                id: proyecto.id,
                tareasTotales: pRecordTC.total,
                tareas: (pRecordT.issues) 
                    ? pRecordT.issues.map(tarea => {
                        return{
                            id: (tarea.id) ? tarea.id : '',
                            key: (tarea.key) ? tarea.key : '',
                            estadoN: (tarea.fields.status) ? tarea.fields.status.name : 'Sin estado',
                            estadoI: (tarea.fields.status) ? tarea.fields.status.id : 'Sin estado',
                            asignada: (tarea.fields.assignee) ? tarea.fields.assignee.displayName : 'Sin asignar',
                            worklog: (tarea.fields.worklog)
                                ? (tarea.fields.worklog.worklogs) 
                                    ? tarea.fields.worklog.worklogs.map(worklog => {
                                        return{
                                            autor: worklog.updateAuthor.displayName,
                                            creada: new Date(worklog.created),
                                            actualizada: new Date(worklog.updated),
                                            empezada: new Date(worklog.started),
                                        }
                                    })
                                    : []
                                : [],
                        }
                    })
                    : []
            }
        } catch (error) {
            console.log(error);
        }
    });
}

const proyectosConTareas = async(proyectos) => {
    return proyectos.map(async(proyecto) => {
        try {
            const pRecordNull = await services.jira.tareas.getTareasPorTableroProyecto(proyecto.tablero, 'maxResults=1&jql=resolution=null');
            const pRecordNotNull = await services.jira.tareas.getTareasPorTableroProyecto(proyecto.tablero, 'maxResults=1&jql=resolution!=null');

            if (pRecordNotNull.total === 0 && pRecordNull.total === 0)
                throw new Error('No se pudo obtener las tareas del proyecto');
            else {
                const total = pRecordNull.total / (pRecordNotNull.total + pRecordNull.total);

                return {
                    idP: proyecto.id,
                    record: (100 - (total * 100)).toFixed(2),
                }
            }
        } catch (error) {
        }
    });
}

export {
    proyectoConComentariosTareas,
    proyectosConEstadoTareas,
    proyectosConTareas
}