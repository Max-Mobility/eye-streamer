/**
* Data streamer for a single trial from the MIT GazeCapture dataset
**/
"use strict"
const log = console.log.bind(console);
const minimist = require('minimist');

var args = minimist(process.argv.slice(2),{
    string: 'directory',
    default: {
        directory: '.',
        fps: 1,
        port: 1337
    }
})

log('Reading in data')
const dataParser = require('../utils/mitGazeCaptureParser')(args.directory);
log('Done')


var io = require('socket.io').listen(args.port);

log("File to read: %s", args.file)
log("FPS: %f",args.fps)

log('creating framesInfo packet')
//createMITGazeCaptureFrames is a synchronous call. Perform at startup.
var frameInfo = dataParser.createMITGazeCaptureFrames();
log('done')

io.on('connection', socket => {
    
    log('User Connected. Starting stream to user...')

    socket.on('log', data => {
        log(data)
    })

    var i = 0;
    var frameStreamer = setInterval(function(){
        log('sending frameInfo');
        socket.emit('frameInfo', frameInfo[i])
        i++
        if(i >= frameInfo.length){
            clearInterval(frameStreamer)
            console.log('Finished Streaming!')
        }
    },1000/args.fps)

    socket.on('disconnect', () => {
        log('User Disconnected.');
        clearInterval(frameStreamer);
    })
})



