/**
 * Produces segmented images from a larger image given a corner location and bounding box
 * Wrapper for pythong/opencv that does the heavy lifting
 **/

//const PythonShell = require('python-shell');

const Jimp = require("jimp"),
      promisify = require('util').promisify;

Jimp.prototype.getBufferAsync = promisify(Jimp.prototype.getBuffer)

let count = 0;

const getSegmentedImages = async (frame) => {
    try{
        let image = {}
        if(frame.frameInfo.faceGrid.IsValid
          && frame.frameInfo.leftEye.IsValid
          && frame.frameInfo.rightEye.IsValid){
            let faceX = frame.frameInfo.face.X;
            let faceY = frame.frameInfo.face.Y;
            let faceW = frame.frameInfo.face.W;
            let faceH = frame.frameInfo.face.H;

            let leftEyeX = frame.frameInfo.leftEye.X;
            let leftEyeY = frame.frameInfo.leftEye.Y;
            let leftEyeW = frame.frameInfo.leftEye.W;
            let leftEyeH = frame.frameInfo.leftEye.H;

            let rightEyeX = frame.frameInfo.rightEye.X;
            let rightEyeY = frame.frameInfo.rightEye.Y;
            let rightEyeW = frame.frameInfo.rightEye.W;
            let rightEyeH = frame.frameInfo.rightEye.H;


            if(faceX < 0){
                faceW = faceW + faceX
                faceX = 0
            }
            if(faceY < 0){
                faceH = faceH + faceY
                faceY = 0
            }

            if(leftEyeX < 0){
                leftEyeW = leftEyeW + leftEyeX
                leftEyeX = 0
            }
            if(leftEyeY < 0){
                leftEyeH = leftEyeH + leftEyeY
                leftEyeY = 0
            }

            if(rightEyeX < 0){
                rightEyeW = rightEyeW + rightEyeX
                rightEyeX = 0
            }
            if(rightEyeY < 0){
                rightEyeH = rightEyeH + rightEyeY
                rightEyeY = 0
            }

            const faceImg = await Jimp.read('data/GazeCapture/frames/' + frame.frameInfo.frame)
            const leftEyeImg = faceImg.clone()
            const rightEyeImg = faceImg.clone()
            faceImg.crop(faceX, faceY, faceW, faceH).resize(224,224)
            leftEyeImg.crop(leftEyeX, leftEyeY, leftEyeW, leftEyeH).resize(224,224)
            rightEyeImg.crop(rightEyeX, rightEyeY, rightEyeW, rightEyeH).resize(224,224)
            image.face =await new Promise((resolve, reject) => {
                faceImg.getBuffer(Jimp.MIME_JPEG, (error, buff) => {
                    return error ? reject(error) : resolve(buff)
                })
            })
            image.leftEye =await new Promise((resolve, reject) => {
                leftEyeImg.getBuffer(Jimp.MIME_JPEG, (error, buff) => {
                    return error ? reject(error) : resolve(buff)
                })
            })
            image.rightEye =await new Promise((resolve, reject) => {
                rightEyeImg.getBuffer(Jimp.MIME_JPEG, (error, buff) => {
                    return error ? reject(error) : resolve(buff)
                })
            })
            console.log(++count)


        } else{
            console.log(++count)
/*
            console.log('FaceGrid', frame.frameInfo.faceGrid.IsValid)
            console.log('leftEye', frame.frameInfo.leftEye.IsValid)
            console.log('rightEye',frame.frameInfo.rightEye.IsValid)
*/
        }
        //console.log(image)
        return image
    } catch (err) {
        console.log(err)
    }
}
exports.getSegmentedImages = getSegmentedImages
