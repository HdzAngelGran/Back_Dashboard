import { Router } from 'express';

import { usuarioProys } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/usuarioProys
 */

//  Obtener los proyectos y usuarios - privado/Admin
router.get('/usuario/', [
    middlewares.validarJWT.validarJWT
], usuarioProys.obtenerProyectosUsuario);
router.get('/proyecto/', [
    middlewares.validarJWT.validarJWT
], usuarioProys.obtenerUsuariosProyecto);

//  Unir un proyecto a un usuario - privado/Admin
router.post('/', [
    middlewares.validarJWT.validarJWT
], usuarioProys.crearUsuarioProy);

//  Actualizar el proyecto de un usuario - privado/Admin
router.put('/', [
    middlewares.validarJWT.validarJWT
], usuarioProys.actualizarUsuarioProy);

//  Eliminar el proyecto del usuario - privado/Admin
router.delete('/', [
    middlewares.validarJWT.validarJWT
], usuarioProys.eliminarUsuarioProy);

export { router };