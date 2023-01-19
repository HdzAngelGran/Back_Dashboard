import { response, request } from 'express';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

import * as services from '../services/index.js';

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('jwt');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { id } = verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await services.mongo.usuarios.getUsuario(id, null);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if (!usuario.sesion) {
            return res.status(401).json({
                msg: 'Token no válido - el usuario nunca ha iniciado sesión'
            })
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

const validarJWTFirstLogin = async(req = request, res = response, next) => {
    const token = req.header('jwt');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const roles = ['DIR', 'PM'];
        const { id } = verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await services.mongo.usuarios.getUsuario(id, null);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if(!roles.includes(usuario.rol.nombre))
            return res.status(406).json({ msg: `${usuario.nombre} no tiene permisos para acceder a la aplicación` });

        next();
    } catch (error) {
        console.log(error);

        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

export {
    validarJWT,
    validarJWTFirstLogin
}