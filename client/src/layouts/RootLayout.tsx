import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/components/ui/ScrollToTop';

export default function RootLayout(): React.ReactElement {
  return (
    <div className="relative z-10 font-sans leading-[1.7] text-text text-main bg-body mx-auto ">
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
