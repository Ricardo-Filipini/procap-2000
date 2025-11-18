import React from 'react';
import { User } from '../types';
import { BookOpenIcon, TrophyIcon, LogoutIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  setCurrentView: (view: 'study' | 'leaderboard') => void;
  currentView: string;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onLogout, setCurrentView, currentView, user }) => {
  const NavItem = ({ icon, text, view, active }: { icon: React.ReactNode; text: string; view: 'study' | 'leaderboard'; active: boolean }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
        active ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className={`ml-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{text}</span>
    </button>
  );

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out z-10 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16">
        <div className={`font-bold text-xl dark:text-white transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          Procap<span className="text-blue-500">200</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 absolute right-3">
          {isOpen ? <ChevronLeftIcon className="h-6 w-6" /> : <ChevronRightIcon className="h-6 w-6" />}
        </button>
      </div>

      <nav className="flex-grow p-3">
        <NavItem 
            icon={<BookOpenIcon className="h-6 w-6 flex-shrink-0" />} 
            text="Estudar Questões" 
            view="study"
            active={currentView === 'study'}
        />
        <NavItem 
            icon={<TrophyIcon className="h-6 w-6 flex-shrink-0" />} 
            text="Leaderboard" 
            view="leaderboard"
            active={currentView === 'leaderboard'}
        />
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {user.pseudonym.charAt(0).toUpperCase()}
            </div>
            <div className={`ml-3 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{user.pseudonym}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Nível {user.level}</p>
            </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center w-full p-3 mt-4 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
        >
          <LogoutIcon className="h-6 w-6 flex-shrink-0" />
          <span className={`ml-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
