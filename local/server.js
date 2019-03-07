var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

// maps file extention to MIME types
var mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};

var port = process.env.PORT || 8080;
process.env.development = true;

console.log('Starting up local server ...');
http.createServer(function (req, res) {
    // parse URL
    var parsedUrl = url.parse(req.url);

    // extract URL path
    // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
    // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
    // by limiting the path to current directory only
    var sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    var pathname = path.join(__dirname, '..', sanitizePath);

    fs.exists(pathname, function (exist) {
        if (!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        // if is a directory, then look for index.html
        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/index.html';
        }

        // read file from file system
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                const ext = path.parse(pathname).ext;
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', mimeType[ext] || 'text/plain');
                if(ext === '.html') {
                    res.end(replaceMockUrl(data));
                } else {
                    res.end(data);
                }
            }
        });
    });
}).listen(port, function () {
    console.log('Server is listening on : http://localhost:' + port);
});

const replaceMockUrl = function(buffer) {
    const regex = /'https:\/\/(.*)\/findAllActive(\S+)\?(\S+)'/;
    const data = buffer.toString('utf-8');

    const dataType = regex.exec(data)[2].toLowerCase();
    const mockUrl = `http://localhost:${port}/local/mock/${dataType}.json`;
    return data.replace(regex, `'${mockUrl}'`);  
}