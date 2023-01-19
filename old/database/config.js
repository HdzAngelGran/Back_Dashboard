const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        if(process.env.PROD){
            await mongoose.connect( process.env.MONGODB_CNN, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

            console.log('Base de datos online Prueba');
        }
        else{
            await mongoose.connect( process.env.MONGODB_CNNP, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

            console.log('Base de datos online Producción');
        }
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}