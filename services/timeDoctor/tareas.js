import fetch from "node-fetch";

const getTareaPorUsuario = async(idU, idT) => {
    try {
        const myHeaders = { "Cookie": "PHPSESSID=1lrtodpcp1l8084baqou7rllt6; locale=en_US" }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://webapi.timedoctor.com/v1.1/companies/849623/users/${idU}/tasks/${idT}?access_token=${process.env.TIMEDOCTORTOKEN}&_format=json`, requestOptions);

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

const getTareasActivas = async() => {
    try {
        const myHeaders = { "Cookie": "PHPSESSID=1lrtodpcp1l8084baqou7rllt6; locale=en_US" }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://webapi.timedoctor.com/v1.1/companies/849623/worklogs?access_token=${process.env.TIMEDOCTORTOKEN}&_format=json`, requestOptions);

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

const getTareasPorUsuario = async(idU) => {
    try {
        const myHeaders = { "Cookie": "PHPSESSID=1lrtodpcp1l8084baqou7rllt6; locale=en_US" }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://webapi.timedoctor.com/v1.1/companies/849623/users/${idU}/tasks?access_token=${process.env.TIMEDOCTORTOKEN}&_format=json`, requestOptions);

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
    getTareaPorUsuario,
    getTareasActivas,
    getTareasPorUsuario
};