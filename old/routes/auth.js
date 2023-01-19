const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares');
const { login, renovarToken, obtenerToken } = require('../controllers');

const router = Router();

router.get('/', validarJWT, renovarToken);

router.get('/:token', obtenerToken);

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

module.exports = router;