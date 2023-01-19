import { mongo } from "../services/index.js";

const crossProyectsMD = async(mongoP, timeDoctorP) => {
    return timeDoctorP.map(async(dataTD) => {
        const existe = mongoP.filter(dataM => dataTD.id === dataM.idP);

        if (existe.length === 0) {
            try {
                const fecha = new Date();

                const pRecord = await mongo.proyectoRecords.postProyectoRecord({
                    idPT: dataTD.id,
                    idJ: parseInt(dataTD.integration.sourceId),
                    fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}`,
                    record: 0,
                    desarrollo: 0,
                    qa: 0,
                    listo: 0
                });

                const proyecto = await mongo.proyectos.postProyecto({
                    nombre: dataTD.name,
                    idP: dataTD.id,
                    idJ: parseInt(dataTD.integration.sourceId),
                    imagen: 'https://res.cloudinary.com/nodecafe/image/upload/v1661290561/Dashboard/velez_pz7ltw.png',
                    idPR: pRecord._id
                });

                await mongo.proyectoRecords.putProyectoRecord(pRecord._id, {
                    idP: proyecto._id,
                });

                return 1;
            } catch (error) {
                console.error(error.message);
                console.error(dataTD.name);

                return 0;
            }
        }

        return 2;
    });
}

const crossProyectsMJ = async(mongoP, jiraP) => {
    return jiraP.map(async(dataJ) => {
        const existe = mongoP.filter(dataM => parseInt(dataJ.id) === dataM.idJ);

        if (existe.length === 0) {
            try {
                const fecha = new Date();

                const pRecord = await mongo.proyectoRecords.postProyectoRecord({
                    idJ: parseInt(dataJ.id),
                    fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}`,
                    record: 0,
                    desarrollo: 0,
                    qa: 0,
                    listo: 0
                });

                const proyecto = await mongo.proyectos.postProyecto({
                    nombre: dataJ.name,
                    idJ: parseInt(dataJ.id),
                    imagen: 'https://res.cloudinary.com/nodecafe/image/upload/v1661290561/Dashboard/velez_pz7ltw.png',
                    idPR: pRecord._id
                });

                await mongo.proyectoRecords.putProyectoRecord(pRecord._id, {
                    idP: proyecto._id,
                });

                return 1;
            } catch (error) {
                console.error(error.message);
                console.error(dataJ.name);

                return 0;
            }
        }

        return 2;
    });
}

const disableProyects = async(proyectJ) => {
    return proyectJ.map(async(proyecto) => {
        try {
            const proyectoM = await mongo.proyectos.getProyecto(null, { idJ: proyecto.id });
            const proyectoE = await mongo.proyectos.putProyecto(proyectoM[0]._id, { estado: false });

            return proyectoE;
        } catch (error) {
            return 0;
        }
    });
}

const proyectoConRecord = (mongoP) => {
    return mongoP.map(async(dataP) => {
        try {
            const fecha = new Date();

            const pRecord = await mongo.proyectoRecords.postProyectoRecord({
                idP: dataP._id,
                idPT: dataP.idP,
                idJ: dataP.idJ,
                fecha: `${fecha.getMonth() + 1}/${fecha.getFullYear()}`,
                record: 0,
                desarrollo: 0,
                qa: 0,
                listo: 0
            });

            await mongo.proyectos.putProyecto(dataP._id ,{
                idPR: pRecord._id
            });

            return {...pRecord._doc};
        } catch (error) {
            console.error(error.message);
            console.error(dataTD.name);

            return 0;
        }
    });
}

const renombrarProy = async(mongoP, jiraP) => {
    return jiraP.map(async(dataJ) => {
        const existe = mongoP.filter(dataM => parseInt(dataJ.id) === dataM.idJ);

        if (existe[0] && existe[0].nombre != dataJ.name) {
            try {
                console.log(`Cambio de nombre ${existe[0].nombre} -> ${dataJ.nombre}`)
                await mongo.proyectos.putProyecto(existe[0]._id, {
                    nombre: dataJ.name
                });

                return 1;
            } catch (error) {
                console.error(error.message);
                console.error(dataJ.name);

                return 0;
            }
        }

        return 2;
    });
}

export {
    crossProyectsMD,
    crossProyectsMJ,
    disableProyects,
    proyectoConRecord,
    renombrarProy
}