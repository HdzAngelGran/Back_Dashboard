const CryptoJS = require("crypto-js");

const {
    Actividad,
    Calificacion,
    Grupo,
    Inscrito,
    Juego,
    Materia,
    Respuesta,
    Role,
    Sep,
    Usuario,
    Comentario
} = require("../models");

const usuarioVisual = async(uId) => {
    const cambios = [];
    const query = { 'usuario': uId }

    try {
        const user = await Usuario.findById(uId);

        if (!user)
            throw new Error(`No existe este usuario`);

        const [totalG, grupos] = await Promise.all([
            Grupo.countDocuments(query),
            Grupo.find(query)
        ]);

        if (totalG !== 0)
            grupos.forEach(async(grupo) => {
                const visual = await grupoVisual(grupo._id);

                if (visual.msg)
                    throw new Error(visual.msg);

                cambios.push(visual);
            });
        else {
            const queryI = { 'estudiante': uId }

            const [totalI, inscritos] = await Promise.all([
                Inscrito.countDocuments(queryI),
                Inscrito.find(queryI)
            ]);

            if (totalI !== 0)
                inscritos.forEach(async(inscrito) => {
                    const visual = await inscritoVisual(inscrito._id);

                    if (visual.msg)
                        throw new Error(visual.msg);

                    cambios.push(visual);
                });
        }

        const visual = await Usuario.findByIdAndUpdate(uId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Usuario`);

        cambios.push({
            'usuario': uId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const grupoVisual = async(gId) => {
    const cambios = [];
    const query = { 'grupo': gId }

    try {
        const grupo = await Grupo.findById(gId);

        if (!grupo)
            throw new Error(`No existe este grupo`);

        const [totalI, inscritos] = await Promise.all([
            Inscrito.countDocuments(query),
            Inscrito.find(query)
        ]);

        if (totalI !== 0)
            inscritos.forEach(async(inscrito) => {
                const visual = await inscritoVisual(inscrito._id);

                if (visual.msg)
                    throw new Error(visual.msg);

                cambios.push(visual);
            });

        const [totalM, materias] = await Promise.all([
            Materia.countDocuments(query),
            Materia.find(query)
        ]);

        if (totalM !== 0)
            materias.forEach(async(materia) => {
                const visual = await materiaVisual(materia._id);

                if (visual.msg)
                    throw new Error(visual.msg);

                cambios.push(visual);
            });

        const visual = await Grupo.findByIdAndUpdate(gId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Grupo`);

        cambios.push({
            'grupo': gId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const inscritoVisual = async(iId) => {
    const cambios = [];
    const query = { 'estudiante': iId }

    try {
        const inscrito = await Inscrito.findById(iId);

        if (!inscrito)
            throw new Error(`No existe esta inscripción`);

        const [totalC, calificaciones] = await Promise.all([
            Calificacion.countDocuments(query),
            Calificacion.find(query)
        ]);

        if (totalC !== 0) {
            calificaciones.forEach(async(calificacion) => {
                const visual = await calificacionVisual(calificacion._id);

                if (visual.msg)
                    throw new Error(visual.msg);

                cambios.push(visual);
            });
        }

        const visual = await Inscrito.findByIdAndUpdate(iId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Inscrito`);

        cambios.push({
            'inscrito': iId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const materiaVisual = async(mId) => {
    const cambios = [];
    const query = { 'materia': mId }

    try {
        const materia = await Materia.findById(mId);

        if (!materia)
            throw new Error(`No existe esta materia`);

        const [totalA, actividades] = await Promise.all([
            Actividad.countDocuments(query),
            Actividad.find(query)
        ]);

        if (totalA !== 0)
            actividades.forEach(async(actividad) => {
                const visual = await actividadVisual(actividad._id);

                if (visual.msg)
                    throw new Error(visual.msg);

                cambios.push(visual);
            });

        const visual = await Materia.findByIdAndUpdate(mId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Materia`);

        cambios.push({
            'materia': mId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const actividadVisual = async(aId) => {
    const cambios = [];
    const query = { 'actividad': aId }

    try {
        const actividad = await Actividad.findById(aId);

        if (!actividad)
            throw new Error(`No existe esta actividad`);

        const juego = await Juego.findOne(query);

        if (juego) {
            const [totalC, calificaciones] = await Promise.all([
                Calificacion.countDocuments(query),
                Calificacion.find(query)
            ]);

            if (totalC !== 0) {
                calificaciones.forEach(async(calificacion) => {
                    const visual = await calificacionVisual(calificacion._id);

                    if (visual.msg)
                        throw new Error(visual.msg);

                    cambios.push(visual);
                });
            }

            const visual = await juegoVisual(juego._id);

            if (visual.msg)
                throw new Error(visual.msg);

            cambios.push(visual);

            const comentario = await Comentario.findOne(query);

            if (comentario) {
                const visual = await comentarioVisual(comentario._id);

                if (visual.msg)
                    throw new Error(visual.msg);

                cambios.push(visual);
            }
        }

        const visual = await Actividad.findByIdAndUpdate(aId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Actividad`);

        cambios.push({
            'actividad': aId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const juegoVisual = async(jId) => {
    const cambios = [];

    try {
        const juego = await Juego.findById(jId);

        if (!juego)
            throw new Error(`No existe este juego`);

        if (juego.respuesta) {
            let bytesR = CryptoJS.AES.decrypt(juego.respuesta.toString(), process.env.PASSWORDJ);
            let originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

            bytesR = CryptoJS.AES.decrypt(originalRespuesta, process.env.PASSWORDR);
            originalRespuesta = bytesR.toString(CryptoJS.enc.Utf8);

            const visual = await respuestaVisual(originalRespuesta);

            if (visual.msg)
                throw new Error(visual.msg);

            cambios.push(visual);
        }

        const visual = await Juego.findByIdAndUpdate(jId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Juego`);

        cambios.push({
            'juego': jId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const respuestaVisual = async(rId) => {
    const cambios = [];

    try {
        const respuesta = await Respuesta.findById(rId);

        if (!respuesta)
            throw new Error(`No existe esta respuesta`);

        const visual = await Respuesta.findByIdAndUpdate(rId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Respuesta`);

        cambios.push({
            'respuesta': rId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const calificacionVisual = async(cId) => {
    const cambios = [];

    try {
        const calificacion = await Calificacion.findById(cId);

        if (!calificacion)
            throw new Error(`No existe esta calificación`);

        const visual = await Calificacion.findByIdAndUpdate(cId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Calificación`);

        cambios.push({
            'calificacion': cId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const comentarioVisual = async(coId) => {
    const cambios = [];

    try {
        const comentario = await Comentario.findById(coId);

        if (!comentario)
            throw new Error(`No existe este comentario`);

        const visual = await Comentario.findByIdAndUpdate(coId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Comentario`);

        cambios.push({
            'comentario': coId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const roleVisual = async(rId) => {
    const cambios = [];

    try {
        const rol = await Role.findfindById(uId);

        if (!rol)
            throw new Error(`No existe este rol`);

        const visual = await Role.findByIdAndUpdate(rId, { estado: false }, { new: true });

        if (!visual)
            throw new Error(`Error al actualizar Rol`);

        cambios.push({
            'role': rId
        });

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

const sepVisual = async(grado) => {
    const cambios = [];

    try {
        const sep = await Sep.findOne({ grado });

        if (!sep)
            throw new Error(`No existen materias para este grado`);

        const seps = await Sep.updateMany({ grado }, { estado: true }, { new: true });

        if (!seps)
            throw new Error(`Error al actualizar las materias de la SEP`);

        cambios.push(seps);

        return cambios;
    } catch (e) {
        return { msg: e.message };
    }
}

module.exports = {
    actividadVisual,
    calificacionVisual,
    comentarioVisual,
    grupoVisual,
    inscritoVisual,
    juegoVisual,
    materiaVisual,
    respuestaVisual,
    roleVisual,
    sepVisual,
    usuarioVisual
}