import React, { useState, useRef, RefObject } from 'react';
import { X, Send, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ShareModalProps {
  onClose: () => void;
  collageRef: RefObject<HTMLDivElement>;
  downloadUrl: string | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, collageRef, downloadUrl }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter an email address');
      return;
    }
    
    if (!downloadUrl && !collageRef.current) {
      setErrorMessage('Could not generate collage image');
      return;
    }
    
    setStatus('sending');
    
    try {
      // Use existing downloadUrl if available, otherwise generate a new one
      const imageData = downloadUrl || await toPng(collageRef.current!, { 
        quality: 0.95,
        backgroundColor: 'white' 
      });
      
      // In a real app, you would send this to your backend
      // For demo purposes, we'll simulate a successful email send after a delay
      setTimeout(() => {
        console.log('Email would be sent to:', email);
        console.log('With image data:', imageData.substring(0, 50) + '...');
        setStatus('success');
      }, 2000);
      
    } catch (err) {
      console.error('Error generating collage for email:', err);
      setStatus('error');
      setErrorMessage('Failed to generate collage image');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Email Your Collage</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-5">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Sent!</h3>
              <p className="text-gray-500">
                Your collage has been sent to {email}
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-gray-600 mb-4">
                Enter your email address to receive your photo collage.
              </p>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={status === 'sending'}
                  required
                />
                {errorMessage && (
                  <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={status === 'sending'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-70"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;