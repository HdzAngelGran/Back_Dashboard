const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esProRole, esAdminRole, cuentaCruzada } = require('../middlewares');
const {
    crearGrupo,
    obtenerGrupos,
    obtenerGrupoId,
    actualizarGrupo,
    borrarGrupo,
    gruposPatch,
    obtenerGrupoU,
    activarGrupo,
    grupoCals
} = require('../controllers');

const router = Router();

/**
 * {{url}}/api/grupo
 */

//  Obtener todos los grupos - privado
router.get('/', [
    esAdminRole,
    validarCampos,
], obtenerGrupos);

// Obtener un grupo por idU - publico
router.get('/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos,
], obtenerGrupoU);

// Obtener un grupo por id - publico
router.get('/getGrup/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos,
], obtenerGrupoId);

// Obtener calificación de un grupo - privado
router.get('/calificaciones/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos,
], grupoCals);

// Crear grupo - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    check('grado').isIn([1, 2, 3, 4, 5, 6]),
    check('grupo').isIn(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']),
    check('saludo', 'La bienvenida es obligatoria').not().isEmpty(),
    validarCampos
], crearGrupo);

// Actualizar - privado - cualquiera con token válido
router.put('/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], actualizarGrupo);

// Actualizar - privado - cualquiera con token válido
router.put('/activar/id', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], activarGrupo);

//Desactivar un grupo
router.patch('/id/', [
    validarJWT,
    esProRole,
    cuentaCruzada,
    validarCampos
], gruposPatch);

// Borrar una Grupo - Admin
router.delete('/id/', [
    validarJWT,
    esProRole,
    cuentaCruzada,
    validarCampos,
], borrarGrupo);

module.exports = router;