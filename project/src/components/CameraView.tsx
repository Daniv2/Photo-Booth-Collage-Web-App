import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  onCapture: (photoDataUrl: string) => void;
  countdown: number | null;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, countdown }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = async () => {
    try {
      setError(null);
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraPermission(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure you have granted camera permissions.');
      setCameraPermission(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL and pass to parent
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(photoDataUrl);
      }
    }
  };

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  useEffect(() => {
    const handleCaptureEvent = () => {
      capturePhoto();
    };
    
    document.addEventListener('capture-photo', handleCaptureEvent);
    
    return () => {
      document.removeEventListener('capture-photo', handleCaptureEvent);
    };
  }, []);

  return (
    <div className="relative">
      <div className={`aspect-video bg-gray-100 rounded-lg overflow-hidden ${countdown !== null ? 'relative' : ''}`}>
        {error ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <CameraOff className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {countdown !== null && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-7xl font-bold">{countdown}</span>
              </div>
            )}
          </>
        )}
      </div>
      
      {stream && (
        <button
          onClick={switchCamera}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all"
          aria-label="Switch camera"
        >
          <RefreshCw className="h-5 w-5 text-gray-800" />
        </button>
      )}
      
      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;