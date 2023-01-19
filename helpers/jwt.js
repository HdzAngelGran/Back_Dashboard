import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

import { mongo } from '../services/index.js';

const comprobarJWT = async(token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }

        const webToken = verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await mongo.usuarios.getUsuario(webToken.id, null);

        if (usuario) {
            return { webToken, usuario };
        } else {
            return null;
        }
    } catch (error) {
        return null
    }
}

const generarJWT = (id = '', uid = '', rol = '') => {
    try {
        return new Promise((resolve, reject) => {
            const payload = { id, uid, rol };

            sign(payload, process.env.SECRETORPRIVATEKEY, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            });
        });
    } catch (err) {
        reject('No se pudo generar el token');
    }
}

export {
    comprobarJWT,
    generarJWT
}