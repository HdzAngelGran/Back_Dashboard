import express, { json, static as estatic } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';

import dbConnection from '../database/config.js';
import * as routes from '../routes/index.js';
import { crons } from '../tasks/index.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);

        this.paths = {
            auth: '/api/auth',
            comentarios: '/api/comentarios',
            mensajes: '/api/mensajes',
            proyectos: '/api/proyectos',
            proyRecords: '/api/proyRecords',
            pruebas: '/api/pruebas',
            records: '/api/records',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios',
            usuarioProys: '/api/usuarioProys'
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Tareas programadas
        this.crons();
    }

    async conectarDB() {
        await dbConnection.dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(json());

        // Directorio Público
        this.app.use(estatic('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth, routes.auth);
        this.app.use(this.paths.comentarios, routes.comentarios);
        this.app.use(this.paths.mensajes, routes.mensajes);
        this.app.use(this.paths.proyectos, routes.proyecto);
        this.app.use(this.paths.proyRecords, routes.proyRecords);
        this.app.use(this.paths.pruebas, routes.prueba);
        this.app.use(this.paths.records, routes.records);
        this.app.use(this.paths.uploads, routes.upload);
        this.app.use(this.paths.usuarios, routes.usuario);
        this.app.use(this.paths.usuarioProys, routes.usuarioProys);
    }

    crons() {
        crons();
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

export default Server;