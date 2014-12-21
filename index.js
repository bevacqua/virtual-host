'use strict';

function buildHostRegex(input){
    if (typeof input !== 'string'){
        return input;  
    }
    
    var hostname = input || '*';
    if (hostname.test(/[^A-z_0-9.*-]/)){
        throw new Error('Invalid characters in host pattern: ' + hostname);
    }

    var pattern = hostname
        .replace(/\./g, '\\.')
        .replace(/\*/g,'(.*)');

    var rhost = new RegExp('^' + pattern + '$', 'i');
    return rhost;
}

module.exports = function(factory){
    return function(hostname){
        var rhost = buildHostRegex(hostname);

        var middleware = function(req, res, next){
            if(middleware._on === false){
                return next();
            }

            if(!req.headers.host){
                return next();
            }

            var host = req.headers.host.split(':')[0];
            if(!rhost.test(host)){
                return next();
            }

            if (typeof middleware.server === 'function'){
                return middleware.server(req, res, next);
            }
            middleware.server.emit('request', req, res);
        };

        middleware.server = factory();

        middleware.off = function(){
            middleware._on = false;
        };

        middleware.on = function(){
            middleware._on = true;
        };

        return middleware;
    };
};
