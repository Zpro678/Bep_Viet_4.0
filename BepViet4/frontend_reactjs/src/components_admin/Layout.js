
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

const SIDEBAR_ITEMS: NavItem[] = [
  { label: 'Tổng quan', path: '/dashboard', icon: 'dashboard' },
  { label: 'Duyệt công thức', path: '/approval', icon: 'rate_review', badge: 12 },
  { label: 'Quản lý người dùng', path: '/users', icon: 'people' },
];

const CATEGORY_ITEMS: NavItem[] = [
  { label: 'Loại món ăn', path: '/categories/types', icon: 'restaurant' },
  { label: 'Bữa ăn', path: '/categories/meals', icon: 'schedule' },
  { label: 'Chế độ ăn', path: '/categories/diets', icon: 'spa' },
  { label: 'Nguyên liệu', path: '/categories/ingredients', icon: 'egg' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center space-x-3 mb-4">
          <div className="bg-orange-500 p-1.5 rounded-lg text-white">
            <span className="material-icons-round text-2xl">soup_kitchen</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-800">CookSpace</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-orange-500'
              }`}
            >
              <span className="material-icons-round">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-6 pb-2 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Danh mục</p>
          </div>

          {CATEGORY_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-orange-500'
              }`}
            >
              <span className="material-icons-round text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}

          <div className="pt-4">
            <Link
              to="/reports"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/reports')
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-orange-500'
              }`}
            >
              <span className="material-icons-round">report_problem</span>
              <span className="flex-1">Báo cáo vi phạm</span>
              <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">
                5
              </span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <Link
            to="/settings"
            className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-all mb-4"
          >
            <span className="material-icons-round">settings</span>
            <span className="font-medium">Cài đặt hệ thống</span>
          </Link>

          <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-2xl">
            <img
              src="https://picsum.photos/seed/admin/100/100"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-orange-500 ring-offset-2"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">Alex Chef</p>
              <p className="text-xs text-slate-400 truncate">Super Admin</p>
            </div>
            <button className="text-slate-400 hover:text-red-500">
              <span className="material-icons-round text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="bg-orange-500 p-1.5 rounded-lg text-white">
              <span className="material-icons-round">soup_kitchen</span>
            </div>
            <span className="font-bold text-xl text-slate-800">CookSpace</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-500"
          >
            <span className="material-icons-round">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-64 bg-white h-full shadow-2xl p-6 flex flex-col">
             {/* Simple mobile nav copy */}
             <div className="mb-8">
               <span className="font-bold text-2xl text-slate-800">CookSpace</span>
             </div>
             <nav className="space-y-4">
                {SIDEBAR_ITEMS.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${isActive(item.path) ? 'bg-orange-50 text-orange-600 font-bold' : ''}`}
                  >
                    <span className="material-icons-round">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
             </nav>
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Layout;
