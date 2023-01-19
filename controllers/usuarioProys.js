import { response, request } from 'express';
import * as services from '../services/index.js';
import * as mappings from '../mapping/index.js';

const obtenerProyectosUsuario = async(req = request, resp = response) => {
    try {
        const id = req.headers.id;

        const usuarioProys = await services.mongo.usuarioProys.getUsuarioProy(null, {idU: id});
        const proyectosUsuario = await mappings.usuarioProys.proyectosUsuario(usuarioProys);
        const contentProys = await Promise.all(proyectosUsuario);

        return resp.status(200).json({ proyectos: contentProys });
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const obtenerUsuariosProyecto = async(req = request, resp = response) => {
    try {
        const id = req.headers.id;

        const usuarioProys = await services.mongo.usuarioProys.getUsuarioProy(null, {idP: id});
        const proyectosUsuario = await mappings.usuarioProys.usuariosProyecto(usuarioProys);
        const contentUsuarios = await Promise.all(proyectosUsuario);

        return resp.status(200).json({ usuarios: contentUsuarios });
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const crearUsuarioProy = async(req = request, resp = response) => {
    try {
        const { idU, idP } = req.body;

        const usuarioProy = await services.mongo.usuarioProys.postUsuarioProy({idU, idP});

        return resp.status(200).json(usuarioProy);
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const actualizarUsuarioProy = async(req = request, resp = response) => {
    try {
        const { rol, id } = req.body;

        const usuarioProy = await services.mongo.usuarioProys.putUsuarioProy(id, {rol});

        return resp.status(200).json(usuarioProy);
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const eliminarUsuarioProy = async(req = request, resp = response) => {
    try {
        const id = req.headers.id;

        const usuarioProy = await services.mongo.usuarioProys.delUsuarioProy(id);

        return resp.status(200).json(usuarioProy);
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

export {
    obtenerProyectosUsuario,
    obtenerUsuariosProyecto,
    crearUsuarioProy,
    actualizarUsuarioProy,
    eliminarUsuarioProy
}