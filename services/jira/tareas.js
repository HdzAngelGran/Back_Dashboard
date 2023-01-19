import fetch from "node-fetch";

const getBacklogdeTareas = async(idB) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/agile/1.0/board/${idB}/backlog`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTareaMetadata = async(tKey) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issue/${tKey}/editmeta`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTareaPorId = async(idI) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issue/${idI}`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTareaPorLlave = async(tKey) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issue/${tKey}`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTareasPorTableroProyecto = async(idB, query) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/agile/1.0/board/${idB}/issue?${query}`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTareasUsuario = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issue/picker`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTiposLink = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issueLinkType`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTiposTarea = async(idD) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issuetype`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTiposTareaPorProyecto = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issue/createmeta`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTodasTareas = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/search`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTrabajadoresPorTarea = async(tKey) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issue/${tKey}/watchers`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTrabajoTarea = async(tKey) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issue/${tKey}/worklog`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

const getTransicionTarea = async(tKey) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/issue/${tKey}/transitions`, requestOptions);

        const status = response.status;
        const data = await response.json();

        if (status === 200)
            return data;
        else
            throw new Error(data);
    } catch (error) {
        return error;
    }
}

export {
    getBacklogdeTareas,
    getTareaMetadata,
    getTareaPorId,
    getTareaPorLlave,
    getTareasPorTableroProyecto,
    getTareasUsuario,
    getTiposLink,
    getTiposTarea,
    getTiposTareaPorProyecto,
    getTodasTareas,
    getTrabajadoresPorTarea,
    getTrabajoTarea,
    getTransicionTarea
}