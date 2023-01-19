const { response } = require('express');
const bcryptjs = require('bcryptjs')
const CryptoJS = require("crypto-js");

const { generarJWT, comprobarJWT } = require('../helpers');
const { getUser } = require('../services');

const renovarToken = async(req, res = response) => {
    const { usuario } = req;

    try {
        const token = await generarJWT(usuario.id, usuario.rol);

        if (!token)
            throw new Error(`Error al generar el token`)

        res.status(200).json({
            usuario,
            token
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerToken = async(req, res = response) => {
    const { token } = req.params;

    try {
        const webToken = await comprobarJWT(token);

        if (webToken)
            res.status(200).json(webToken);
        else
            throw new Error(`Token expirado`);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const login = async(req, res = response) => {
    const { correo, password } = req.body;

    try {
        // Verificar si el email existe
        const { usuarios, msg } = await getUser({ correo, estado: true });

        if (msg)
            throw new Error(msg);

        if (!usuarios[0])
            throw new Error('Usuario no correcto - correo');

        // SI el usuario está activo
        if (!usuarios[0].estado)
            throw new Error('Usuario no activo - estado: false');

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuarios[0].password);

        if (!validPassword)
            throw new Error('Usuario no correcto - password');

        // Generar el JWT
        const token = await generarJWT(usuarios[0].id, usuarios[0].rol);

        usuarios[0].id = CryptoJS.AES.encrypt(usuarios[0].id.toString(), process.env.PASSWORDU).toString();

        res.json({
            usuario: usuarios[0],
            token
        })

    } catch (e) {
        console.log(e);

        return res.status(406).json({ msg: e.message });
    }
}

module.exports = {
    renovarToken,
    obtenerToken,
    login
}