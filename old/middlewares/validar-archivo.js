const { response } = require("express");

const validarImagenSubir = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen)
        return res.status(406).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });

    if (req.files.imagen.mimetype !== 'image/png' && req.files.imagen.mimetype !== 'image/jpeg' && req.files.imagen.mimetype !== 'image/gif')
        return res.status(406).json({
            msg: `El tipo de archivo ${req.files.imagen.mimetype} no es permitido`
        });

    next();
}

module.exports = {
    validarImagenSubir
}