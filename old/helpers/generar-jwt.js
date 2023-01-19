const jwt = require('jsonwebtoken');

const { Usuario } = require('../models');

const generarJWT = (uid = '', rol = '') => {
    try {
        return new Promise((resolve, reject) => {
            const payload = { uid, rol };

            jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token')
                } else {
                    resolve(token);
                }
            });
        });
    } catch (err) {
        return res.status(406).json({
            msg: `Contacte al administrador ${err}`
        });
    }
}

const comprobarJWT = async(token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }

        const webToken = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(webToken.uid);

        if (usuario) {
            if (usuario.estado) {
                return { webToken, usuario };
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        return null
    }
}

export {
    generarJWT,
    comprobarJWT
}