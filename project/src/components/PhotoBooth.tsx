import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Mail, RefreshCw } from 'lucide-react';
import { toPng } from 'html-to-image';
import CameraView from './CameraView';
import PhotoCollage from './PhotoCollage';
import ShareModal from './ShareModal';

interface PhotoBoothProps {
  isFullscreen: boolean;
}

const PhotoBooth: React.FC<PhotoBoothProps> = ({ isFullscreen }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  
  const maxPhotos = 4;
  
  const handleCapture = (photoDataUrl: string) => {
    setPhotos(prev => [...prev, photoDataUrl]);
  };
  
  const startCountdown = () => {
    setCountdown(3);
  };
  
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Trigger photo capture when countdown reaches 0
      const captureEvent = new CustomEvent('capture-photo');
      document.dispatchEvent(captureEvent);
      setCountdown(null);
    }
  }, [countdown]);
  
  const resetPhotos = () => {
    setPhotos([]);
    setIsCapturing(true);
    setDownloadUrl(null);
  };
  
  // Generate collage image when all photos are taken
  useEffect(() => {
    if (photos.length === maxPhotos && collageRef.current) {
      generateCollageImage();
    }
  }, [photos, isCapturing]);
  
  const generateCollageImage = async () => {
    if (!collageRef.current) return;
    
    try {
      const dataUrl = await toPng(collageRef.current, { 
        quality: 0.95,
        backgroundColor: 'white',
        style: {
          margin: '0',
          padding: '0'
        }
      });
      setDownloadUrl(dataUrl);
    } catch (err) {
      console.error('Error generating collage:', err);
    }
  };
  
  const downloadCollage = () => {
    if (!downloadUrl) return;
    
    const link = document.createElement('a');
    link.download = 'photo-booth-collage.png';
    link.href = downloadUrl;
    link.click();
  };
  
  const openShareModal = () => {
    setShowShareModal(true);
  };
  
  useEffect(() => {
    if (photos.length === maxPhotos) {
      setIsCapturing(false);
    }
  }, [photos]);
  
  return (
    <div className={`w-full max-w-md mx-auto ${isFullscreen ? 'scale-110' : ''}`}>
      {isCapturing ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Take Your Photos
            </h2>
            <p className="text-gray-600 mb-6">
              {photos.length === 0 
                ? "Click the button below to take your first photo" 
                : `Photo ${photos.length + 1} of ${maxPhotos}`}
            </p>
            
            <CameraView onCapture={handleCapture} countdown={countdown} />
            
            <div className="mt-6 flex justify-between items-center">
              <div className="flex space-x-2">
                {[...Array(maxPhotos)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full ${
                      i < photos.length ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={startCountdown}
                disabled={countdown !== null}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="h-5 w-5" />
                <span>{countdown !== null ? `${countdown}...` : "Take Photo"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your Photo Collage
            </h2>
            <p className="text-gray-600 mb-6">
              Here's your beautiful photo booth strip!
            </p>
            
            <div ref={collageRef} className="mx-auto" style={{ maxWidth: '300px' }}>
              <PhotoCollage photos={photos} />
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                onClick={resetPhotos}
                className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retake Photos</span>
              </button>
              
              <button
                onClick={downloadCollage}
                className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                disabled={!downloadUrl}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              
              <button
                onClick={openShareModal}
                className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Email Collage</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showShareModal && (
        <ShareModal 
          onClose={() => setShowShareModal(false)} 
          collageRef={collageRef}
          downloadUrl={downloadUrl}
        />
      )}
    </div>
  );
};

export default PhotoBooth;