import { Router } from 'express';

import { records } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/records
 */

//  Obtener los records - privado/Admin
router.get('/', [
    middlewares.validarJWT.validarJWT
], records.obtenerRecordGeneral);
router.get('/varios/', [
    middlewares.validarJWT.validarJWT
], records.obtenerRecordsGenerales);

export { router };