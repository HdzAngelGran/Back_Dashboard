const { response } = require('express');
const CryptoJS = require("crypto-js");

const {
    getInscrito,
    postInscrito,
    getGrupo,
    getMateria,
    putInscrito,
    deleteInscrito,
} = require("../services");
const { userWithInscrito, actCreateCal, matWithAct } = require('../services/Impl');

const obtenerInscritos = async(req, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);

    try {
        const inscritosP = await getInscrito({ estado: true });

        if (inscritosP.msg)
            throw new Error(inscritosP.msg);

        if (inscritosP.total === 0)
            throw new Error(`No existen inscritos en la DB`)

        const inscritos = [];

        for (let i = desde; i < limite; i++) {
            if (inscritosP.inscritos[i])
                inscritos.push(inscritosP.inscritos[i]);
        }

        let total;

        if (inscritosP.total < desde)
            total = 0;
        else
        if (inscritosP.total < (limite + desde))
            total = inscritosP.total - desde;
        else
            total = limite - desde;

        return res.status(200).json({
            total,
            inscritos
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerEstudiantesGrupo = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const inscritos = await getInscrito({ grupo: originalGrupo, estado: true });

        if (inscritos.msg)
            throw new Error(inscritos.msg);

        const userI = await userWithInscrito(inscritos.inscritos)

        if (userI.msg)
            throw new Error(userI.msg);

        return res.status(200).json(userI);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerGrupoEst = async(req, res = response) => {
    const id = req.header('user');

    try {
        const { inscritos, total, msg } = await getInscrito({ estudiante: id, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 1)
            throw new Error(`Error al buscar inscripciones a grupos`);

        const bytes = CryptoJS.AES.decrypt(inscritos[0].grupo, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const grupo = await getGrupo({ _id: originalGrupo });

        if (grupo.msg)
            throw new Error(grupo.msg);

        if (grupo.total !== 1)
            throw new Error(`Error al conseguir el grupo del estudiante`);

        return res.status(200).json({
            total: total,
            grupo: grupo.grupos[0]
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerInscritoId = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDI);
        const originalInscrito = bytes.toString(CryptoJS.enc.Utf8);

        const { total, inscritos, msg } = await getInscrito({ _id: originalInscrito, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 1)
            throw new Error(`No existen inscritos en la DB`)

        return res.status(200).json(inscritos[0]);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const crearInscrito = async(req, res = response) => {
    const { estado, codigo, ...body } = req.body;

    try {
        /*
        const bytes = CryptoJS.AES.decrypt(codigo, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);
        */
        const originalGrupo = codigo;

        const grupo = await getGrupo({ _id: originalGrupo, estado: true });

        if (grupo.msg)
            throw new Error(grupo.msg);

        if (grupo.total !== 1)
            throw new Error(`Error al obtener el grupo`);

        if (!grupo.grupos[0].disponible)
            throw new Error(`El grupo ${originalGrupo} no permite inscripciones ahora mismo`);

        const inscritoDB = await getInscrito({ estudiante: body.estudiante, estado: true });

        if (inscritoDB.msg)
            throw new Error(inscritoDB.msg);

        if (inscritoDB.total !== 0)
            throw new Error(`Ya estás inscrito a un grupo`);

        const materias = await getMateria({ grupo: originalGrupo, estado: true });

        if (materias.msg)
            throw new Error(materias.msg);

        if (materias.total === 0)
            throw new Error(`Error al obtener las materias`);

        const actividades = await matWithAct(materias.materias);

        if (actividades.msg)
            throw new Error(actividades.msg);

        if (actividades.length !== 0) {
            const actsT = [];

            actividades.forEach(actividad => {
                actividad.actividades.forEach(actividadesO => {
                    actsT.push(actividadesO);
                });
            });

            const calificaciones = await actCreateCal(actsT, body.estudiante);

            if (calificaciones.msg)
                throw new Error(calificaciones.msg);
        }

        const inscrito = await postInscrito({
            estudiante: body.estudiante,
            grupo: originalGrupo
        });

        if (inscrito.msg)
            throw new Error(inscrito.msg);

        return res.status(200).json(inscrito._id);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const actualizarInscrito = async(req, res = response) => {
    const id = req.header('id');
    const { grupo } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDI);
        const originalInscrito = bytes.toString(CryptoJS.enc.Utf8);

        const inscritoDB = await getInscrito({ _id: originalInscrito, estado: true });

        if (inscritoDB.msg)
            throw new Error(inscritoDB.msg);

        if (inscritoDB.total !== 1)
            throw new Error(`Error al conseguir las inscripciones a un grupo`)

        if (!inscritoDB.inscritos[0].estado)
            throw new Error(`No se encontró al alumno inscrito`);

        const bytesG = CryptoJS.AES.decrypt(grupo.toString(), process.env.PASSWORDG);
        const originalGrupo = bytesG.toString(CryptoJS.enc.Utf8);

        const inscrito = await putInscrito(originalInscrito, { grupo: originalGrupo });

        return res.status(200).json(inscrito);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const inscritoPatch = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDI);
        const originalInscrito = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteInscrito(originalInscrito, true);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg)
        else
            return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const borrarInscrito = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDI);
        const originalInscrito = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteInscrito(originalInscrito, null);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);
        else
            return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

module.exports = {
    crearInscrito,
    obtenerInscritos,
    obtenerGrupoEst,
    obtenerEstudiantesGrupo,
    obtenerInscritoId,
    actualizarInscrito,
    borrarInscrito,
    inscritoPatch
}