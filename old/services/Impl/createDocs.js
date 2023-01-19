const CryptoJS = require("crypto-js");

const { getActividad, postCalificacion, postMateria, postSep } = require("..");
const { putCalificacion } = require("../calificaciones");

const actCreateCal = async(actividades, inscrito) => {
    const calificaciones = [];

    try {
        for (let i = 0; i < actividades.length; i++) {
            const actividad = await getActividad({ _id: actividades[i].actividad });

            if (actividad.msg)
                throw new Error(actividad.msg);

            const body = {
                estudiante: inscrito,
                actividad: actividades[i].actividad,
                intentos: actividad.actividades[0].intentos
            }

            const calificacion = await postCalificacion(body);

            if (calificacion.msg)
                throw new Error(calificacion.msg);

            calificaciones.push(calificacion);
        }

        return calificaciones;
    } catch (e) {
        return { msg: e.message }
    }
}

const insCreateCal = async(inscritos, actividad) => {
    const calificaciones = [];
    const bytesA = CryptoJS.AES.decrypt(actividad._id, process.env.PASSWORDA);
    const originalAct = bytesA.toString(CryptoJS.enc.Utf8);

    try {
        for (let i = 0; i < inscritos.length; i++) {
            const body = {
                estudiante: inscritos[i].estudiante,
                intentos: actividad.intentos,
                actividad: originalAct
            }

            const calificacion = await postCalificacion(body);

            if (calificacion.msg)
                throw new Error(calificacion.msg);

            calificaciones.push(calificacion);
        }

        return calificaciones;
    } catch (e) {
        return { msg: e.message }
    }
}

const sepCreateMat = async(seps, grupo) => {
    const materias = [];

    try {
        for (let i = 0; i < seps.length; i++) {
            const body = {
                nombre: seps[i].nombre.toUpperCase(),
                color: '#ffb4a2',
                grupo
            }

            const materia = await postMateria(body);

            if (materia.msg)
                throw new Error(materia.msg);

            materias.push(materia);
        }

        return materias;
    } catch (e) {
        return { msg: e.message }
    }
}

const matCreateSep = async(seps) => {
    const materias = [];

    try {
        for (let i = 0; i < seps.length; i++) {
            const materia = await postSep({...seps[i] });

            if (materia.msg)
                throw new Error(materia.msg);

            materias.push(materia);
        }

        return materias;
    } catch (e) {
        return { msg: e.message }
    }
}

const actCal = async(calificacion) => {
    const calificaciones = [];

    try {
        for (let i = 0; i < calificacion.length; i++) {
            const bytes = CryptoJS.AES.decrypt(calificacion[i]._id, process.env.PASSWORDC);
            const originalCalificacion = bytes.toString(CryptoJS.enc.Utf8);

            const cali = Math.floor(Math.random() * 11);
            const calAct = await putCalificacion(originalCalificacion, { calificacion: cali, realizada: true });

            if (calAct.msg)
                throw new Error(calAct.msg);

            calificaciones.push(cali);
        }

        return calificaciones;
    } catch (e) {
        return { msg: e.message }
    }
}

module.exports = {
    actCreateCal,
    insCreateCal,
    sepCreateMat,
    matCreateSep,
    actCal
}