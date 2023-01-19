const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole, cuentaCruzada, esProRole } = require('../middlewares');
const {
    crearActividad,
    obtenerActividades,
    obtenerActividadesM,
    obtenerActividadId,
    actualizarActividad,
    borrarActividad,
    actividadesPatch
} = require('../controllers');

const router = Router();

/**
 * {{url}}/api/actividad
 */

//  Obtener todas las actividades - privado/Admin
router.get('/', [
    esAdminRole,
    validarCampos
], obtenerActividades);

// Obtener una actividad por idM - publico/user
router.get('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], obtenerActividadesM);

// Obtener una actividad por id - publico/user
router.get('/getAct/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], obtenerActividadId);

// Crear actividad - publico/user
router.post('/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    check('objetivo', 'El objetivo es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
], crearActividad);

// Actualizar - publico/user
router.put('/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], actualizarActividad);

//Desactivar una actividad
router.patch('/id/', [
    validarJWT,
    esProRole,
    cuentaCruzada,
    validarCampos
], actividadesPatch);

// Borrar una actividad - Admin
router.delete('/id/', [
    validarJWT,
    esProRole,
    cuentaCruzada,
    validarCampos,
], borrarActividad);

module.exports = router;