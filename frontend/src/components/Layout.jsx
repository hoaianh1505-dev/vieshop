import Header from './Header';
import Footer from './Footer';
import ToastStack from './ToastStack';
import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Layout({ children }) {
  const { auth } = useApp();

  // Admin is restricted to /admin routes and cannot view client storefront
  if (auth && auth.user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative">
        <div className="mx-auto max-w-[1540px] px-4 py-6 lg:px-8 lg:py-8">
          {children || <Outlet />}
        </div>
      </main>
      <Footer />
      <ToastStack />
    </div>
  );
}


