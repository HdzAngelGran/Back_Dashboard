const { response } = require('express')

const esAdminRole = (req, res = response, next) => {
    const token = req.header('admin');

    if (!token) {
        return res.status(406).json({
            msg: 'Se requiere ser Administrador del sistema'
        });
    }

    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(406).json({
            msg: `No eres administrador - No puedes hacer esto`
        });
    }

    next();
}

const esProRole = (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(406).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'PRO_ROLE') {
        return res.status(406).json({
            msg: `${ nombre } no es profesor - No puede hacer esto`
        });
    }
    next();
}

const esEstRole = (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(406).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'EST_ROLE') {
        return res.status(406).json({
            msg: `${ nombre } no es alumno - No puede hacer esto`
        });
    }

    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(406).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(406).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    esProRole,
    esEstRole,
    tieneRole
}