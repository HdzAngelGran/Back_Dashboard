import pkg from 'mongoose';
const { connect } = pkg;

const dbConnection = async() => {
    console.log('Conectando a la base de datos');

    try {
        if(process.env.PROD){
            await connect( process.env.MONGODB_CNN, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            console.log('Base de datos online Prueba');
        }
        else{
            await connect( process.env.MONGODB_CNNP, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            console.log('Base de datos online Producción');
        }
    } catch (error) {
        console.log(error);

        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

export default {
    dbConnection
}