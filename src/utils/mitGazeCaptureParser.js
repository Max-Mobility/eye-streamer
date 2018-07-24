/**
 * Parser for the mit Gaze Capture dataset
 */

const fs = require('fs');

const filenames = {
    face: "appleFace.json",
    leftEye: "appleLeftEye.json",
    rightEye: "appleRightEye.json",
    info: "info.json",
    dotInfo: "dotInfo.json",
    faceGrid: "faceGrid.json",
    frames: "frames.json",
    screen: "screen.json"
}

module.exports = function(dir){

    var data = {}
    Object.keys(filenames).map(file => {
        data[file] = JSON.parse(fs.readFileSync(dir + '/' + filenames[file], 'utf8'));
    })

    const getFrame = function(i){
        return {
            face: {
                H: data.face.H[i],
                W: data.face.W[i],
                X: data.face.X[i],
                Y: data.face.Y[i],
                IsValid: data.face.IsValid[i]
            },
            leftEye: {
                H: data.leftEye.H[i],
                W: data.leftEye.W[i],
                X: data.leftEye.X[i],
                Y: data.leftEye.Y[i],
                IsValid: data.leftEye.IsValid[i]
            },
            rightEye: {
                H: data.rightEye.H[i],
                W: data.rightEye.W[i],
                X: data.rightEye.X[i],
                Y: data.rightEye.Y[i],
                IsValid: data.rightEye.IsValid[i]
            },
            dotInfo: {
                DotNum: data.dotInfo.DotNum[i],
                XPts: data.dotInfo.XPts[i],
                YPts: data.dotInfo.YPts[i],
                XCam: data.dotInfo.XCam[i],
                YCam: data.dotInfo.YCam[i],
                Time: data.dotInfo.Time[i]
            }
        }
    }


    this.createMITGazeCaptureFrames = function(){

        return [...Array(data.info.TotalFrames).keys()].map(getFrame);
    }

    this.getInfo = function(file){
        return data[file]
    }
    return this
};


