const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esProRole,
    cuentaCruzada,
    esAdminRole,
} = require('../middlewares');

const {
    crearMateria,
    obtenerMateriasG,
    obtenerMaterias,
    actualizarMateria,
    borrarMateria,
    materiasPatch,
    sepMaterias,
    obtenerMateriaId,
    materiaCals,
    actualizarCals
} = require('../controllers');

/**
 * {{url}}/api/materia
 */
const router = Router();

router.get('/', [
    esAdminRole,
    validarCampos
], obtenerMaterias);

router.get('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], obtenerMateriasG);

router.get('/getMat/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], obtenerMateriaId);

// Obtener calificación de un grupo - privado
router.get('/calificaciones/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos,
], materiaCals);

router.post('/', [
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('color', 'El color es obligatorio'),
    validarCampos
], crearMateria);

router.put('/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], actualizarMateria);

//  Solo pruebas
router.put('/', [
    esAdminRole,
    validarCampos
], actualizarCals);

router.patch('/sep/materias', [
    esAdminRole,
    validarCampos,
], sepMaterias);

//Desactivar un grupo
router.patch('/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], materiasPatch);

router.delete('/id/', [
    validarJWT,
    esProRole,
    cuentaCruzada,
    validarCampos,
], borrarMateria);

module.exports = router;