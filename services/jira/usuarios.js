import fetch from "node-fetch";

const getRoles1 = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/applicationrole`, requestOptions);

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

const getRoles2 = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/role`, requestOptions);

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

const getUsuarioPorEmail = async(email) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/groupuserpicker?query=${email}`, requestOptions);

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

const getUsuarioPorId = async(idU) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/user?accountId=${idU}`, requestOptions);

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

const getUsuarios = async() => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/users`, requestOptions);

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

const getUsuariosPorContenidoNombre = async(string) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/user/picker?query=${string}`, requestOptions);

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

const getUsuariosPorLlaveProyecto = async(pKey) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/user/assignable/search?project=${pKey}`, requestOptions);

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

const getUsuariosPorLlavesProyectos = async(pKeys) => {
    try {
        const myHeaders = { "Authorization": `Basic ${process.env.JIRATOKEN}` }

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }

        const response = await fetch(`https://wundertec.atlassian.net/rest/api/3/user/assignable/multiProjectSearch?projectKeys=${pKeys}`, requestOptions);

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
    getRoles1,
    getRoles2,
    getUsuarioPorEmail,
    getUsuarioPorId,
    getUsuarios,
    getUsuariosPorContenidoNombre,
    getUsuariosPorLlaveProyecto,
    getUsuariosPorLlavesProyectos
}