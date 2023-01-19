import { response, request } from 'express';
import CryptoJS from "crypto-js";

import * as services from '../services/index.js';
import * as mappings from '../mapping/index.js';

const obtenerUsuarios = async(req = request, resp = response) => {
    try {
        const usuarioM = await services.mongo.usuarios.getUsuario();

        const usuariosProys = await mappings.usuarioProys.usuariosProyectos(usuarioM);
        const contentUP = await Promise.all(usuariosProys);

        return resp.status(200).json({
            contentM: contentUP.sort(function(a, b) {
                if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
                    return 1;
                }
                if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
                    return -1;
                }
                return 0;
            })
        });
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const obtenerUsuario = async(req = request, resp = response) => {
    try {
        const usuario = await services.mongo.usuarios.getUsuario(null, { idU: req.headers.idu });
        const usuarioProys = await services.mongo.usuarioProys.getUsuarioProy(null, { idU: usuario[0]._id });
        const proyectos = await mappings.usuarioProys.proyectosUsuario(usuarioProys);
        const contentProys = await Promise.all(proyectos);

        const proyConRecord = await mappings.proyectos.proyectosConRecord(contentProys);
        const contentPR = await Promise.all(proyConRecord);

        return resp.status(200).json({
            usuario: usuario[0],
            proyectos: contentPR
        });
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const firstLogin = async(req = request, res = response) => {
    try {
        const { nombre, apellidoP, apellidoM, celular, imagen, password, email } = req.body;
        const passwordF = CryptoJS.AES.encrypt(CryptoJS.AES.encrypt(password.toString(), process.env.FIRSTTOKEN).toString(), process.env.SECONDTOKEN).toString();
        const user = await services.mongo.usuarios.getUsuario(null, { email });

        if (user.length === 0)
            throw new Error('Usuario no encontrado');

        if (user[0].sesion)
            throw new Error('Usuario ya inició sesión');

        const userF = await services.mongo.usuarios.putUsuario(user[0]._id, { nombre, apellidoP, apellidoM, celular, imagen, password: passwordF, sesion: true });

        return res.status(200).json({
            user: userF.idU,
            imagen: imagen,
            nombre: nombre,
            rol: userF.rol.nombre
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

export {
    obtenerUsuario,
    obtenerUsuarios,
    firstLogin
}