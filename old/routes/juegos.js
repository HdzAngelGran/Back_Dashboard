const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esProRole,
    esAdminRole,
    cuentaCruzada,
    esEstRole
} = require('../middlewares');
const {
    crearJuego,
    codigoJuego,
    actualizarJuego,
    obtenerJuegos,
    juegosPatch,
    borrarJuego,
    terminarJuego,
    respuestasJuego,
    responderJuego,
    obtenerJuegosA,
    obtenerJuegoId,
    responderMemorama
} = require('../controllers');

/** 
 * {{url}}/api/juego
 */
const router = Router();

router.get('/', [
    esAdminRole,
    validarCampos
], obtenerJuegos);

// Obtener un juego por idA - publico/user
router.get('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], obtenerJuegosA);

// Obtener un juego por id - publico/user
router.get('/getJue/id/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], obtenerJuegoId);

router.get('/codigo/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], codigoJuego);

router.get('/respuestas/', [
    validarJWT,
    esProRole,
    cuentaCruzada,
    validarCampos
], respuestasJuego);

router.post('/', [
    validarJWT,
    cuentaCruzada,
    esProRole,
    validarCampos
], crearJuego);

router.put('/id/', [
    validarJWT,
    esProRole,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    validarCampos
], actualizarJuego);

router.put('/id/terminar/', [
    validarJWT,
    esProRole,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    validarCampos
], terminarJuego);

router.put('/responder/', [
    validarJWT,
    cuentaCruzada,
    esEstRole,
    validarCampos
], responderJuego);

router.put('/memorama/', [
    validarJWT,
    cuentaCruzada,
    esEstRole,
    validarCampos
], responderMemorama);

router.patch('/id/', [
    validarJWT,
    esProRole,
    validarCampos
], juegosPatch);

router.delete('/id/', [
    validarJWT,
    esProRole,
    validarCampos
], borrarJuego);

module.exports = router;