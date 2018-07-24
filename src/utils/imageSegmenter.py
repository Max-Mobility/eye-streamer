import sys
import numpy as np
import cv2
import imageUtils
import os

# getInputImage
# Creates the properly formatted (cropped and scaled) images of the
# face, left eye, and right eye
# Arguments:
# imagePath - List of the paths of the images to retrieve
# dataset - String describing the dataset that the iamges come from
# 			3 possible values: 'train', 'validate', 'test' 
# Returns 4D 3 NumPy arrays containing the images (image, x, y, channel)
def getInputImage(imagePath, Face, Left, Right):
    #Desired size of images after processing
    desiredImageSize = 224

    #Creating numpy arrays to store images
    faceImage = np.zeros((desiredImageSize, desiredImageSize, 3))
    leftEyeImage =  np.zeros((desiredImageSize, desiredImageSize, 3)) 
    rightEyeImage =  np.zeros((desiredImageSize, desiredImageSize, 3))
    
    #Reading in frame from file
    image = cv2.imread(imagePath)

    
    #Crop image of face from original frame
    xFace = Face[0]
    yFace = Face[1]
    wFace = Face[2]
    hFace = Face[3]
    
    
    #Crop image of left eye
    #JSON file specifies position eye relative to face
    #Therefore, we must transform to make coordinates
    #Relative to picture by adding coordinates of face
    xLeft = Left[0] + xFace
    yLeft = Left[1] + yFace
    wLeft = Left[2]
    hLeft = Left[3]
    
    #Right Eye
    xRight = Right[0] + xFace
    yRight = Right[1] + yFace
    wRight = Right[2]
    hRight = Right[3] 
    
    #Bound checking - ensure x & y are >= 0
    if(xFace < 0):
	wFace = wFace + xFace
	xFace = 0
    if(yFace < 0):
	hFace = hFace + yFace
	yFace = 0
    if(xLeft < 0):
	wLeft = wLeft + xLeft
	xLeft = 0
    if(yLeft < 0):
	hLeft = hLeft + yLeft
	yLeft = 0
    if(xRight < 0):
	wRight = wRight + xRight
	xRight = 0
    if(yRight < 0):
	hRight = hRight + yRight
	yRight = 0
        
        
    #Retrieve cropped images
    faceImage = imageUtils.crop(image, xFace, yFace, wFace, hFace)
    leftEyeImage = imageUtils.crop(image, xLeft, yLeft, wLeft, hLeft)
    rightEyeImage = imageUtils.crop(image, xRight, yRight, wRight, hRight)
    
    #Resize images to 224x224 to pass to neural network
    faceImage = imageUtils.resize(faceImage, desiredImageSize)
    leftEyeImage = imageUtils.resize(leftEyeImage, desiredImageSize)
    rightEyeImage = imageUtils.resize(rightEyeImage, desiredImageSize)

    #Noramlize all data to scale 0-1
    faceImage = imageUtils.normalize(faceImage, 255)
    leftEyeImage = imageUtils.normalize(leftEyeImage, 255)
    rightEyeImage = imageUtils.normalize(rightEyeImage, 255)
    
    return faceImage, leftEyeImage, rightEyeImage


def main():
    Face = [int(float(sys.argv[1])), int(float(sys.argv[2])), int(float(sys.argv[3])), int(float(sys.argv[4]))]
    Left = [int(float(sys.argv[5])), int(float(sys.argv[6])), int(float(sys.argv[7])), int(float(sys.argv[8]))]
    Right = [int(float(sys.argv[9])), int(float(sys.argv[10])), int(float(sys.argv[11])), int(float(sys.argv[12]))]
    imagePath = sys.argv[13]
    faceImage, leftEyeImage, rightEyeImage = getInputImage(imagePath, Face, Left, Right)
    print(faceImage)
    sys.stdout.flush()

if __name__ == "__main__":
    main()
