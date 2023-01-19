import fetch from "node-fetch";

const getCompania = async() => {
    try {
        const myHeaders = { "Cookie": "PHPSESSID=1lrtodpcp1l8084baqou7rllt6; locale=en_US" }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://webapi.timedoctor.com/v1.1/companies?access_token=${process.env.TIMEDOCTORTOKEN}&_format=json`, requestOptions);

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
    getCompania
};