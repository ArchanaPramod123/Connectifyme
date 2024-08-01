import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImage';

const CropImage = ({ imgUrl, aspectInit, setCroppedImg }) => {
  console.log("enterrrrrrrrrrrrrrrrrrrrrrrrrrr")
  const [disable, setDisable] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPx, setCroppedAreaPx] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropComplete = (croppedArea, croppedAreaPx) => {
    setCroppedAreaPx(croppedAreaPx);
  };

  const onCrop = async () => {
    setDisable(true);
    try {
      const croppedUrl = await getCroppedImg(imgUrl, croppedAreaPx);
      setDisable(false);
      setCroppedImg(croppedUrl);
      console.log('Cropped URL:', croppedUrl); // Debugging
    } catch (error) {
      setDisable(false);
      console.error('Error cropping image:', error);
    }
  };

  return (
    <div className="w-[600px] h-[600px]">
            {/* <div className="fixed top-0 left-0 w-full h-full bg-black/25 bg-opacity-50 backdrop-blur-sm z-40"></div> */}
        <Cropper
          image={imgUrl}
          zoom={zoom}
          crop={crop}
          aspect={aspectInit}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />

<div className="fixed bottom-32 left-0 w-[100%] h-[80px] z-20">
        <div className="text-center">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onInput={(e) => {
              onZoomChange(parseFloat(e.target.value));
            }}
            className="w-[50%]"
          />
        </div>
        <div className="text-center">
          <button
            type="button"
            className="bg-red-500 text-white px-4 p-1 mr-5 rounded-lg"
            onClick={() => setCroppedImg(null)}
          >
            Cancel
          </button>
          {disable ? (
            <button type="button" className="bg-green-500 text-white px-4 p-1 rounded-lg pointer-events-none">
              Crop
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-4 p-1 rounded-lg"
              onClick={onCrop}
            >
              Crop
            </button>
          )}
        </div>
        </div>
  
     
    </div>
  );
};

export default CropImage;
