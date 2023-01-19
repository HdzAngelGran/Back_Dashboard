import * as services from "../services/index.js";

const proyectosConTableros = (mongoP, jiraT) => {
    return mongoP.map(proyecto => {
        const jira = jiraT.map(tablero => {
            if (parseInt(proyecto.idJ) === tablero.location.projectId){
                return {
                    id: tablero.location.projectId,
                    tablero: tablero.id,
                }
            }
        }).filter(jira => jira);

        return jira[0];
    }).filter(mongo => mongo);
}

const proyectosConRecord = async(proyectos) => {
    return proyectos.map(async(proyecto) => {
        try {
            const fecha = new Date();
            const proyectoRecords = await services.mongo.proyectoRecords.getProyectoRecord(null, {
                idP: proyecto._id,
                fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}`
            });

            if (proyectoRecords[0])
                return {
                    ...(proyecto._doc) 
                        ? proyecto._doc
                        : proyecto,
                    record: proyectoRecords[0].record
                }
            else {
                console.log('No se pudo obtener el record del proyecto');

                return {
                    ...(proyecto._doc) 
                        ? proyecto._doc
                        : proyecto,
                    record: 0
                }
            }
        } catch (error) {
            console.error(error.message);

            return {
                ...(proyecto._doc) 
                    ? proyecto._doc
                    : proyecto,
                record: 0
            }
        }
    });
}

export {
    proyectosConTableros,
    proyectosConRecord
}