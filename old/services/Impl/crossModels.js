const CryptoJS = require("crypto-js");

const { getActividad, getCalificacion, getUser } = require("..");

const actWithCal = async(actividades, estudiante) => {
    const actividad = [];

    try {
        for (let i = 0; i < actividades.length; i++) {
            if (actividades[i].juego) {
                const bytesA = CryptoJS.AES.decrypt(actividades[i]._id, process.env.PASSWORDA);
                const originalActividad = bytesA.toString(CryptoJS.enc.Utf8);

                const calificacion = await getCalificacion({
                    estudiante,
                    actividad: originalActividad,
                    estado: true
                });

                if (calificacion.msg)
                    throw new Error(calificacion.msg);

                actividad.push({
                    ...actividades[i],
                    calificacion: {
                        calificacion: calificacion.calificaciones[0].calificacion,
                        realizada: calificacion.calificaciones[0].realizada,
                        intentos: calificacion.calificaciones[0].intentos
                    }
                });
            } else {
                actividad.push({...actividades[i] });
            }
        };

        return actividad;
    } catch (e) {
        return { msg: e.message }
    }
}

const insWithCal = async(inscripciones) => {
    const calificacionI = [];

    try {
        for (let i = 0; i < inscripciones.length; i++) {
            const calificacionP = await getCalificacion({ estudiante: inscripciones[i].estudiante, estado: true });

            if (calificacionP.msg)
                throw new Error(calificacionP.msg);

            const calificacion = calificacionP.calificaciones.map(calificacion => {
                const bytesA = CryptoJS.AES.decrypt(calificacion.actividad.toString(), process.env.PASSWORDA);
                const originalActividad = bytesA.toString(CryptoJS.enc.Utf8);

                return {
                    ...calificacion,
                    actividad: originalActividad
                }
            });

            calificacionI.push(calificacion);
        };

        return calificacionI;
    } catch (e) {
        return { msg: e.message }
    }
}

const matWithAct = async(materias) => {
    const materiaA = [];

    try {
        for (let i = 0; i < materias.length; i++) {
            const bytes = CryptoJS.AES.decrypt(materias[i]._id, process.env.PASSWORDM);
            const originalMateria = bytes.toString(CryptoJS.enc.Utf8);

            const actividades = await getActividad({ materia: originalMateria, estado: true, disponible: true });

            if (actividades.msg)
                throw new Error(actividades.msg);

            if (actividades.total !== 0) {
                const actDisponibles = actividades.actividades.map(actividad => {
                    const bytesA = CryptoJS.AES.decrypt(actividad._id, process.env.PASSWORDA);
                    const originalActividad = bytesA.toString(CryptoJS.enc.Utf8);

                    return {
                        actividad: originalActividad,
                        nombre: actividad.nombre
                    }
                }).filter(notUndefined => notUndefined !== undefined);

                materiaA.push({
                    nombre: materias[i].nombre,
                    actividades: actDisponibles
                });
            }
        };

        return materiaA;
    } catch (error) {
        return { msg: e.message }
    }
}

const userWithInscrito = async(inscritos) => {
    const userI = [];

    try {
        for (let i = 0; i < inscritos.length; i++) {
            const usuario = await getUser({ _id: inscritos[i].estudiante, estado: true });

            if (usuario.msg)
                throw new Error(calificacion.msg);

            userI.push({
                nombreC: `${usuario.usuarios[0].nombre} ${usuario.usuarios[0].apellidoP} ${usuario.usuarios[0].apellidoM}`,
                inscripcion: inscritos[i]._id
            });
        };

        return userI;
    } catch (e) {
        return { msg: e.message }
    }
}

module.exports = {
    actWithCal,
    insWithCal,
    matWithAct,
    userWithInscrito
}