const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esProRole, esEstRole, esAdminRole, cuentaCruzada } = require('../middlewares');
const {
    obtenerInscritos,
    obtenerGrupoEst,
    crearInscrito,
    actualizarInscrito,
    borrarInscrito,
    inscritoPatch,
    obtenerEstudiantesGrupo,
    obtenerInscritoId
} = require('../controllers');
const { existeUsuarioPorId } = require('../helpers');

const router = Router();

/**
 * {{url}}/api/inscrito
 */

//  Obtener todas las inscripciones - publico
router.get('/', [
    esAdminRole,
    validarCampos,
], obtenerInscritos);

//  Obtener todos los inscritos por id - publico
router.get('/id/', [
    validarJWT,
    cuentaCruzada,
    esEstRole,
    validarCampos,
], obtenerGrupoEst);

//  Obtener todos los inscritos por id - publico
router.get('/inscritos/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos,
], obtenerEstudiantesGrupo);

router.get('/getIns/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], obtenerInscritoId);

// Inscribirse - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    esEstRole,
    cuentaCruzada,
    check('estudiante', 'No es un id de estudiante válido').isMongoId(),
    check('estudiante').custom(existeUsuarioPorId),
    check('codigo', 'El código es necesario para inscribirse').not().isEmpty(),
    validarCampos
], crearInscrito);

// Actualizar - privado - cualquiera con token válido
router.put('/id/', [
    esAdminRole,
    validarCampos
], actualizarInscrito);

router.patch('/id/', [
    validarJWT,
    esEstRole,
    cuentaCruzada,
    validarCampos
], inscritoPatch);

// Borrar una Grupo - Admin
router.delete('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos,
], borrarInscrito);

module.exports = router;