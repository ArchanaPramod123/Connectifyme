import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getProfileCroped';

const ProfileCrop = ({ imgUrl, aspectInit, setCroppedImg ,onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imgUrl, croppedArea);
      setCroppedImg(croppedImage);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
      <div className="w-[40rem] h-[40rem] relative">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <Cropper
            image={imgUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectInit}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
          />
          <div className="absolute top-5 right-0 m-4 z-10">
            <button onClick={handleCropImage} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCrop;
