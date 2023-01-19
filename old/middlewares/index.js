const validarArchivo = require('./validar-archivo');
const validaCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const validaRoles = require('./validar-roles');
const validarUsuarios = require('./validar-user')

module.exports = {
    ...validarArchivo,
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarUsuarios
}