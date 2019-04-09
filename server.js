'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PUBLIC_FOLDER = 'public';
const PORT = 8080;

const contentTypes = new Map();
contentTypes.set('html', 'text/html');
contentTypes.set('js', 'text/javascript');
contentTypes.set('css', 'text/css');
contentTypes.set('json', 'application/json');
contentTypes.set('', 'text/html');  // default for files with no extension

http.createServer(function (req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const reqUrl = url.parse(req.url);
    const fileName = reqUrl.pathname.length > 1 ? reqUrl.pathname.substr(1) : 'demo.html';
    const fileExt = fileName.split('.')[1] || '';
    const contentType = contentTypes.get(fileExt);

    fs.readFile(`${PUBLIC_FOLDER}/${fileName}`, function (err, data) {
        if (err) {
            if (err.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('Resource no found');
            }
            else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Server Error');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                // CORS headers
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-type, Accept',
            });
            res.write(data);
        }
        res.end();
    });
}).listen(PORT, function () {
    console.log(`Client is available at http://localhost:${PORT}`);
});
