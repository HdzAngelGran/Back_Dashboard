import * as services from '../services/index.js';

const proyectosUsuario = async(proyectos) => {
    return proyectos.map(async(proyecto) => {
        try {
            const proyectosUsuario = await services.mongo.proyectos.getProyecto(proyecto.idP, null);

            if (proyectosUsuario)
                return {
                    idUP: proyecto._id,
                    rolUP: proyecto.rol,
                    ...proyectosUsuario._doc
                }
            else {
                console.log('No se pudo obtener el proyecto');

                return 0;
            }
        } catch (error) {
            console.error(error.message);

            return 1;
        }
    });
}

const usuariosProyecto = async(usuarios) => {
    return usuarios.map(async(usuario) => {
        try {
            const usuariosProyecto = await services.mongo.usuarios.getUsuario(usuario.idU, null);

            if (usuariosProyecto)
                return {
                    idUP: usuario._id,
                    rolUP: usuario.rol,
                    ...usuariosProyecto._doc
                }
            else {
                console.log('No se pudo obtener el usuario');

                return 0;
            }
        } catch (error) {
            console.error(error.message);

            return 1;
        }
    });
}

const proyectosUsuarios = async(proyectos) => {
    return proyectos.map(async(proyecto) => {
        try {
            const proyectosUsuario = await services.mongo.usuarioProys.getUsuarioProy(null, {idP: proyecto._id});

            if (proyectosUsuario.length > 0) {
                const usuarios = await usuariosProyecto(proyectosUsuario);
                const contentU = await Promise.all(usuarios);

                return {
                    ...proyecto,
                    usuarios: contentU
                }
            }
            else        
                return {
                    ...proyecto,
                    usuarios: []
                }
        } catch (error) {
            return {
                ...proyecto,
                usuarios: []
            }
        }
    });
}

const usuariosProyectos = async(usuarios) => {
    return usuarios.map(async(usuario) => {
        try {
            const usuariosProyectos = await services.mongo.usuarioProys.getUsuarioProy(null, {idU: usuario._id});

            if (usuariosProyectos.length > 0) {
                const usuarios = await proyectosUsuario(usuariosProyectos);
                const contentP = await Promise.all(usuarios);

                return {
                    ...usuario._doc,
                    proyectos: contentP
                }
            }
            else        
                return {
                    ...usuario._doc,
                    proyectos: []
                }
        } catch (error) {
            return {
                ...usuario._doc,
                proyectos: []
            }
        }
    });
}

export {
    proyectosUsuario,
    usuariosProyecto,
    proyectosUsuarios,
    usuariosProyectos
}