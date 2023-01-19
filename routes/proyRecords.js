import { Router } from 'express';

import { proyRecords } from '../controllers/index.js';
import * as middlewares from '../middlewares/index.js';

const router = Router();

/**
 * {{url}}/api/proyRecords
 */

//  Obtener los records por proyectos - privado/Admin
router.get('/', [
    middlewares.validarJWT.validarJWT
], proyRecords.obtenerRecordsProyecto);
router.get('/unico/', [
    middlewares.validarJWT.validarJWT
], proyRecords.obtenerRecordProyecto);

export { router };