const { response } = require('express');
const CryptoJS = require("crypto-js");
const xl = require('excel4node');
const fs = require('fs');
const path = require('path');

const {
    getGrupo,
    postGrupo,
    putGrupo,
    deleteGrupo,
    getMateria,
    getSep,
    getInscrito,
    getUser
} = require("../services");
const { sepCreateMat, insWithCal, matWithAct } = require('../services/Impl');

const obtenerGrupos = async(req, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    limite = parseInt(limite, 10);
    desde = parseInt(desde, 10);

    try {
        const gruposP = await getGrupo({ estado: true });

        if (gruposP.msg)
            throw new Error(gruposP.msg);

        if (gruposP.total === 0)
            throw new Error(`No existen grupos en la DB`)

        const grupos = [];

        for (let i = desde; i < limite; i++) {
            if (gruposP.grupos[i])
                grupos.push(gruposP.grupos[i]);
        }

        let total;

        if (gruposP.total < desde)
            total = 0;
        else
        if (gruposP.total < (limite + desde))
            total = gruposP.total - desde;
        else
            total = limite - desde;

        return res.status(200).json({
            total,
            grupos
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerGrupoU = async(req, res = response) => {
    const id = req.header('user');

    try {
        const { total, grupos, msg } = await getGrupo({ usuario: id, estado: true });

        if (msg)
            throw new Error(msg);

        if (total === 0)
            throw new Error(`No existen grupos en la DB`);

        return res.status(200).json({
            total,
            grupos
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const obtenerGrupoId = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const { total, grupos, msg } = await getGrupo({ _id: originalGrupo, estado: true });

        if (msg)
            throw new Error(msg);

        if (total !== 1)
            throw new Error(`No existen grupos en la DB`);

        return res.status(200).json(grupos[0]);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const grupoCals = async(req, res = response) => {
    const id = req.header('id');
    const idProf = req.header('user');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const grupo = await getGrupo({ _id: originalGrupo, estado: true });

        if (grupo.msg)
            throw new Error(grupo.msg);

        if (grupo.total === 0)
            throw new Error(`Error al obtener el grupo`);

        const inscritos = await getInscrito({ grupo: originalGrupo, estado: true });

        if (inscritos.msg)
            throw new Error(inscritos.msg);

        if (inscritos.total === 0)
            throw new Error(`No existen alumnos inscritos en el grupo`);

        const calsOfEst = await insWithCal(inscritos.inscritos);

        if (calsOfEst.msg)
            throw new Error(calsOfEst.msg);

        if (!calsOfEst)
            throw new Error(`No existen calificaciones de los alumnos`);

        const materias = await getMateria({ grupo: originalGrupo, estado: true });

        if (materias.msg)
            throw new Error(materias.msg);

        if (materias.total === 0)
            throw new Error(`No existen materias en el grupo`);

        const actMats = await matWithAct(materias.materias);

        if (actMats.msg)
            throw new Error(actMats.msg)

        const calsGrupo = calsOfEst.map((estudiante) => {
            return {
                nombreC: `${estudiante[0].estudiante.nombre} ${estudiante[0].estudiante.apellidoP} ${estudiante[0].estudiante.apellidoM}`,
                actividades: actMats.map((actMat) => {
                    let actividades = [];

                    if (actMat.actividades)
                        actividades = actMat.actividades.map((actividad) => {
                            return estudiante.map((calificacion) => {
                                if (actividad.actividad == calificacion.actividad.toString())
                                    return {
                                        actividad: actividad.nombre,
                                        calificacion: calificacion.calificacion
                                    }
                                return;
                            }).filter(notUndefined => notUndefined !== undefined);
                        });

                    return {
                        materia: actMat.nombre,
                        actividades: actividades
                    }
                })
            }
        });

        const pathE = path.join(__dirname, '../', 'assets', 'Calificaciones.xlsx');

        fs.unlinkSync(pathE);
        fs.writeFile(pathE, '', () => console.log('Creando...'));

        const wb = new xl.Workbook();

        const ws = wb.addWorksheet('Calificaciones');

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

        if (prof.msg)
            throw new Error(prof.msg);

        if (prof.total === 0)
            throw new Error(`Error al obtener el profesor`)

        const profesor = `Profesor: ${prof.usuarios[0].nombre} ${prof.usuarios[0].apellidoP} ${prof.usuarios[0].apellidoM}`;

        ws.column(1).setWidth(profesor.length);

        ws.cell(1, 1)
            .string(profesor)
            .style(style);

        ws.cell(2, 1)
            .string('Alumnos')
            .style(style);

        let avance = 0;
        let inicio = 2;
        let actN = 2;

        for (let fExcel = 0; fExcel < calsGrupo.length; fExcel++) {
            let filaN = 2;

            ws.cell(fExcel + 3, 1)
                .string(calsGrupo[fExcel].nombreC)
                .style(style);

            for (let cExcel = 0; cExcel < calsGrupo[fExcel].actividades.length; cExcel++)
                if (calsGrupo[fExcel].actividades[cExcel].actividades.length !== 0) {
                    if (fExcel === 0) {
                        const colorH = materias.materias[cExcel].color.substring(1, materias.materias[cExcel].color.length);
                        avance = inicio + calsGrupo[fExcel].actividades[cExcel].actividades.length - 1;

                        ws.cell(1, inicio, 1, avance, true)
                            .string(calsGrupo[fExcel].actividades[cExcel].materia)
                            .style(styleH1)
                            .style({
                                fill: {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    fgColor: colorH
                                }
                            });

                        inicio = avance + 1;

                        for (let act = 0; act < calsGrupo[fExcel].actividades[cExcel].actividades.length; act++)
                            ws.cell(2, actN++)
                            .string(calsGrupo[fExcel].actividades[cExcel].actividades[act][0].actividad)
                            .style(styleH2)
                            .style({
                                fill: {
                                    type: 'pattern',
                                    patternType: 'solid',
                                    fgColor: colorH
                                }
                            });
                    }

                    for (let act = 0; act < calsGrupo[fExcel].actividades[cExcel].actividades.length; act++)
                        ws.cell(fExcel + 3, filaN++)
                        .number(calsGrupo[fExcel].actividades[cExcel].actividades[act][0].calificacion < 0 ?
                            0 :
                            calsGrupo[fExcel].actividades[cExcel].actividades[act][0].calificacion
                        )
                        .style(styleC);
                }

            if (fExcel === 0) {
                ws.cell(2, actN++)
                    .string('Total')
                    .style(styleH2);

                ws.cell(2, actN)
                    .string('Final')
                    .style(styleH2);
            }
        }

        if (avance > 1)
            for (let i = 0; i < inscritos.inscritos.length; i++) {
                let formula = '';

                for (let j = 1; j < avance; j++)
                    formula += `${String.fromCodePoint(65 + j)}${i + 3} + `;

                formula = formula.substring(0, formula.length - 3);

                ws.cell(i + 3, inicio).formula(formula);
                ws.cell(i + 3, actN).formula(`${String.fromCodePoint(64 + inicio)}${i + 3} / ${avance - 1}`);
            }

        ws.row(2).freeze();

        wb.write(pathE, (err, stats) => {
            if (err)
                return res.status(406).json({
                    msg: err.message
                });
            else
                return res.status(200).download(pathE);
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const crearGrupo = async(req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    try {
        const { total: totalG, grupos, msg: msgG } = await getGrupo({ usuario, estado: true });


        if (msgG)
            throw new Error(msgG);

        if (totalG !== 0)
            grupos.forEach(grupo => {
                if (grupo.grado === parseInt(body.grado))
                    throw new Error(`El grupo ${grupo.grado} ya existe`);
            });

        const { seps, msg: msgS } = await getSep({ grado: parseInt(body.grado) });

        if (msgS)
            throw new Error(msgS);

        const data = {
            ...body,
            grupo: body.grupo.toUpperCase(),
            usuario
        }

        const grupo = await postGrupo(data);

        if (grupo.msg)
            throw new Error(grupo.msg);

        const bytes = CryptoJS.AES.decrypt(grupo._id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const mats = await sepCreateMat(seps, originalGrupo);

        return res.status(200).json(mats);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const actualizarGrupo = async(req, res = response) => {
    const id = req.header('id');
    const { saludo, grupo } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const grupo = await putGrupo(originalGrupo, { saludo });

        if (grupo.msg)
            throw new Error(grupo.msg);

        return res.status(200).json({
            actualizacion: `El grupo ${grupo.grado}°${grupo.grupo} fue actualizado correctamente`
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const activarGrupo = async(req, res = response) => {
    const id = req.header('id');
    const { disponible } = req.body;

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const grupo = await putGrupo(originalGrupo, { disponible });

        if (grupo.msg)
            throw new Error(grupo.msg);

        return res.status(200).json({
            codigo: originalGrupo
        });
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }

}

const gruposPatch = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteGrupo(originalGrupo, true);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

const borrarGrupo = async(req, res = response) => {
    const id = req.header('id');

    try {
        const bytes = CryptoJS.AES.decrypt(id, process.env.PASSWORDG);
        const originalGrupo = bytes.toString(CryptoJS.enc.Utf8);

        const eliminaciones = await deleteGrupo(originalGrupo, null);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return res.status(200).json(eliminaciones);
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

module.exports = {
    obtenerGrupos,
    obtenerGrupoU,
    obtenerGrupoId,
    grupoCals,
    crearGrupo,
    actualizarGrupo,
    activarGrupo,
    gruposPatch,
    borrarGrupo
}