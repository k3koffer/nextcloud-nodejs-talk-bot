const fs = require('fs');
let logger = require('../core/logger');

function generateAuth(user, pass) {
    return Buffer.from(`${user}:${pass}`).toString('base64');
}

let getStatus = function () {
    let data = fs.readFileSync('../status.json', 'utf-8');
    return JSON.parse(data);
};

let getCSRFtoken = async function (server, authString) {
    const client = require('../core/client').default;
    let response = client.get(`/index.php/csrftoken`);
    response = (await response).data.token;
    return response;
}

let getOpenedConversations = async function (server, auth) {
    const client = require('../core/client').default;
    let response = await client.get(`/ocs/v2.php/apps/spreed/api/v4/room`);

    if (response.status === 401) {
        logger.error('Error 401: Incorrect login or password!');
        return;
    }

    const data = response.data.ocs.data;
    return data;
};

let getOneOnOneConversations = function (list) {
    let result = [];
    list.forEach(element => {
        if (element.type == 1) {
            result.push(element);
        };
    });

    return result;
}

module.exports = {
    generateAuth,
    getStatus,
    getCSRFtoken,
    getOpenedConversations,
    getOneOnOneConversations
};