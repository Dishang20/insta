var http = require('http'),
    httpProxy = require('http-proxy');

//
// Setup proxy server with forwarding
//
var options = {
    router: {
        'proxytest.elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:7200',
        'elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:7200',
        'elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:4000',
        'karma.elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:15110',
        'test.elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:5555',
        'stealthisidea.elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:4000',
        'elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:7000',
        'www.elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:7000',
        'www.elastic-goldberg.34-106-86-128.plesk.page': '127.0.0.1:7200'

    }
};

var proxyServer = httpProxy.createServer(options).listen(80);

module.exports = { proxyServer }