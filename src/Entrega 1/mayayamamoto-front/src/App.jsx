import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Patients from './components/Patients';
import Exercise from './components/Exercise';
import Agenda from './components/Agenda';
import Chat from './components/Chat';
import Profile from './pages/Profile';
import UploadVideo from './components/uploadVideoTeste';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/app',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Patients />,
      },
      {
        path: 'exercicios',
        element: <Exercise />,
      },
      {
        path: 'agenda',
        element: <Agenda />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'perfil',
        element: <Profile />,
      },
      {
        path: 'UploadVideo',
        element: <UploadVideo />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
