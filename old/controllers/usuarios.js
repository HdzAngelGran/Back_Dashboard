const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers');
const { getUser, postUser, putUser, deleteUser } = require('../services');

const usuariosGet = async(req = request, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);

    try {
        const usuariosP = await getUser({ estado: true });

        if (usuariosP.msg)
            throw new Error(usuariosP.msg);

        if (usuariosP.total === 0)
            throw new Error(`No existen usuarios en la DB`)

        const usuarios = [];

        for (let i = desde; i < limite; i++) {
            if (usuariosP.usuarios[i])
                usuarios.push(usuariosP.usuarios[i]);
        }

        let total;

        if (usuariosP.total < desde)
            total = 0;
        else
        if (usuariosP.total < (limite + desde))
            total = usuariosP.total - desde;
        else
            total = limite - desde;

        return res.status(200).json({
            total,
            usuarios
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const usuarioGet = async(req = request, res = response) => {
    const id = req.header('user');

    try {
        const usuario = await getUser({ _id: id, estado: true });

        if (usuario.msg)
            throw new Error(msg);

        if (usuario.total !== 1)
            throw new Error(`No existen usuarios en la DB`);

        return res.status(200).json(usuario.usuarios[0]);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const usuariosPost = async(req, res = response) => {
    const { password, estado, ...body } = req.body;

    try {
        const usuarios = await getUser({ correo: body.correo, estado: true });

        if (usuarios.msg)
            throw new Error(usuarios.msg);

        if (usuarios.total > 0)
            throw new Error(`Este usuario ya está registrado`);

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        const passwordU = bcryptjs.hashSync(password, salt);

        const token = await postUser({
            ...body,
            password: passwordU,
        });

        if (token.msg)
            throw new Error(token.msg);

        return res.status(200).json(token);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const adminPost = async(req, res = response) => {
    const { nombre, apellidoP, apellidoM, correo, password, rol } = req.body;

    try {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        const pass = bcryptjs.hashSync(password, salt);

        // Guardar en BD
        const usuario = await postUser({ nombre, apellidoP, apellidoM, correo, password: pass, rol })

        if (usuario.msg)
            throw new Error(usuario.msg);

        // Generar el JWT
        const token = await generarJWT(usuario.id, usuario.rol);

        res.status(200).json({
            usuario,
            token
        })

    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });

    }
}

const usuariosPut = async(req, res = response) => {
    const id = req.header('user');
    const { nombre, apellidoP, apellidoM } = req.body;

    try {
        const usuario = await putUser(id, { nombre, apellidoP, apellidoM });

        if (usuario.msg)
            throw new Error(usuario.msg);

        res.status(200).json(usuario);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const usuariosPatch = async(req, res = response) => {
    const id = req.header('user');

    try {
        const eliminaciones = await deleteUser(id, 1);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const usuariosDelete = async(req, res = response) => {
    const id = req.header('user');

    try {
        const eliminaciones = await deleteUser(id, null);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

module.exports = {
    usuarioGet,
    usuariosGet,
    usuariosPost,
    adminPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}