"use client";

import { useEffect, useState } from 'react';

export default function PyodideLoader() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Check if Pyodide is loaded
    const checkPyodide = () => {
      if (typeof window !== 'undefined' && 'loadPyodide' in window) {
        console.log('Pyodide script loaded successfully');
        setLoaded(true);
        return true;
      }
      return false;
    };
    
    // Check immediately
    if (!checkPyodide()) {
      // If not loaded yet, check again in intervals
      const interval = setInterval(() => {
        if (checkPyodide()) {
          clearInterval(interval);
        }
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  return null; // This component doesn't render anything
} 