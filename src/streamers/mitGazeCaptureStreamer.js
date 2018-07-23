/**
* Data streamer for a single trial from the MIT GazeCapture dataset
*/
const log = console.log.bind(console);
const minimist = require('minimist');
const fs = require('fs');

var args = minimist(process.argv.slice(2),{
    string: 'directory',
    default: {
        directory: '.',
        fps: 1,
        port: 1337
    }
})

//const gazeParser = require('../utils/mitGazeCaptureParser');
var io = require('socket.io').listen(args.port);

console.dir(args);

log('Listening on port ' + args.port);
log('Directory: ', args.directory);
log('FPS: ', args.fps);



