/**
* Simple stream receiver to print incoming 'frameInfo' datapackets
**/
"use strict"
var log = console.log.bind(console);
const minimist = require('minimist');

var args = minimist(process.argv.slice(2),{
    string: 'ip',
    default: {
        ip: '127.0.0.1',
        port: 1337
    }
})

var socket = require('socket.io-client')('http://' + args.ip + ':' + args.port);

socket.on("connect", function() {
    log('Connected!')

    socket.on('frame', data => {
        log(data)
    })

    socket.on("disconnect", function(){
        log('Disconnected!')
    })
})
