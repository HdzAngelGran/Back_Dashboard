const { generarJWT } = require('../helpers');
const { Usuario } = require('../models');
const { usuarioTotal } = require('./eliminacionTotal');
const { usuarioVisual } = require('./eliminacionVisual');

const getUser = async(query) => {
    try {
        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
        ]);

        return {
            total,
            usuarios
        }
    } catch (error) {
        return { msg: `Usuarios Get ${error}` }
    }
}

const postUser = async(body) => {
    try {
        const usuario = new Usuario({...body });
        await usuario.save();

        const token = await generarJWT(usuario.id, usuario.rol);

        return token;
    } catch (error) {
        return { msg: `Usuarios Post ${error}` }
    }
}

const putUser = async(id, body) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(id, {...body }, { new: true });

        if (!usuario)
            throw new Error(`El usuario no se actualizó`);

        return usuario;
    } catch (error) {
        return { msg: `Usuarios Put ${error}` }
    }
}

const deleteUser = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = await usuarioVisual(id);
        else
            eliminaciones = await usuarioTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Usuarios Delete ${error}` }
    }
}

module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser
}