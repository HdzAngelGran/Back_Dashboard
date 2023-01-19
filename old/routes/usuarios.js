const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, cuentaCruzada } = require('../middlewares');
const { esRoleValido, emailExiste } = require('../helpers');
const {
    usuariosGet,
    usuarioGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} = require('../controllers');

const router = Router();

/**
 * {{url}}/api/usuarios
 */

//  Obtener todas los usuarios - admin
router.get('/', [
    esAdminRole,
    validarCampos,
], usuariosGet);

// Obtener un usuario por id - publico/user
router.get('/id/', [
    validarJWT,
    validarCampos,
], usuarioGet);

// Crear usuario - publico
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidoP', 'El apellido paterno es obligatorio').not().isEmpty(),
    check('apellidoM', 'El apellido materno es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

// Actualizar - privado/usuario - cualquiera con token válido
router.put('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], usuariosPut);

// Desactivar - privado/usuario - cualquiera con token válido o relación est-pro
router.patch('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], usuariosPatch);

// Borrar un usuario - privado/administrador
router.delete('/id/', [
    validarJWT,
    cuentaCruzada,
    validarCampos
], usuariosDelete);

module.exports = router;