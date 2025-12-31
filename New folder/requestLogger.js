const { v4: uuidv4 } = require('uuid');

function requestLogger(req, res, next){
    req.requestId = uuidv4;

    console.log(`Headers ${JSON.stringify(req.headers, null, 2)}`);

    if(req.body && Object.keys(req.body).length > 0){
        console.log(`Body ${JSON.stringify(req.body, null, 2)}`);
    }

    next()
}

module.exports = requestLogger