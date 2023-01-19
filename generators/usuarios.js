import { mongo } from "../services/index.js";
import CryptoJS from "crypto-js";

const crossUsers = async(mongoU, timeDoctorU) => {
    return timeDoctorU.map(async(dataTD) => {
        const existe = mongoU.filter(dataM => dataTD.id === dataM.idU);

        if (existe.length === 0) {
            try {
                const password = CryptoJS.AES.encrypt(CryptoJS.AES.encrypt(dataTD.email.toString(), process.env.FIRSTTOKEN).toString(), process.env.SECONDTOKEN).toString();
                const rol = await mongo.roles.getRole(null, { nombre: "DEV" });

                if(dataTD.first_name)
                    await mongo.usuarios.postUsuario({
                        nombre: dataTD.first_name,
                        apellidoP: dataTD.last_name,
                        idU: dataTD.id,
                        imagen: 'https://res.cloudinary.com/nodecafe/image/upload/v1661817785/Dashboard/images_xbhzpt.png',
                        email: dataTD.email,
                        password: password,
                        rol: {
                            rol: rol[0]._id,
                            nombre: rol[0].nombre
                        }
                    });

                return 1;
            } catch (error) {
                console.error(error.message);
                console.error(dataTD.nombre);

                return 0;
            }
        }

        return 2;
    });
}

const verifyUsers = async(mongoU, timeDoctorU) => {
    return mongoU.map(async(dataM) => {
        const existe = timeDoctorU.map(dataTD => (dataTD.id === dataM.idU) ? true : false);

        if (!existe.includes(true)) {
            try {
                await mongo.usuarios.delUsuario(dataM._id);

                return 1;
            } catch (error) {
                return 0;
            }
        }

        return 2;
    });
}

export { 
    crossUsers,
    verifyUsers
}