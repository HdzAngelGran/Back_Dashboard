import fetch from "node-fetch";

const getHistorialDeBusqueda = async(fechaInicial, fechaFinal, idU) => {
    try {
        const myHeaders = { "Cookie": "PHPSESSID=1lrtodpcp1l8084baqou7rllt6; locale=en_US" }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://webapi.timedoctor.com/v1.1/companies/849623/webandapp?access_token=${process.env.TIMEDOCTORTOKEN}&_format=jsonstart_date=${fechaInicial}&end_date=${fechaFinal}&user_id=${idU}`, requestOptions);

        const status = response.status;
        const data = await response.json();
        if (status === 200)
            return data;
        else {
            throw new Error(data);
        }
    } catch (e) {
        return JSON.parse(e.message);
    }
}

const getPaginasPorTrabajador = async(fechaInicial, fechaFinal) => {
    try {
        const myHeaders = { "Cookie": "PHPSESSID=1lrtodpcp1l8084baqou7rllt6; locale=en_US" }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://webapi.timedoctor.com/v1.1/companies/849623/poortime?access_token=${process.env.TIMEDOCTORTOKEN}&_format=json&start_date=${fechaInicial}&end_date=${fechaFinal}`, requestOptions);

        const status = response.status;
        const data = await response.json();
        if (status === 200)
            return data;
        else {
            throw new Error(data);
        }
    } catch (e) {
        return JSON.parse(e.message);
    }
}

const getTrabajador = async(idU) => {
    try {
        const myHeaders = { "Cookie": "PHPSESSID=1lrtodpcp1l8084baqou7rllt6; locale=en_US" }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://webapi.timedoctor.com/v1.1/companies/849623/users/${idU}?access_token=${process.env.TIMEDOCTORTOKEN}&_format=json`, requestOptions);

        const status = response.status;
        const data = await response.json();
        if (status === 200)
            return data;
        else {
            throw new Error(data);
        }
    } catch (e) {
        return JSON.parse(e.message);
    }
}

const getTrabajadores = async() => {
    try {
        const myHeaders = { "Cookie": "PHPSESSID=1lrtodpcp1l8084baqou7rllt6; locale=en_US" }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://webapi.timedoctor.com/v1.1/companies/849623/users?access_token=${process.env.TIMEDOCTORTOKEN}&_format=json`, requestOptions);
        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else {
            throw new Error(data);
        }
    } catch (e) {
        return JSON.parse(e.message);
    }
}

export {
    getHistorialDeBusqueda,
    getPaginasPorTrabajador,
    getTrabajador,
    getTrabajadores
};