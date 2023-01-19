import {proyectos} from "../tasks/proyectos.js";
import {record} from "../tasks/records.js";
import {recordGeneral} from "../tasks/recordsGenerales.js";
import {usuarios} from "../tasks/usuarios.js";

const crons = () => {
    console.log('Tareas programadas');

    proyectos();
    record();
    recordGeneral();
    usuarios();
}

export {
    crons
}