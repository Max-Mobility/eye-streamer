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

    var start = Date.now() / 1000;
    console.log('Start Time: ', start)
    socket.on('frameInfo', data => {
        var end = Date.now() / 1000;
        console.log('Receive Time: ', end);
        var period = end - start;
        console.log('Period', period);
        start = end;
        console.log("FPS: ", 1/period);
    })

    socket.on("disconnect", function(){
        log('Disconnected!')
    })
})
