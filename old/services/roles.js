const { generarJWT } = require('../helpers');
const { Role } = require('../models');
const { roleTotal } = require('./eliminacionTotal');
const { roleVisual } = require('./eliminacionVisual');

const getRole = async(query) => {
    try {
        const [total, roles] = await Promise.all([
            Role.countDocuments({...query }),
            Role.find({...query })
        ]);

        return {
            total,
            roles
        }
    } catch (error) {
        return { msg: `Roles Get ${error}` }
    }
}

const postRole = async(body) => {
    try {
        const role = new Role({...body });
        await role.save();

        return role;
    } catch (error) {
        return { msg: `Roles Post ${error}` }
    }
}

const putRole = async(id, body) => {
    try {
        const role = await Role.findByIdAndUpdate(id, {...body }, { new: true });

        if (!role)
            throw new Error(`El role no se actualizó`);

        return role;
    } catch (error) {
        return { msg: `Roles Put ${error}` }
    }
}

const deleteRole = async(id, visual) => {
    try {
        let eliminaciones;

        if (visual)
            eliminaciones = await roleVisual(id);
        else
            eliminaciones = await roleTotal(id);

        if (eliminaciones.msg)
            throw new Error(eliminaciones.msg);

        return eliminaciones;
    } catch (error) {
        return { msg: `Roles Delete ${error}` }
    }
}

module.exports = {
    getRole,
    postRole,
    putRole,
    deleteRole
}