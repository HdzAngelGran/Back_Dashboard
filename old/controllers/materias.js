const { response } = require('express');
const CryptoJS = require("crypto-js");
const xl = require('excel4node');
const fs = require('fs');
const path = require('path');

const {
    getMateria,
    postMateria,
    putMateria,
    deleteMateria,
    getSep,
    getActividad,
    getInscrito,
    getUser,
    deleteSep,
    getCalificacion
} = require("../services");
const { insWithCal, matCreateSep, actCal } = require('../services/Impl');

const obtenerMaterias = async(req, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);

    try {
        const materiasP = await getMateria({ estado: true });

        if (materiasP.msg)
            throw new Error(materiasP.msg);

        if (materiasP.total === 0)
            throw new Error(`No existen materias en la DB`)

        const materias = [];

        for (let i = desde; i < limite; i++) {
            if (materiasP.materias[i])
                materias.push(materiasP.materias[i]);
        }

        let total;

        if (materiasP.total < desde)
            total = 0;
        else
        if (materiasP.total < (limite + desde))
            total = materiasP.total - desde;
        else
            total = limite - desde;

        return res.status(200).json({
            total,
            materias
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerMateriasG = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const { total, materias, msg } = await getMateria({ grupo: originalGrupo, estado: true });

        if (msg)
            throw new Error(msg);

        if (total === 0)
            throw new Error(`No existen materias en la DB`)

        return res.status(200).json({
            total,
            materias
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerMateriaId = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDM);
        const originalMateria = bytes.toString(CryptoJS.enc.Utf8);

        const { total, materias, msg } = await getMateria({ _id: originalMateria, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 1)
            throw new Error(`No existen materias en la DB`)

        return res.status(200).json(materias[0]);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const materiaCals = async(req, res = response) => {
    const id = req.header('id');
    const idProf = req.header('user');

    try {
        const bytesM = CryptoJS.AES.decrypt(id, process.env.PASSWORDM);
        const originalMateria = bytesM.toString(CryptoJS.enc.Utf8);

        const materias = await getMateria({ _id: originalMateria, estado: true });

        if (materias.msg)
            throw new Error(materias.msg);

        const actividad = await getActividad({ materia: originalMateria, estado: true, disponible: true });

        if (actividad.msg)
            throw new Error(actividad.msg);

        if (actividad.total === 0)
            throw new Error(`No tienes actividades en esta materia`);

        const actividadD = actividad.actividades.filter(disponible => disponible.disponible == true).map(actividad => {
            const bytesA = CryptoJS.AES.decrypt(actividad._id.toString(), process.env.PASSWORDA);
            const originalActividad = bytesA.toString(CryptoJS.enc.Utf8);

            return {
                ...actividad,
                _id: originalActividad
            }
        });

        if (actividadD.length === 0)
            throw new Error(`Error al cargar las actividades`);

        const bytesG = CryptoJS.AES.decrypt(materias.materias[0].grupo._id.toString(), process.env.PASSWORDG);
        const originalGrupo = bytesG.toString(CryptoJS.enc.Utf8);

        const inscritos = await getInscrito({ grupo: originalGrupo });

        if (inscritos.msg)
            throw new Error(inscritos.msg);

        if (inscritos.total === 0)
            throw new Error(`No existen alumnos inscritos en el grupo`);

        const calsOfEst = await insWithCal(inscritos.inscritos);

        if (calsOfEst.msg)
            throw new Error(calsOfEst.msg);

        if (!calsOfEst)
            throw new Error(`No existen calificaciones de los alumnos`);

        const calsMateria = calsOfEst.map((estudiante) => {
            return {
                nombreC: `${estudiante[0].estudiante.nombre} ${estudiante[0].estudiante.apellidoP} ${estudiante[0].estudiante.apellidoM}`,
                actividades: actividadD.map((actD) => {
                    return estudiante.map((calificacion) => {
                        console.log(calificacion)
                        if (actD._id == calificacion.actividad.toString())
                            return {
                                actividad: actD.nombre,
                                calificacion: calificacion.calificacion
                            }
                        return;
                    }).filter(notUndefined => notUndefined !== undefined);
                })
            }
        });

        //const pathE = path.join(__dirname, '../', 'assets', `${originalMateria}.xlsx`);
        const pathE = path.join(__dirname, '../', 'assets', 'Calificaciones.xlsx');

        fs.unlinkSync(pathE);
        fs.writeFile(pathE, '', () => console.info('Creando...'));

        const wb = new xl.Workbook();

        const ws = wb.addWorksheet('Calificaciones');
        console.log(1)
        const styleH1 = wb.createStyle({
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            font: {
                size: 14,
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -',
        });

        const styleH2 = wb.createStyle({
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            },
            font: {
                size: 12,
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        const styleC = wb.createStyle({
            font: {
                color: '#000000',
                size: 12,
            }
        });

        const style = wb.createStyle({
            font: {
                color: '#000000',
                size: 12,
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        const prof = await getUser({ _id: idProf, estado: true });

        if (prof.usuarios[0].msg)
            throw new Error(prof.msg);

        if (prof.usuarios[0].total === 0)
            throw new Error(`No existe el profesor en la DB`)

        const profesor = `Profesor: ${prof.usuarios[0].nombre} ${prof.usuarios[0].apellidoP} ${prof.usuarios[0].apellidoM}`;

        ws.column(1).setWidth(profesor.length);

        ws.cell(1, 1)
            .string(profesor)
            .style(style);

        ws.cell(2, 1)
            .string('Alumnos')
            .style(style);

        let actN = 2;

        const colorH = materias.materias[0].color.substring(1, materias.materias[0].color.length);

        for (let fExcel = 0; fExcel < calsMateria.length; fExcel++) {
            let filaN = 2;

            ws.cell(fExcel + 3, 1)
                .string(calsMateria[fExcel].nombreC)
                .style(style);

            for (let cExcel = 0; cExcel < calsMateria[fExcel].actividades.length; cExcel++)
                if (calsMateria[fExcel].actividades[cExcel].length !== 0) {
                    if (fExcel === 0) {
                        if (cExcel === 0)
                            ws.cell(1, 2, 1, actividadD.length + 1, true)
                            .string(materias.materias[0].nombre)
                            .style(styleH1)
                            .style({
                                fill: {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    fgColor: colorH
                                }
                            });

                        ws.cell(2, actN++)
                            .string(calsMateria[fExcel].actividades[cExcel][0].actividad)
                            .style(styleH2)
                            .style({
                                fill: {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    fgColor: colorH
                                }
                            });
                    }

                    ws.cell(fExcel + 3, filaN++)
                        .number(calsMateria[fExcel].actividades[cExcel][0].calificacion < 0 ?
                            0 :
                            calsMateria[fExcel].actividades[cExcel][0].calificacion
                        )
                        .style(styleC);
                }

            if (fExcel === 0 && actividadD.length > 1) {
                ws.cell(2, actN++)
                    .string('Total')
                    .style(styleH2);

                ws.cell(2, actN)
                    .string('Final')
                    .style(styleH2);
            }
        }

        if (actividadD.length > 1) {
            for (let i = 0; i < inscritos.inscritos.length; i++) {
                let formula = '';

                for (let j = 0; j < actividadD.length; j++)
                    formula += `${String.fromCodePoint(66 + j)}${i + 3} + `;

                formula = formula.substring(0, formula.length - 3);

                ws.cell(i + 3, actN - 1).formula(formula);
                ws.cell(i + 3, actN).formula(`${String.fromCodePoint(63 + actN)}${i + 3} / ${actividadD.length}`);
            }
        }

        ws.row(2).freeze();

        wb.write(pathE, (err, stats) => {
            if (err)
                return res.status(406).json({
                    msg: err.message
                });
            else
                return res.status(200).download(pathE);
            //fs.unlinkSync(pathE);
        });
        //fs.unlinkSync(pathE);
        /*
                return res.status(406).json({
                    msg: `hecho`
                });*/
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
        //fs.unlinkSync(pathE);
    }
}

const crearMateria = async(req, res = response) => {
    const { grupo, nombre, color } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(grupo.toString(), process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const { total, materias, msg } = await getMateria({ grupo: originalGrupo, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 0)
            materias.forEach(materia => {
                if (materia.nombre === nombre.toUpperCase())
                    throw new Error(`La materia ${materia.nombre} ya existe`);
            });

        const data = {
            color,
            nombre: nombre.toUpperCase(),
            grupo: originalGrupo
        }

        const materia = await postMateria(data);

        if (materia.msg)
            throw new Error(materia.msg);

        return res.status(200).json(materia._id);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const actualizarMateria = async(req, res = response) => {
    const id = req.header('id');
    const { color } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDM);
        const originalMateria = bytes.toString(CryptoJS.enc.Utf8);

        const materia = await putMateria(originalMateria, { color });

        if (materia.msg)
            throw new Error(materia.msg);

        return res.status(200).json(materia);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const actualizarCals = async(req, res = response) => {
    try {
        const calificacion = await getCalificacion({ estado: true });

        if (calificacion.msg)
            throw new Error(calificacion.msg);

        if (calificacion.total === 0)
            throw new Error(`No existen materias en la DB`);
        console.log(calificacion.total)

        const cali = await actCal(calificacion.calificaciones);

        if (cali.msg)
            throw new Error(cali.msg);

        return res.status(200).json({
            total: calificacion.total,
            cali
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const sepMaterias = async(req, res = response) => {
    const { materias } = req.body;

    try {
        let gradoA = materias[0].grado;

        materias.forEach(({ grado }) => {
            if (grado !== gradoA)
                throw new Error(`Existen grados diferentes ${grado} y ${gradoA}`);
        });

        const sepGrado = await getSep({ grado: gradoA });

        if (sepGrado.total !== 0) {
            const eliminarSep = await deleteSep(gradoA);

            if (eliminarSep.msg)
                throw new Error(eliminarSep.msg);
        }

        const seps = await matCreateSep(materias);

        if (seps.msg)
            throw new Error(seps.msg);

        return res.status(200).json(seps);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const materiasPatch = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDM);
        const originalMateria = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteMateria(originalMateria, true);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);
        else
            return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const borrarMateria = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDM);
        const originalMateria = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteMateria(originalMateria, null);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);
        else
            return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

module.exports = {
    obtenerMaterias,
    obtenerMateriasG,
    obtenerMateriaId,
    materiaCals,
    crearMateria,
    actualizarMateria,
    actualizarCals,
    sepMaterias,
    materiasPatch,
    borrarMateria
}