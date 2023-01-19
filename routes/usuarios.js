import { Router } from 'express';

import { usuarios } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/usuarios
 */

//  Obtener los usuarios - privado/Admin
router.get('/', [
    middlewares.validarJWT.validarJWT
], usuarios.obtenerUsuarios);

router.get('/unico/', [
    middlewares.validarJWT.validarJWT
], usuarios.obtenerUsuario);

//  Actualizar la sesión del usuario - privado/Admin
router.put('/first/login/', [
    middlewares.validarJWT.validarJWTFirstLogin
], usuarios.firstLogin);

export { router };