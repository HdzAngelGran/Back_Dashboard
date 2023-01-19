import { Router } from 'express';

import { mensajes } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/mensajes
 */

//  Obtener los mensajes - privado/Admin
router.get('/', [
    middlewares.validarJWT.validarJWT
], mensajes.obtenerMensajes);
router.get('/unico/', [
    middlewares.validarJWT.validarJWT
], mensajes.obtenerMensaje);

//  Crear un mensaje - privado/Admin
router.post('/', [
    middlewares.validarJWT.validarJWT
], mensajes.crearMensaje);

//  Actualizar un mensaje - privado/Admin
router.put('/', [   
    middlewares.validarJWT.validarJWT
], mensajes.actualizarMensaje);

export { router };