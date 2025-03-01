import React from 'react';

interface PhotoCollageProps {
  photos: string[];
}

const PhotoCollage: React.FC<PhotoCollageProps> = ({ photos }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-inner relative">
      {/* Decorative frame */}
      <div className="absolute inset-0 border-8 border-white rounded-lg shadow-lg pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0))',
             boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
           }}>
        <div className="absolute top-0 left-0 w-full h-8 bg-white flex justify-center items-center">
          <div className="text-gray-400 text-xs font-semibold tracking-wider">PHOTO BOOTH</div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-white flex justify-center items-center">
          <div className="text-gray-400 text-xs font-semibold">{new Date().toLocaleDateString()}</div>
        </div>
      </div>
      
      {/* Photo strip in column layout */}
      <div className="flex flex-col gap-3 py-10">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="overflow-hidden rounded-md shadow-sm border border-gray-100"
            style={{ aspectRatio: '4/3' }}
          >
            <img 
              src={photo} 
              alt={`Photo ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gray-200"></div>
      <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-gray-200"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-gray-200"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-gray-200"></div>
    </div>
  );
};

export default PhotoCollage;