import { Router } from 'express';

import { proyectos } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/proyectos
 */

//  Obtener los proyectos - privado/Admin
router.get('/', [
    middlewares.validarJWT.validarJWT
], proyectos.obtenerProyectos);
router.get('/unico/', [
    middlewares.validarJWT.validarJWT
], proyectos.obtenerProyecto);
router.get('/tareas/tipo/', [
    middlewares.validarJWT.validarJWT
], proyectos.obtenerTareasPorTipo);
router.put('/actualizarImagen', [
    middlewares.validarJWT.validarJWT
], proyectos.actualizarImagenProyecto);

router.put('/', proyectos.actualizarProyecto);

export { router };