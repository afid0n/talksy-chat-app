import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Menu,
  X,
  User,
  Users,
  MessageCircle,
  LogOut,
} from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import { logoutUser } from '@/redux/userSlice';

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    { label: t('sidebar.feed'), icon: Users, path: '/feed' },
    { label: t('sidebar.chat'), icon: MessageCircle, path: '/chat' },
    { label: t('sidebar.profile'), icon: User, path: '/profile' },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    enqueueSnackbar(t('sidebar.logout_success'), { variant: 'success' });
    navigate('/auth/login');
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-30
        bg-yellow-50 dark:bg-zinc-900
        shadow-[2px_0_4px_rgba(254,240,138,0.4)] dark:shadow-[2px_0_4px_rgba(63,63,70,0.6)]
        transition-all duration-300 flex flex-col overflow-x-hidden
        ${isOpen ? 'w-64' : 'w-16'}
      `}
    >
      {/* Header with toggle */}
      <div className="px-4 py-4 flex items-center justify-between text-zinc-800 dark:text-white">
        <button onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isOpen && (
          <h1 className="text-lg font-bold ml-2 whitespace-nowrap">
            {t('sidebar.title')}
          </h1>
        )}
      </div>

      {/* Navigation items */}
      <div className="flex flex-col justify-between flex-1">
        <nav className="mt-4 flex flex-col space-y-1 px-2">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition
                  ${isActive
                    ? 'bg-yellow-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                    : 'hover:bg-yellow-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-gray-300'}
                `}
              >
                <div className="min-w-[24px] flex-shrink-0 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <span
                  className={`whitespace-nowrap transition-all duration-300
                    ${isOpen ? 'opacity-100 ml-3 translate-x-0' : 'opacity-0 ml-0 -translate-x-2'}
                  `}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center cursor-pointer px-4 py-2 rounded-md text-sm font-medium
            text-red-600 dark:text-red-400 transition
            hover:bg-yellow-100 dark:hover:bg-zinc-800
          `}
        >
          <div className="min-w-[24px] flex-shrink-0 flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <span
            className={`whitespace-nowrap transition-all duration-300
              ${isOpen ? 'opacity-100 ml-3 translate-x-0' : 'opacity-0 ml-0 -translate-x-2'}
            `}
          >
            {t('sidebar.logout')}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
