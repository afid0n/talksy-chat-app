import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Settings,
  Menu,
  X,
  User,
  Users,
  MessageCircle,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Feed', icon: Users, path: '/feed' },
  { label: 'Chat', icon: MessageCircle, path: '/chat' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleSidebar = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsOpen((prev) => !prev);
    }, 200);
  };

  return (
    <aside
      className={`
        h-screen z-50 bg-yellow-50 shadow-[2px_0_4px_rgba(254,240,138,0.4)]
        transition-all duration-300 flex flex-col overflow-x-hidden
        ${isOpen ? 'w-64' : 'w-16'}
      `}
    >
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <button onClick={toggleSidebar}>
          {isOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
        {isOpen && (
          <h1 className="text-lg font-bold ml-2 whitespace-nowrap">
            Talksy: Chat App
          </h1>
        )}
      </div>
      {/* Nav */}
      <div className="flex flex-col justify-between flex-1 ">
        <nav className="mt-4 flex flex-col space-y-1 px-2">
          {navItems.map(({ label, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition ${
                location.pathname === path
                  ? 'bg-yellow-200 rounded-xl'
                  : 'hover:bg-yellow-100'
              }`}
            >
              <div className="min-w-[24px] flex-shrink-0 flex items-center justify-center">
                <Icon
                  size={20}
                  className={`transition-transform duration-300`}
                />
              </div>
              <span
                className={`
                  whitespace-nowrap transition-all duration-300
                  ${isOpen ? 'opacity-100 ml-3 translate-x-0' : 'opacity-0 ml-0 -translate-x-2'}
                `}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mb-4 flex flex-col space-y-1 px-2">
          <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition hover:bg-yellow-100">
            <div className="min-w-[24px] flex-shrink-0 flex items-center justify-center">
              <Settings
                size={20}
                className={`transition-transform duration-300`}
              />
            </div>
            <span
              className={`
                whitespace-nowrap transition-all duration-300
                ${isOpen ? 'opacity-100 ml-3 translate-x-0' : 'opacity-0 ml-0 -translate-x-2'}
              `}
            >
              Settings
            </span>
          </button>

          <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 transition hover:bg-yellow-100">
            <div className="min-w-[24px] flex-shrink-0 flex items-center justify-center">
              <LogOut
                size={20}
                className={`transition-transform duration-300`}
              />
            </div>
            <span
              className={`
                whitespace-nowrap transition-all duration-300
                ${isOpen ? 'opacity-100 ml-3 translate-x-0' : 'opacity-0 ml-0 -translate-x-2'}
              `}
            >
              Log Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;