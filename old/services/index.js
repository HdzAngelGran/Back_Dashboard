const actividad = require('./actividades');
const calificacion = require('./calificaciones');
const comentarios = require('./comentarios');
const grupo = require('./grupos');
const inscrito = require('./inscritos');
const juego = require('./juegos');
const materia = require('./materias');
const respuesta = require('./respuestas');
const rol = require('./roles');
const sep = require('./seps');
const total = require('./eliminacionTotal');
const usuarios = require('./usuarios');
const visual = require('./eliminacionVisual');

module.exports = {
    ...actividad,
    ...calificacion,
    ...comentarios,
    ...grupo,
    ...inscrito,
    ...juego,
    ...materia,
    ...respuesta,
    ...rol,
    ...sep,
    ...total,
    ...usuarios,
    ...visual
}