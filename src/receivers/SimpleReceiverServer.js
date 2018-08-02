/**
* Simple stream receiver to print incoming 'frameInfo' datapackets
**/
"use strict"
var log = console.log.bind(console);
const minimist = require('minimist');

var args = minimist(process.argv.slice(2),{
    default: {
        port: 1337
    }
})

const io = require('socket.io').listen(args.port);

io.on("connection", function(socket) {
    log('User Connected!')

    socket.on('log', data => {
		log(data.length)
        log(data)
    })

    socket.on("disconnect", function(){
        log('Disconnected!')
    })
})
