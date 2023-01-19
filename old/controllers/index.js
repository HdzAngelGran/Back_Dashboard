const actividades = require('./actividades');
const auth = require('./auth');
const comentarios = require('./comentarios');
const grupos = require('./grupos');
const inscritos = require('./inscritos');
const juegos = require('./juegos');
const materias = require('./materias');
const uploads = require('./uploads');
const usuarios = require('./usuarios');

module.exports = {
    ...actividades,
    ...auth,
    ...comentarios,
    ...grupos,
    ...inscritos,
    ...juegos,
    ...materias,
    ...uploads,
    ...usuarios
}