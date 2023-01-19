import fetch from "node-fetch";

const getDashboardPorId = async(idD) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/dashboard/${idD}`, requestOptions);

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

const getDashboards = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/dashboard`, requestOptions);

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
    getDashboardPorId,
    getDashboards
}