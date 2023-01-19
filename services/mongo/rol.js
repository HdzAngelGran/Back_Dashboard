import { Role } from "../../models/index.js";

const getRole = async(idR, query) => {
    try {
        if (idR === null && query === null)
            return await Role.find();
        else
        if (query === null)
            return await Role.findById(idR);
        else
            return await Role.find({...query });
    } catch (e) {
        throw new Error(e.message);
    }
}

const postRole = async(body) => {
    try {
        const rol = new Role({...body });
        await rol.save();

        return 'Role creado';
    } catch (e) {
        throw new Error(e.message);
    }
}

const putRole = async(id, body) => {
    try {
        return await Role.findByIdAndUpdate(id, {...body }, { new: true });
    } catch (e) {
        throw new Error(e.message);
    }
}

const delRole = async(req, res) => {
    try {
        const { id } = req.params;
        await Role.findByIdAndDelete(id);

        return res.status(200).json({ msg: 'Role eliminado' });
    } catch (e) {
        throw new Error(e.message);
    }
}

export {
    getRole,
    postRole,
    putRole,
    delRole
};