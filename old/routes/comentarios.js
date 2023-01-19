const { Router } = require('express');

const {
    validarCampos,
    validarJWT,
    cuentaCruzada,
    esAdminRole
} = require('../middlewares');


const {
    obtenerComentarios,
    obtenerComentariosId,
    obtenerComentariosAct,
    mandarComentario,
    comentariosPatch,
    borrarComentario
} = require('../controllers');

/**
 * {{url}}/api/comentario
 */
const router = Router();

router.get('/', [
    esAdminRole,
    validarCampos
], obtenerComentarios);

router.get('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], obtenerComentariosAct);

router.get('/getCom/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], obtenerComentariosId);

router.put('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], mandarComentario);

router.patch('/id/', [
    esAdminRole,
    validarCampos
], comentariosPatch);

router.delete('/id/', [
    esAdminRole,
    validarCampos
], borrarComentario);

module.exports = router;