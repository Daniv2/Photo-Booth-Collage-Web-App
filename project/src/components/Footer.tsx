import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-4 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Photo Booth Collage</p>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <a 
            href="#" 
            className="hover:text-gray-700 transition-colors"
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="hover:text-gray-700 transition-colors"
            aria-label="Terms of Service"
          >
            Terms of Service
          </a>
          <a 
            href="https://github.com" 
            className="hover:text-gray-700 transition-colors flex items-center space-x-1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;