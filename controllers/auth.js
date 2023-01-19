import { response, request } from 'express';
import CryptoJS from "crypto-js";

import { mongo } from '../services/index.js';
import * as helpers from '../helpers/index.js';

const login = async(req = request, res = response) => {
    const roles = ['DIR', 'PM'];
    try {
        const { email, password } = req.body;

        const user = await mongo.usuarios.getUsuario(null, { email });

        if(!roles.includes(user[0].rol.nombre))
            return res.status(406).json({ msg: `${user[0].nombre} no tiene permisos para acceder a la aplicación` });
        else{
            if (user.length === 0)
                throw new Error('Usuario no encontrado');
    
            let bytes = CryptoJS.AES.decrypt(user[0].password, process.env.SECONDTOKEN);
            let originalPass = bytes.toString(CryptoJS.enc.Utf8);
            bytes = CryptoJS.AES.decrypt(originalPass, process.env.FIRSTTOKEN);
            originalPass = bytes.toString(CryptoJS.enc.Utf8);
    
            if (originalPass !== password) {
                throw new Error('Contraseña incorrecta');
            }
    
            const token = await helpers.jwt.generarJWT(user[0]._id, user[0].idU, user[0].rol.nombre);
    
            return res.status(200).json({
                user: user[0].idU,
                imagen: user[0].imagen,
                nombre: user[0].nombre,
                rol: user[0].rol.nombre,
                sesion: user[0].sesion,
                token
            });
        }
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerToken = async(req, res = response) => {
    const token = req.headers.jwt;

    try {
        const webToken = await helpers.jwt.comprobarJWT(token);

        if (webToken)
            res.status(200).json(webToken);
        else
            throw new Error(`Token expirado`);
    } catch (e) {
        console.error(e.message);

        return res.status(401).json({ msg: e.message });
    }
}

const renovarToken = async(req, res = response) => {
    const token = req.headers.jwt;

    try {
        const webToken = await helpers.jwt.comprobarJWT(token);
        const tokenF = await helpers.jwt.generarJWT(webToken.usuario.id, webToken.usuario.uid, webToken.usuario.rol);

        if (!tokenF)
            throw new Error(`Error al generar el token`);

        res.status(200).json({
            tokenF
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

export {
    login,
    obtenerToken,
    renovarToken
}