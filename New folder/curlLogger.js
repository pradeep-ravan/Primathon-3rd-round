const { v4: uuidv4 } = require('uuid');

function curlLogger(req, res, next){
    const requestId = uuidv4
    req.requestId = requestId;

    const method = req.method;
    const url = req.originalUrl;
    const headers = req.headers

    let curlCommand = `curl -X ${method}`

    for(const key in headers){
        curlCommand += `H "${key} : ${headers[key]}"`;
    }

    if(req.body && Object.keys(req.body).length > 0){
        const bodyString = JSON.stringify(req.body).replace(/"/g, '\\"');
        curlCommand += ` -d "${bodyString}"`;
    }

    curlCommand += ` "${req.protocol}://${req.get('host')}${url}" `
    console.log(curlCommand);
    next()
}