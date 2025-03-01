import React from 'react';
import { Camera, Maximize, Minimize } from 'lucide-react';

interface HeaderProps {
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isFullscreen, setIsFullscreen }) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Camera className="h-6 w-6 text-gray-800" />
          <h1 className="text-xl font-semibold text-gray-800">Photo Booth Collage</h1>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5 text-gray-700" />
          ) : (
            <Maximize className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;