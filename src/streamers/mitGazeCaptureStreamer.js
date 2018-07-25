/**
 * Data streamer for a single trial from the MIT GazeCapture dataset
 **/
"use strict"
const log = console.log.bind(console);
const minimist = require('minimist');
const fs = require('fs')

const args = minimist(process.argv.slice(2),{
    string: 'directory',
    default: {
        directory: '.',
        fps: 1,
        port: 1337
    }
})

log("Directory to read: %s", args.directory)
log("FPS: %f",args.fps)
const blobFile = args.directory + '/framesblob.json'

if(fs.existsSync(blobFile)){
    log(`${blobFile} exists, reading in data...`)
    startStreaming(JSON.parse(fs.readFileSync(blobFile)))
} else{
    log(`${blobFile} does not exist. Reading in dataset...`)
    const dataParser = require('../utils/mitGazeCaptureParser')(args.directory);
    dataParser.createMITGazeCaptureFrames()
        .then(frames => {
            console.log(`writing frames to ${blobFile}`)
            fs.writeFileSync(blobFile, 
                     JSON.stringify(frames), 
                     err => { if (err) throw err;}
                    )
            return frames
        })
        .then(startStreaming)
}

function startStreaming(frames){
    const io = require('socket.io').listen(args.port);
    log('Starting socket')

    io.on('connection', socket => {
        
        log('User Connected. Starting stream to user...')

        socket.on('log', data => {
            log(data)
        })

        var i = 0;
        var frameStreamer = setInterval(function(){
            log('sending frames');
            socket.emit('frame', JSON.stringify(frames[i]))
            i++
            if(i >= frames.length){
                clearInterval(frameStreamer)
                console.log('Finished Streaming!')
            }
        },1000/args.fps)

        socket.on('disconnect', () => {
            log('User Disconnected.');
            clearInterval(frameStreamer);
        })
    })
}
