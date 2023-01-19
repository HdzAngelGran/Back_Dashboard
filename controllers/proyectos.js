import { response, request } from 'express';

import * as services from '../services/index.js';
import * as mappings from '../mapping/index.js';

const obtenerProyecto = async(req = request, resp = response) => {
    try {
        const { id } = req.headers;
        const proyM = await services.mongo.proyectos.getProyecto(id, null);

        return resp.status(200).json({proyecto: proyM});
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const obtenerProyectos = async(req = request, resp = response) => {
    try {
        const estado = req.headers.estado;
        let proyM;

        if(estado)
            proyM = await services.mongo.proyectos.getProyecto(null, { estado: estado });
        else
            proyM = await services.mongo.proyectos.getProyecto();
        
        const proyConRecord = await mappings.proyectos.proyectosConRecord(proyM);
        const contentPR = await Promise.all(proyConRecord);

        const proyUsuarios = await mappings.usuarioProys.proyectosUsuarios(contentPR);
        const contentPU = await Promise.all(proyUsuarios);

        return resp.status(200).json({
            contentM: contentPU.sort(function(a, b) {
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

const obtenerTareasPorTipo = async(req = request, resp = response) => {
    try {
        const { id, tipo } = req.headers;
        const tablerosJ = services.jira.tableros.getTablerosProyectos();
        const proyM = await services.mongo.proyectos.getProyecto(id, null);
        const contentTJ = await tablerosJ;
        const proyTableros = mappings.proyectos.proyectosConTableros([proyM], contentTJ.values)[0];
        const proys = await mappings.proyectoRecords.proyectoConComentariosTareas(proyTableros);
        let estados = [];

        switch (tipo) {
            case 'desarrollo':
                estados = ['1 Backlog Dev.', '2 In Progress', '2.1 En pausa', '3 Listo para integrar'];
                break;
            case 'qa':
                estados = ['4 Listo para QA', '4.1 Listo sin QA'];
                break;
            case 'listo':
                estados = ['5 Listo con QA', '6 Done'];
                break;
            default:
                break;
        }

        const tareas = proys.tareas.map(tarea => {
            if(estados.includes(tarea.estadoN))
                return tarea;
            else
                return null;
        }).filter(tarea => tarea != null);
        
        return resp.status(200).json({
            tareas: tareas.map(tarea => {
                return {
                    key: tarea.key,
                    estadoN: tarea.estadoN,
                    asignada: tarea.asignada,
                    descripcion: tarea.descripcion,
                    worklog: tarea.worklog,
                    comentarios: tarea.comentarios
                }
            })
         });
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const actualizarImagenProyecto = async(req = request, resp = response) => {
    try {
        const { imagen, id } = req.body;

        const proyA = await services.mongo.proyectos.putProyecto(id, {imagen: imagen});
        
        if(proyA)
            return resp.status(200).json({ msg: 'Imagen de proyecto actualizada' });
        else
            throw new Error('Error al actualizar proyecto');
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

const actualizarProyecto = async(req = request, resp = response) => {
    try {
        const { estado, id } = req.body;

        const proyA = await services.mongo.proyectos.putProyecto(id, {estado: estado});
        
        if(proyA)
            return resp.status(200).json({ msg: 'Proyecto actualizado' });
        else
            throw new Error('Error al actualizar proyecto');
    } catch (e) {
        console.error(e.message);

        return resp.status(406).json({ msg: e.message });
    }
}

export {
    obtenerProyecto,
    obtenerProyectos,
    obtenerTareasPorTipo,
    actualizarImagenProyecto,
    actualizarProyecto
}