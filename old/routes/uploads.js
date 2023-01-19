const { Router } = require('express');

const { validarCampos, validarImagenSubir } = require('../middlewares');
const { cargarArchivo } = require('../controllers');

const router = Router();

router.post('/', [
    validarImagenSubir,
    validarCampos
], cargarArchivo);

module.exports = router;