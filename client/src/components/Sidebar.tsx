import React from 'react';
import { Link, useLocation } from 'react-router-dom';


import { Settings, User, Users, MessageCircle, LogOut } from 'lucide-react';
const navItems = [
  { label: 'Feed', icon: Users, path: '/feed' },
  { label: 'Chat', icon: MessageCircle, path: '/chat' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="flex flex-col bg-yellow-50 shadow-[2px_0_4px_rgba(254,240,138,0.4)] top-0 left-0 h-screen w-64 z-50">
      <h1 className="h-16 flex items-center justify-center  text-lg font-bold">
        Talksy: Chat App
      </h1>

      <div className='display flex flex-col overflow-y-auto justify-between' style={{height: "100vh"}}>
        <nav className="mt-4 flex flex-col space-y-1 px-4">
          {navItems.map(({ label, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition ${location.pathname === path
                ? 'bg-yellow-200 rounded-xl'
                : ' hover:bg-yellow-100'
                }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className='mt-4 flex flex-col space-y-1 px-4'>
          <button
            className={`cursor-pointer flex items-center space-x-3 gap-3 px-3 py-2 rounded-md text-sm font-medium transition  hover:bg-yellow-100`}
          >
            <Settings size={18} />
            Settings
          </button>

          <button
            className={`cursor-pointer flex font-medium items-center gap-3 px-3 text-sm py-2 rounded-md transition-all text-red-600 hover:bg-yellow-100`}

          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
