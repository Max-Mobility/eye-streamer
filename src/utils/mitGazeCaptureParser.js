/**
 * Parser for the mit Gaze Capture dataset
 */

const fs = require('fs');
//const imSeg = require('../utils/imageSegmenter')

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
        var frame = {}
        frame.frameInfo = {}
        Object.keys(filenames).map(field => {
            var fieldData = {}
            if(field == 'frames'){
                fieldData = data[field][i]
            } else {
                Object.keys(data[field]).map(val => {
                    fieldData[val] = data[field][val][i]
                })
            }
            if(field == 'frames'){
                field = 'frame'
            }
            frame.frameInfo[field] = fieldData
        })
        return frame
    }


    this.createMITGazeCaptureFrames = function(){

        return [...Array(data.info.TotalFrames).keys()].map(getFrame);
    }

    this.getInfo = function(file){
        return data[file]
    }
    return this
};


