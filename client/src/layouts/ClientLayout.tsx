import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div >
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`transition-all duration-300 ${
          isOpen ? 'md:ml-64 ml-16' : 'ml-16'
        } `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;