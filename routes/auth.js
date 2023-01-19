import { Router } from 'express';

import { auth } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/auth
 */

// Obtener los tokens - privado/Admin
router.get('/token/obtener/', [
    middlewares.validarJWT.validarJWT
], auth.obtenerToken);
router.get('/token/renovar/', [
    middlewares.validarJWT.validarJWT
], auth.renovarToken);

//  Iniciar Sesión - publico
router.post('/login/', auth.login);

export { router };