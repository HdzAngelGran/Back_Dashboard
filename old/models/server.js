const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);

        this.paths = {
            actividad: '/api/actividad',
            auth: '/api/auth',
            comentario: '/api/comentario',
            grupo: '/api/grupo',
            inscrito: '/api/inscrito',
            juego: '/api/juego',
            materia: '/api/materia',
            uploads: '/api/upload',
            usuarios: '/api/usuario',
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.actividad, require('../routes/actividades'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.comentario, require('../routes/comentarios'));
        this.app.use(this.paths.grupo, require('../routes/grupos'));
        this.app.use(this.paths.inscrito, require('../routes/inscritos'));
        this.app.use(this.paths.juego, require('../routes/juegos'));
        this.app.use(this.paths.materia, require('../routes/materias'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;