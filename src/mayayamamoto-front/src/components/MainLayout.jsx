import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
