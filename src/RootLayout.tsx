import { Outlet } from 'react-router';
import Header from './components/Header';

export default function RootLayout() {
  return (
    <div className="relative z-10 text-white text-main bg-body mx-auto ">
      <Header />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
