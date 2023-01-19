import { Router } from 'express';

import { prueba } from '../controllers/index.js';

const router = Router();

/**
 * {{url}}/api/prueba
 */

//  Pruebas de peticiones rapidas
router.get('/', prueba.prueba);

export { router };