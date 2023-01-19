const { response } = require('express');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async(req, res = response) => {
    const url = req.header('imagen');
    const { tempFilePath } = req.files.imagen;

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
            const creado = await cloudinary.uploader.upload(tempFilePath, { folder: process.env.CLOUDFOLDER });

            return res.status(200).json({
                url: creado.secure_url
            });
        }
    } catch (e) {
        console.error(e.message);

        return res.status(406).json({ msg: e.message });
    }
}

/*
const subirActualizarImagen = async(req, res = response) => {
    const { id } = req.params;

    const image = cloudinary.v2.api.resources_by_ids([id],
        function(error, result) { console.log(result, error); });


}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(406).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(406).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(406).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}


const actualizarImagenCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(406).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(406).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(406).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo);
}

const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(406).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(406).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(406).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathImagen);
}
*/
module.exports = {
    cargarArchivo
}