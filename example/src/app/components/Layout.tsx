import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Toaster } from './ui/sonner';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
