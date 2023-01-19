const { response } = require('express');
const CryptoJS = require("crypto-js");

const { getActividad, postActividad, putActividad, deleteActividad, getUser } = require("../services");
const { actWithCal } = require('../services/Impl');

const obtenerActividades = async(req, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);

    try {
        const actividadesP = await getActividad({});

        if (actividadesP.msg)
            throw new Error(actividadesP.msg);

        if (actividadesP.total === 0)
            throw new Error(`No existen actividades en la DB`)

        const actividades = [];

        for (let i = desde; i < limite; i++)
            if (actividadesP.actividades[i])
                actividades.push(actividadesP.actividades[i]);

        let total;

        if (actividadesP.total < desde)
            total = 0;
        else
        if (actividadesP.total < (limite + desde))
            total = actividadesP.total - desde;
        else
            total = limite - desde;

        return res.status(200).json({
            total,
            actividades
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerActividadesM = async(req, res = response) => {
    const idEst = req.header('user');
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDM);
        const originalMateria = bytes.toString(CryptoJS.enc.Utf8);

        const actividadesP = await getActividad({ materia: originalMateria, estado: true });

        if (actividadesP.msg)
            throw new Error(actividadesP.msg);

        if (actividadesP.total === 0)
            throw new Error(`No existen actividades en la DB`);

        let actividades;

        const estudiante = await getUser({ _id: idEst });

        if (estudiante.usuarios[0].rol == 'EST_ROLE') {
            actividades = await actWithCal(actividadesP.actividades, estudiante.usuarios[0]._id);

            if (actividades.msg)
                throw new Error(actividades.msg);
        } else
            actividades = actividadesP.actividades;

        return res.status(200).json({
            total: actividadesP.total,
            actividades
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerActividadId = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const { total, actividades, msg } = await getActividad({ _id: originalActividad, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 1)
            throw new Error(`No existen actividades en la DB`);

        return res.status(200).json(actividades[0]);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const crearActividad = async(req, res = response) => {
    const { estado, materia, juego, calificacion, tiempo, disponible, intentos, ...body } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(materia, process.env.PASSWORDM);
        const originalMateria = bytes.toString(CryptoJS.enc.Utf8);

        const { total, actividades, msg } = await getActividad({ materia: originalMateria });

        if (msg)
            throw new Error(msg);

        if (total !== 0)
            actividades.forEach(actividad => {
                if (actividad.nombre === body.nombre.toUpperCase())
                    throw new Error(`La actividad ${actividad.nombre} ya existe`);
            });

        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            materia: originalMateria
        }

        const actividad = await postActividad(data);

        if (actividad.msg)
            throw new Error(actividad.msg);

        return res.status(200).json(actividad._id);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const actualizarActividad = async(req, res = response) => {
    const id = req.header('id');
    const { nombre, descripcion, objetivo } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDA);

        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const actividad = await putActividad(originalActividad, {
            nombre: nombre.toUpperCase(),
            descripcion,
            objetivo
        });

        if (actividad.msg)
            throw new Error(actividad.msg);

        return res.status(200).json({
            actualizacion: `La actividad ${actividad.nombre} fue actualizada correctamente`
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const actividadesPatch = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteActividad(originalActividad, true);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);
        else
            return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const borrarActividad = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteActividad(originalActividad, null);

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
    obtenerActividades,
    obtenerActividadesM,
    obtenerActividadId,
    crearActividad,
    actualizarActividad,
    actividadesPatch,
    borrarActividad
}