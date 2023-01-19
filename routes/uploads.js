import { Router } from 'express';

import { uploads } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/uploads
 */

//  Subir imagenes - privado/Admin
router.post('/img/', [
    middlewares.validarJWT.validarJWTFirstLogin,
], uploads.cargarArchivo);

export { router };