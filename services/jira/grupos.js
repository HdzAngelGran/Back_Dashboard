import fetch from "node-fetch";

const getGrupos = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/groups/picker`, requestOptions);

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

const getGrupoPorNombre = async(nombreG) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/group/member?groupname=${nombreG}`, requestOptions);

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
    getGrupos,
    getGrupoPorNombre
}