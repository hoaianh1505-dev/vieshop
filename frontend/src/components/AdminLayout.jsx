import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ToastStack from './ToastStack';
import { useApp } from '../context/AppContext';
import { LogOut, Menu } from 'lucide-react';

export default function AdminLayout() {
  const { auth, logout } = useApp();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-row">
      {/* Desktop Sidebar (Sticky full height) */}
      <div className="w-72 h-screen sticky top-0 hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 h-full bg-slate-950 transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Right Page Container */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Sticky Top Navbar */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white px-6 py-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Menu Toggle for Mobile */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition mr-3 animate-pulse-subtle"
                title="Menu"
              >
                <Menu size={20} />
              </button>
              
              {/* Breadcrumb Info */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 select-none">
                <span>Hệ thống</span>
                <span>/</span>
                <span className="text-slate-800 font-bold">Bảng quản lý</span>
              </div>
            </div>

            {/* User welcome & quick navigation */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Xin chào, {auth?.user?.name || 'Admin'}</span>
              
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-650 transition"
                title="Đăng xuất"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Page Outlet */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>

        {/* Unified Clean Footer */}
        <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} VieShop Admin Panel. Thiết kế hệ thống tối giản chuyên nghiệp.</p>
        </footer>
      </div>

      <ToastStack />
    </div>
  );
}

