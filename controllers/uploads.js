import { response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

const cargarArchivo = async(req, res = response) => {
    const url = req.header('imagen');
    const { tempFilePath } = req.files.imagen;

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
        secure: true
    });

    try {
        if (url) {
            const nombreArr = url.split('/');
            const [public_id] = nombreArr[nombreArr.length - 1].split('.');
            const imagenId = `${process.env.CLOUDFOLDER}${public_id}`;

            const imagen2 = await cloudinary.api.resources_by_ids(imagenId);

            if (imagen2.resources.length === 1) {
                const eliminado = await cloudinary.uploader.destroy(imagenId);
                const creado = await cloudinary.uploader.upload(tempFilePath, {
                    public_id: public_id,
                    folder: process.env.CLOUDFOLDER
                });

                return res.status(200).json({
                    recurso: imagen2,
                    eliminado: eliminado,
                    url: creado.secure_url
                });
            } else
                throw new Error(`No existe imagen con este url: ${url}`);
        } else {
            const creado = await cloudinary.uploader.upload(tempFilePath, { folder: process.env.CLOUDFOLDER }, (error, result) => {
                console.log(result, error);
            });

            return res.status(200).json({
                url: creado.secure_url
            });
        }
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

export {
    cargarArchivo
}