import { Router } from 'express';

import { comentarios } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/comentarios
 */

//  Obtener todos los comentarios - privado/Admin
router.get('/', [
    middlewares.validarJWT.validarJWT
], comentarios.obtenerComentarios);

//  Crear un comentario - privado/Admin
router.post('/', [
    middlewares.validarJWT.validarJWT
], comentarios.crearComentario);

export { router };