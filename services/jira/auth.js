import fetch from "node-fetch";

const getPermisos = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/permissionscheme`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        console.log(error);

        return JSON.parse(error.message);
    }
}

const login = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        console.log(error);

        return JSON.parse(error.message);
    }
}

export {
    getPermisos,
    login
}