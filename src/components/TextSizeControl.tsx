import React from 'react';
import { useTextSize } from '../context/TextSizeContext';
import { Minus, Plus } from 'lucide-react';

interface TextSizeControlProps {
  type: 'sidebar' | 'config';
}

const TextSizeControl: React.FC<TextSizeControlProps> = ({ type }) => {
  const { 
    sidebarTextSize, 
    configTextSize, 
    setSidebarTextSize, 
    setConfigTextSize 
  } = useTextSize();

  const sizes: ('xs' | 'sm' | 'base' | 'lg')[] = ['xs', 'sm', 'base', 'lg'];
  const currentSize = type === 'sidebar' ? sidebarTextSize : configTextSize;
  const setSize = type === 'sidebar' ? setSidebarTextSize : setConfigTextSize;

  const getCurrentIndex = () => sizes.indexOf(currentSize);

  const decrease = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      setSize(sizes[currentIndex - 1]);
    }
  };

  const increase = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < sizes.length - 1) {
      setSize(sizes[currentIndex + 1]);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-gray-700">
        Tamaño del texto ({type === 'sidebar' ? 'Sidebar' : 'Configuración'}):
      </span>
      <div className="flex items-center space-x-2">
        <button
          onClick={decrease}
          disabled={getCurrentIndex() === 0}
          className={`p-1 rounded ${
            getCurrentIndex() === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Minus size={16} />
        </button>
        <span className="w-24 text-center font-medium">
          {currentSize === 'xs' ? 'Extra Pequeño' :
           currentSize === 'sm' ? 'Pequeño' :
           currentSize === 'base' ? 'Mediano' : 'Grande'}
        </span>
        <button
          onClick={increase}
          disabled={getCurrentIndex() === sizes.length - 1}
          className={`p-1 rounded ${
            getCurrentIndex() === sizes.length - 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default TextSizeControl;