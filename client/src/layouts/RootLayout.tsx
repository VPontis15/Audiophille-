import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout(): React.ReactElement {
  return (
    <div className="relative z-10 font-sans leading-[1.7] text-text text-main bg-body mx-auto ">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
