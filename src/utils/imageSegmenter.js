/**
 * Produces segmented images from a larger image given a corner location and bounding box
 * Wrapper for pythong/opencv that does the heavy lifting
 **/

//const PythonShell = require('python-shell');

const Jimp = require("jimp");

var getSegmentedImages = function(frame){
    var image = {}

    if(frame.frameInfo.faceGrid.IsValid){
        var faceX = frame.frameInfo.face.X;
        var faceY = frame.frameInfo.face.Y;
        var faceW = frame.frameInfo.face.W;
        var faceH = frame.frameInfo.face.H;

        if(faceX < 0){
            faceW = faceW + faceX
            faceX = 0
        }
        if(faceY < 0){
            faceH = faceH + faceY
            faceY = 0
        }
        
        Jimp.read('data/GazeCapture/frames/' + frame.frameInfo.frame, (err, img) => {
            console.log('Valid Frame Started')
            if(err) throw err;
            img.crop(faceX, faceY, faceW, faceH)
            img.resize(224,224)
            console.log(Object.keys(img))
            console.log('Valid Frame Complete');
        })
    } else{
        console.log('Invalid Frame')
    }
        return image


    /*    console.log('In ImSeg')

     
     var options = {
     mode: 'text',
     scriptPath: 'src/utils',
     args: [frame.frameInfo.face.X,
     frame.frameInfo.face.Y,
     frame.frameInfo.face.W,
     frame.frameInfo.face.H,
     frame.frameInfo.leftEye.X,
     frame.frameInfo.leftEye.Y,
     frame.frameInfo.leftEye.W,
     frame.frameInfo.leftEye.H,
     frame.frameInfo.rightEye.X,
     frame.frameInfo.rightEye.Y,
     frame.frameInfo.rightEye.W,
     frame.frameInfo.rightEye.H,
     '../../data/GazeCapture/frames/' + frame.frameInfo.frame
     ]
     }

     console.log('running python script...')
     PythonShell.run('imageSegmenter.py', options, (err, results) => {
     if(err) throw err;
     console.log('results: %j', results);
     })
     console.log('script completed')

     const pythonProcess = spawn('python', ["../utils/imageSegmenter.py", 
     frame.frameInfo.face.X,
     frame.frameInfo.face.Y,
     frame.frameInfo.face.W,
     frame.frameInfo.face.H,
     frame.frameInfo.leftEye.X,
     frame.frameInfo.leftEye.Y,
     frame.frameInfo.leftEye.W,
     frame.frameInfo.leftEye.H,
     frame.frameInfo.rightEye.X,
     frame.frameInfo.rightEye.Y,
     frame.frameInfo.rightEye.W,
     frame.frameInfo.rightEye.H,
     '../../data/GazeCapture/frames/' + frame.frameInfo.frame
     ]
     )
     pythonProcess.stdout.on('data', (data) => {
     console.log('Python Output:',data)
     })
     pythonProcess.stderr.on('data', (data) => {
     console.log('Python Error: ', data)
     })*/
}

exports.getSegmentedImages = getSegmentedImages
