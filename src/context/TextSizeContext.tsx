import React, { createContext, useContext, useState, useEffect } from 'react';

type TextSize = 'xs' | 'sm' | 'base' | 'lg';

interface TextSizeContextType {
  sidebarTextSize: TextSize;
  configTextSize: TextSize;
  setSidebarTextSize: (size: TextSize) => void;
  setConfigTextSize: (size: TextSize) => void;
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);

export const TextSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarTextSize, setSidebarTextSize] = useState<TextSize>('base');
  const [configTextSize, setConfigTextSize] = useState<TextSize>('base');

  useEffect(() => {
    // Cargar preferencias guardadas
    const savedSidebarSize = localStorage.getItem('sidebarTextSize') as TextSize;
    const savedConfigSize = localStorage.getItem('configTextSize') as TextSize;

    if (savedSidebarSize) setSidebarTextSize(savedSidebarSize);
    if (savedConfigSize) setConfigTextSize(savedConfigSize);
  }, []);

  const handleSetSidebarTextSize = (size: TextSize) => {
    setSidebarTextSize(size);
    localStorage.setItem('sidebarTextSize', size);
  };

  const handleSetConfigTextSize = (size: TextSize) => {
    setConfigTextSize(size);
    localStorage.setItem('configTextSize', size);
  };

  return (
    <TextSizeContext.Provider
      value={{
        sidebarTextSize,
        configTextSize,
        setSidebarTextSize: handleSetSidebarTextSize,
        setConfigTextSize: handleSetConfigTextSize,
      }}
    >
      {children}
    </TextSizeContext.Provider>
  );
};

export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (context === undefined) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};