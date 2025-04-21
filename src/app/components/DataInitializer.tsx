"use client";

import { useEffect } from 'react';

export default function DataInitializer() {
  useEffect(() => {
    // Dynamically import and initialize user data
    import('../utils/storage').then(({ initializeUserData }) => {
      initializeUserData();
    });
  }, []);
  
  return null;
} 