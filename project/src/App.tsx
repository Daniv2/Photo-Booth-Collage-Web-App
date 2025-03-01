import React, { useState } from 'react';
import PhotoBooth from './components/PhotoBooth';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
      <main className="flex-grow flex items-center justify-center p-4">
        <PhotoBooth isFullscreen={isFullscreen} />
      </main>
      <Footer />
    </div>
  );
}

export default App;