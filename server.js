'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PUBLIC_FOLDER = 'public';
const PORT = 8080;

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-type, Accept',
}

const contentTypes = new Map();
contentTypes.set('html', 'text/html');
contentTypes.set('js', 'text/javascript');
contentTypes.set('css', 'text/css');
contentTypes.set('json', 'application/json');
contentTypes.set('', 'text/html');  // default for files with no extension

const filesCache = new Map();

http.createServer(function (req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const reqUrl = url.parse(req.url, true);
    const fileName = reqUrl.pathname.length > 1 ? reqUrl.pathname.substr(1) : 'demo.html';
    const fileExt = fileName.split('.')[1] || '';
    const contentType = contentTypes.get(fileExt);
    const query = reqUrl.query;

    if (filesCache.has(fileName)) {
        writeHead(res, 200, contentType);
        res.write(filterData(filesCache.get(fileName), query, contentType));
        res.end();
    }
    else {
        fs.readFile(`${PUBLIC_FOLDER}/${fileName}`, function (err, data) {
            if (err) {
                if (err.code == 'ENOENT') {
                    writeHead(res, 404);
                    res.write('Resource no found');
                }
                else {
                    writeHead(res, 500);
                    res.write('Server Error');
                }
            } else {
                filesCache.set(fileName, data);
                writeHead(res, 200, contentType);
                res.write(filterData(data, query, contentType));
            }
            res.end();
        });
    }
}).listen(PORT, function () {
    console.log(`Client is available at http://localhost:${PORT}`);
});

function writeHead(res, status, contentType = 'text/plain') {
    res.writeHead(status, { ...{ 'Content-Type': contentType }, ...CORS_HEADERS });
}

function filterData(data, queryObj, contentType) {
    if(contentType !== contentTypes.get('json'))
        return data;
        
    return JSON.stringify(JSON.parse(data).filter(item => {
        for (const prop in queryObj) {
            if (Object.prototype.hasOwnProperty.call(queryObj, prop) && queryObj[prop] !== '') {
                switch (prop) {
                    case 'departure':
                    case 'arrival':
                        if (new Date(item[prop]) < new Date(queryObj[prop])) {
                            return false;
                        }
                        break;
                    default:
                        if (item[prop].toLowerCase().substr(0, queryObj[prop].length) !== queryObj[prop]) {
                            return false;
                        }
                        break;
                }
            }
        }
        return true;
    }));
}

