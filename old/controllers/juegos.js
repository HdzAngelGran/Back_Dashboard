const { response } = require('express');
const CryptoJS = require("crypto-js");

const {
    getJuego,
    postJuego,
    putJuego,
    deleteJuego,
    getRespuesta,
    postRespuesta,
    putRespuesta,
    getActividad,
    putActividad,
    getMateria,
    getInscrito,
    getCalificacion,
    putCalificacion,
    getUser,
    postComentario
} = require("../services");
const { insCreateCal } = require('../services/Impl');

const obtenerJuegos = async(req, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);

    try {
        const juegosP = await getJuego({});

        if (juegosP.msg)
            throw new Error(juegosP.msg);

        if (juegosP.total === 0)
            throw new Error(`No existen juegos en la DB`)

        const juegos = [];

        for (let i = desde; i < limite; i++) {
            if (juegosP.juegos[i])
                juegos.push(juegosP.juegos[i]);
        }

        let total;

        if (juegosP.total < desde)
            total = 0;
        else
        if (juegosP.total < (limite + desde))
            total = juegosP.total - desde;
        else
            total = limite - desde;

        return res.status(200).json({
            total,
            juegos
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerJuegosA = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const { juegos, total, msg } = await getJuego({ actividad: originalActividad, estado: true });

        if (msg)
            throw new Error(msg);

        if (total === 0)
            throw new Error(`No existen juegos en la DB`);

        return res.status(200).json({
            total,
            juegos
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerJuegoId = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDJ);
        const originalJuego = bytes.toString(CryptoJS.enc.Utf8);

        const { juegos, total, msg } = await getJuego({ _id: originalJuego, estado: true });

        if (msg)
            throw new Error(msg);

        if (total === 0)
            throw new Error(`No existen juegos en la DB`);

        return res.status(200).json({
            total,
            juegos
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const codigoJuego = async(req, res = response) => {
    const id = req.header('id');
    const idEst = req.header('user');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDJ);
        const originalJuego = bytes.toString(CryptoJS.enc.Utf8);

        const { juegos, total, msg } = await getJuego({ _id: originalJuego, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 1)
            throw new Error(`Error al obtener el juego`);

        const { msg: msgU, usuarios } = await getUser({ _id: idEst });

        if (msgU)
            throw new Error(msgU);

        const bytesA = CryptoJS.AES.decrypt(juegos[0].actividad, process.env.PASSWORDA);
        const originalActividad = bytesA.toString(CryptoJS.enc.Utf8);

        const { actividades, total: totalA, msg: msgA } = await getActividad({ _id: originalActividad, estado: true });

        if (msgA)
            throw new Error(msgA);

        if (totalA !== 1)
            throw new Error(`Error al obtener la actividad`);

        if (usuarios[0].role === 'EST_ROLE') {
            const calificacionE = await getCalificacion({
                estudiante: idEst,
                actividad: originalActividad,
                estado: true
            });

            if (calificacionE.calificaciones[0].intentos < 1)
                throw new Error(`Ya no tienes oportunidades para jugar este juego`);
        }

        return res.status(200).json({ codigo: juegos[0].codigo, tiempo: juegos[0].tiempo });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const respuestasJuego = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDJ);
        const originalJuego = bytes.toString(CryptoJS.enc.Utf8);

        const juego = await getJuego({ _id: originalJuego, estado: true });

        if (juego.msg)
            throw new Error(juego.msg);

        if (juego.total !== 1)
            throw new Error(`Error al obtener el juego`);

        let bytesR = CryptoJS.AES.decrypt(juego.juegos[0].respuesta.toString(), process.env.PASSWORDJ);
        let originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

        bytesR = CryptoJS.AES.decrypt(originalRespuesta, process.env.PASSWORDR);
        originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

        const respuesta = await getRespuesta({ _id: originalRespuesta, estado: true });

        if (respuesta.msg)
            throw new Error(respuesta.msg);

        if (respuesta.total !== 1)
            throw new Error(`Error al obtener las respuestas`);

        return res.status(200).json(respuesta.respuestas[0]);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const crearJuego = async(req, res = response) => {
    const idProf = req.header('user');
    const idAct = req.header('idAct');

    try {
        const bytes = CryptoJS.AES.decrypt(idAct, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const { total, juegos, msg } = await getJuego({ actividad: originalActividad, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 0)
            await juegos.forEach(async(juego) => {
                const bytesJ = CryptoJS.AES.decrypt(juego._id, process.env.PASSWORDJ);
                const originalJuego = bytesJ.toString(CryptoJS.enc.Utf8);

                if (juego.blocked)
                    throw new Error(`Esta actividad ya contiene un juego`);
                else
                    await deleteJuego(originalJuego, null);
            });

        const data = {
            actividad: originalActividad,
            profesor: idProf
        }

        const juego = await postJuego(data);

        if (juego.msg)
            throw new Error(juego.msg);

        return res.status(200).json(juego._id);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const responderJuego = async(req, res = response) => {
    const idEst = req.header('user');
    const id = req.header('id');
    const { respuestas } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const { actividades, msg } = await getActividad({ _id: originalActividad, estado: true });

        if (msg)
            throw new Error(msg);

        if (!actividades[0].juego.blocked)
            throw new Error(`El juego no está terminado`);

        const bytesJ = CryptoJS.AES.decrypt(actividades[0].juego._id.toString(), process.env.PASSWORDJ);
        const originalJuego = bytesJ.toString(CryptoJS.enc.Utf8);

        const juego = await getJuego({ _id: originalJuego, estado: true });

        if (juego.msg)
            throw new Error(juego.msg);

        let bytesR = CryptoJS.AES.decrypt(juego.juegos[0].respuesta.toString(), process.env.PASSWORDJ);
        let originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

        bytesR = CryptoJS.AES.decrypt(originalRespuesta, process.env.PASSWORDR);
        originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

        const respuesta = await getRespuesta({ _id: originalRespuesta, estado: true });

        if (respuesta.msg)
            throw new Error(respuesta.msg);

        const calificacionE = await getCalificacion({
            estudiante: idEst,
            actividad: originalActividad
        });

        if (calificacionE.msg)
            throw new Error(calificacionE.msg);

        if (calificacionE.calificaciones[0].intentos < 1)
            throw new Error(`Ya no tienes oportunidades para jugar este juego`);

        const respuestasB = [];
        let resultado = 0;

        if (respuesta.respuestas[0].respuestas.length !== respuestas.length)
            throw new Error(`Hubo un error al mandar tus respuestas. Enviadas:${respuestas.length}, Totales:${respuesta.respuestas.length}`);

        const bytesC = CryptoJS.AES.decrypt(calificacionE.calificaciones[0]._id.toString(), process.env.PASSWORDC);
        const originalCalificacion = bytesC.toString(CryptoJS.enc.Utf8);

        respuesta.respuestas[0].respuestas.forEach((respuesta, index) => {
            if (respuesta == respuestas[index]) {
                respuestasB.push('o');
                resultado++;
            } else
                respuestasB.push('x');
        });

        resultado = (resultado * 10 / respuestasB.length).toFixed(2);

        let dataC;

        if (calificacionE.calificaciones[0].calificacion < resultado)
            dataC = {
                realizada: true,
                calificacion: resultado,
                intentos: calificacionE.calificaciones[0].intentos - 1
            }
        else
            dataC = {
                realizada: true,
                intentos: calificacionE.calificaciones[0].intentos - 1
            }

        const calificacion = await putCalificacion(originalCalificacion, dataC);

        if (calificacion.msg)
            throw new Error(calificacion.msg);

        return res.status(200).json({
            intentos: calificacionE.calificaciones[0].intentos - 1,
            calificacion: resultado,
            respuestas: respuestasB
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const responderMemorama = async(req, res = response) => {
    const idEst = req.header('user');
    const id = req.header('id');
    const { respuestas } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const { actividades, msg } = await getActividad({ _id: originalActividad, estado: true });

        if (msg)
            throw new Error(msg);

        if (!actividades[0].juego.blocked)
            throw new Error(`El juego no está terminado`);

        const bytesJ = CryptoJS.AES.decrypt(actividades[0].juego._id.toString(), process.env.PASSWORDJ);
        const originalJuego = bytesJ.toString(CryptoJS.enc.Utf8);

        const juego = await getJuego({ _id: originalJuego, estado: true });

        if (juego.msg)
            throw new Error(juego.msg);

        let bytesR = CryptoJS.AES.decrypt(juego.juegos[0].respuesta.toString(), process.env.PASSWORDJ);
        let originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

        bytesR = CryptoJS.AES.decrypt(originalRespuesta, process.env.PASSWORDR);
        originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

        const respuesta = await getRespuesta({ _id: originalRespuesta, estado: true });

        if (respuesta.msg)
            throw new Error(respuesta.msg);

        const calificacionE = await getCalificacion({
            estudiante: idEst,
            actividad: originalActividad
        });

        if (calificacionE.msg)
            throw new Error(calificacionE.msg);

        if (calificacionE.calificaciones[0].intentos < 1)
            throw new Error(`Ya no tienes oportunidades para jugar este juego`);

        const respuestasB = [];
        let resultado = 0;
        //console.log(respuesta.respuestas[0].);
        const respuestaArray = respuesta.respuestas[0].respuestas[0].split('/?');
        const respuestaMatriz = respuestaArray.map(respuesta => {
            return respuesta.split(',');
        });

        if (respuestaMatriz.length !== respuestas.length)
            throw new Error(`Hubo un error al mandar tus respuestas. Enviadas:${respuestas.length}, Totales:${respuesta.respuestas.length}`);

        const bytesC = CryptoJS.AES.decrypt(calificacionE.calificaciones[0]._id.toString(), process.env.PASSWORDC);
        const originalCalificacion = bytesC.toString(CryptoJS.enc.Utf8);
        let bandera = 0;

        respuestas.forEach(respuestas => {
            bandera = 0;
            let i = 0;
            while (i < respuestaMatriz.length && bandera === 0) {
                if (respuestaMatriz[i][0] == respuestas[0])
                    if (respuestaMatriz[i][1] == respuestas[1]) {
                        respuestasB.push('o');
                        resultado++;
                        bandera = 1;
                    }
                if (respuestaMatriz[i][0] == respuestas[1])
                    if (respuestaMatriz[i][1] == respuestas[0]) {
                        respuestasB.push('o');
                        resultado++;
                        bandera = 1;
                    }
                if (bandera === 1)
                    respuestaMatriz.splice(i, 1);
                i++;
            }
            if (bandera === 0)
                respuestasB.push('x');
        });

        const paresCorrectos = resultado;

        resultado = (resultado * 10 / respuestasB.length).toFixed(2);

        let dataC;

        if (calificacionE.calificaciones[0].calificacion < resultado)
            dataC = {
                realizada: true,
                calificacion: resultado,
                intentos: calificacionE.calificaciones[0].intentos - 1
            }
        else
            dataC = {
                realizada: true,
                intentos: calificacionE.calificaciones[0].intentos - 1
            }

        const calificacion = await putCalificacion(originalCalificacion, dataC);

        if (calificacion.msg)
            throw new Error(calificacion.msg);

        return res.status(200).json({
            intentos: calificacionE.calificaciones[0].intentos - 1,
            calificacion: resultado,
            pares: paresCorrectos
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const actualizarJuego = async(req, res = response) => {
    const id = req.header('id');
    const { codigo, respuestas } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDJ);
        const originalJuego = bytes.toString(CryptoJS.enc.Utf8);

        const juegoE = await getJuego({ _id: originalJuego, estado: true });

        if (juegoE.msg)
            throw new Error(juegoE.msg);

        let respuesta;

        if (juegoE.juegos[0].respuesta) {
            let bytesR = CryptoJS.AES.decrypt(juegoE.juegos[0].respuesta, process.env.PASSWORDJ);
            let originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

            bytesR = CryptoJS.AES.decrypt(originalRespuesta, process.env.PASSWORDR);
            originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

            const respuestaE = await getRespuesta({ _id: originalRespuesta, estado: true });

            if (respuestaE.msg)
                throw new Error(respuestaE.msg);

            respuesta = await putRespuesta(originalRespuesta, { respuestas });

            if (respuesta.msg)
                throw new Error(`El juego debe tener respuestas`);
        } else {
            respuesta = await postRespuesta({ respuestas });

            if (respuesta.msg)
                throw new Error(respuesta.msg);
        }

        const juego = await putJuego(originalJuego, { codigo, respuesta: respuesta._id.toString() });

        if (juego.msg)
            throw new Error(juego.msg);

        return res.status(200).json(juego._id);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const terminarJuego = async(req, res = response) => {
    const idAct = req.header('idAct');
    const id = req.header('id');
    const { codigo, respuestas, intentos, tipoJuego, tiempo } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDJ);
        const originalJuego = bytes.toString(CryptoJS.enc.Utf8);

        if (!codigo)
            throw new Error(`No contiene código`);

        if (!respuestas)
            throw new Error(`El juego debe tener respuestas`);

        if (!intentos)
            throw new Error(`Debe especificar el número de intentos`);

        if (!tipoJuego)
            throw new Error(`Error al cargar el tipo de juego`);

        if (!tiempo)
            throw new Error(`Debe especificar el timepo total`);

        if (respuestas.length < 1)
            throw new Error(`El juego debe tener respuestas`);

        const juegoE = await getJuego({ _id: originalJuego, estado: true });
        if (juegoE.msg)
            throw new Error(juegoE.msg);

        if (juegoE.juegos[0].codigo == '' || !juegoE.juegos[0].respuesta)
            throw new Error(`El juego debe probarse minimo una vez`);

        if (juegoE.juegos[0].blocked)
            throw new Error(`El juego de esta actividad, ya fue creado`);

        let bytesR = CryptoJS.AES.decrypt(juegoE.juegos[0].respuesta, process.env.PASSWORDJ);
        let originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);
        bytesR = CryptoJS.AES.decrypt(originalRespuesta, process.env.PASSWORDR);
        originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

        const respuestaE = await getRespuesta({ _id: originalRespuesta, estado: true });

        if (respuestaE.msg)
            throw new Error(respuestaE.msg);

        if (respuestaE.total !== 1)
            throw new Error(`Error al obtener las respuestas`);

        const respuesta = await putRespuesta(originalRespuesta, { respuestas: respuestas });

        if (respuesta.msg)
            throw new Error(respuesta.msg);

        const bytesA = CryptoJS.AES.decrypt(idAct, process.env.PASSWORDA);
        const originalAct = bytesA.toString(CryptoJS.enc.Utf8);

        const actividadData = {
            disponible: true,
            juego: originalJuego,
            intentos,
            tipoJuego
        }

        const actividad = await putActividad(originalAct, actividadData);
        if (actividad.msg)
            throw new Error(actividad.msg);

        const comentario = await postComentario({ actividad: originalAct, comentario: [] });
        if (comentario.msg)
            throw new Error(comentario.msg);

        const dataJ = {
            codigo,
            respuesta: respuesta._id.toString(),
            blocked: true,
            tiempo
        }

        const actJuego = await putJuego(originalJuego, dataJ);
        if (actJuego.msg)
            throw new Error(actJuego.msg);

        const bytesM = CryptoJS.AES.decrypt(actividad.materia, process.env.PASSWORDM);
        const originalMateria = bytesM.toString(CryptoJS.enc.Utf8);

        const materia = await getMateria({ _id: originalMateria, estado: true });
        if (materia.msg)
            throw new Error(materia.msg);

        const bytesG = CryptoJS.AES.decrypt(materia.materias[0].grupo._id.toString(), process.env.PASSWORDG);
        const originalGrupo = bytesG.toString(CryptoJS.enc.Utf8);

        const inscritos = await getInscrito({ grupo: originalGrupo, estado: true });
        if (inscritos.msg)
            throw new Error(inscritos.msg);

        if (inscritos.total > 0) {
            const calificaciones = await insCreateCal(inscritos.inscritos, actividad)
            if (calificaciones.msg)
                throw new Error(calificaciones.msg);
        }

        return res.status(200).json(idAct);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const juegosPatch = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDJ);
        const originalJuego = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteJuego(originalJuego, true);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg)
        else
            return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const borrarJuego = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDJ);
        const originalJuego = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteJuego(originalJuego, null);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg)
        else
            return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

module.exports = {
    obtenerJuegos,
    obtenerJuegosA,
    obtenerJuegoId,
    crearJuego,
    actualizarJuego,
    codigoJuego,
    respuestasJuego,
    responderJuego,
    responderMemorama,
    terminarJuego,
    juegosPatch,
    borrarJuego
}