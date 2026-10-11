import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';
import { Bell, AlertTriangle, UserCircle2, CheckCircle2, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    navTab,
    setNavTab,
    unreadNotificationCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openReportModal,
    currentUser,
    isAuthenticated,
    openAuthModal,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'maps', label: 'Maps' },
    { id: 'communities', label: 'Communities' },
    { id: 'activities', label: 'Activities' },
    { id: 'education', label: 'Education' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <button
          onClick={() => setNavTab('home')}
          className="text-xl font-bold tracking-tight text-slate-900 font-display hover:text-teal-700 transition-colors text-left"
        >
          Jal-Dharani
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = navTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setNavTab(link.id)}
                className={`transition-colors relative py-1 ${
                  isActive
                    ? 'text-teal-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Report an Issue Action */}
          <button
            onClick={() => openReportModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report Observation</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-800 tracking-wide uppercase">
                    Environmental Alerts & Updates
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-xs text-slate-500 text-center">No alerts at present</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.link) {
                            setNavTab(notif.link as NavTab);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                          !notif.read ? 'bg-teal-50/40' : ''
                        }`}
                      >
                        <div className="text-xs font-semibold text-slate-900 mb-0.5">{notif.title}</div>
                        <div className="text-xs text-slate-600 leading-relaxed mb-1">{notif.message}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(notif.timestamp).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar or Sign In trigger */}
          {isAuthenticated ? (
            <button
              onClick={() => setNavTab('profile')}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="View your profile"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-teal-600 shadow-2xs"
                />
              ) : (
                <UserCircle2 className="w-7 h-7 text-teal-700" />
              )}
              <span className="hidden sm:inline text-xs font-semibold text-slate-800">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-around text-xs font-medium bg-white">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setNavTab(link.id)}
            className={`py-1 px-1.5 ${
              navTab === link.id
                ? 'text-teal-800 font-bold border-b-2 border-teal-600'
                : 'text-slate-600'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
