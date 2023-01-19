const { response } = require('express');
const CryptoJS = require("crypto-js");

const { getComentario, putComentario, deleteComentario, getUser } = require('../services');

const obtenerComentarios = async(req, res = response) => {
    try {
        let { limite = 5, desde = 0 } = req.query;
        limite = parseInt(limite, 10);
        desde = parseInt(desde, 10);

        const comentariosP = await getComentario({ estado: true });

        if (comentariosP.msg)
            throw new Error(comentariosP.msg);

        const comentarios = [];

        for (let i = desde; i < limite; i++) {
            if (comentariosP.comentarios[i])
                comentarios.push(comentariosP.comentarios[i]);
        }

        let total;

        if (comentariosP.total < desde)
            total = 0;
        else
        if (comentariosP.total < (limite + desde))
            total = comentariosP.total - desde;
        else
            total = limite - desde;

        return res.status(200).json({
            total,
            comentarios
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerComentariosId = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDCO);
        const originalComentario = bytes.toString(CryptoJS.enc.Utf8);

        const { total, comentarios, msg } = await getComentario({ _id: originalComentario, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 1)
            throw new Error(`Algo salió mal al buscar los comentarios`);

        return res.status(200).json({
            total,
            comentarios
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerComentariosAct = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const { total, comentarios, msg } = await getComentario({ actividad: originalActividad, estado: true });

        if (msg)
            throw new Error(msg);

        if (total === 0)
            throw new Error(`No hay comentarios para esta actividad`);

        return res.status(200).json({
            comentarios: comentarios[0]
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const mandarComentario = async(req, res = response) => {
    const id = req.header('user');
    const { mensaje, conversacion, actividad } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(actividad, process.env.PASSWORDA);
        const originalActividad = bytes.toString(CryptoJS.enc.Utf8);

        const { comentarios, msg } = await getComentario({ actividad: originalActividad, estado: true });

        if (msg)
            throw new Error(msg);

        const usuario = await getUser({ _id: id, estado: true });

        if (usuario.msg)
            throw new Error(msg);

        if (usuario.total !== 1)
            throw new Error(`No se encontró su usuario`);

        const nombreC = `${usuario.usuarios[0].nombre} ${usuario.usuarios[0].apellidoP} ${usuario.usuarios[0].apellidoM}`;

        const bytesC = CryptoJS.AES.decrypt(comentarios[0]._id.toString(), process.env.PASSWORDCO);
        const originalComentario = bytesC.toString(CryptoJS.enc.Utf8);

        if (comentarios[0].comentarios.length === 0) {
            const data = {
                comentarios: [
                    [
                        [nombreC, mensaje]
                    ]
                ],
                actividad: originalActividad
            }

            const comentario = await putComentario(originalComentario, data);

            if (comentario.msg)
                throw new Error(comentario.msg);

            return res.status(200).json(comentario._id);
        } else {
            const comentariosE = comentarios[0].comentarios;

            if (comentariosE[conversacion])
                comentariosE[conversacion].push([nombreC, mensaje]);
            else
                comentariosE.push([
                    [nombreC, mensaje]
                ]);

            const comentario = await putComentario(originalComentario, { comentarios: comentariosE });
            console.log(4);


            if (comentario.msg)
                throw new Error(comentario.msg);

            return res.status(200).json(comentario._id);
        }
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const comentariosPatch = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDCO);
        const originalComentario = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteComentario(originalComentario, true);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);
        else
            return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const borrarComentario = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDCO);
        const originalComentario = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteComentario(originalComentario, null);

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
    obtenerComentarios,
    obtenerComentariosId,
    obtenerComentariosAct,
    mandarComentario,
    comentariosPatch,
    borrarComentario
}