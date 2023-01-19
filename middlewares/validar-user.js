const { response, request } = require('express');

const cuentaCruzada = (req = request, res = response, next) => {
    const id1 = req.usuario._id;
    const id2 = req.header('user');

    if (id1.toString() !== id2) {
        return res.status(406).json({
            msg: 'Hubo un cruce de cuentas'
        });
    }
    next();
}

module.exports = {
    cuentaCruzada
}