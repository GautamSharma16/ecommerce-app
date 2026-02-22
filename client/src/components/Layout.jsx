import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Header />
      <main className="flex-1 min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
