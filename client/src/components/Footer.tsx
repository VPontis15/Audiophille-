import Link from './utils/Link';
import Logo from './utils/Logo';
import facebook from '../assets/icon-facebook.svg';
import instagram from '../assets/icon-instagram.svg';
import twitter from '../assets/icon-twitter.svg';

export default function Footer(): React.ReactElement {
  return (
    <footer className="bg-text py-15 text-white ">
      <div className="max-w-container mx-auto grid gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className=" mx-auto sm:mx-0 mb-12 sm:mb-0">
            {/* Using Logo directly with its built-in link functionality instead of wrapping it in another Link */}
            <Logo />
          </div>
          <nav className="flex  items-center justify-center sm:justify-start  gap-8 ">
            <ul className="flex flex-col sm:flex-row items-center   gap-8 ">
              <li>
                <Link className="text-white" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="text-white" href="/products/headphones">
                  Headphones
                </Link>
              </li>
              <li>
                <Link className="text-white" href="/products/speakers">
                  Speakers
                </Link>
              </li>
              <li>
                <Link className="text-white" href="/products/earphones">
                  Earphones
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="text-white opacity-50 sm:max-w-[58ch] text-center sm:text-left">
          Audiophile is an all in one stop to fulfill your audio needs. We're a
          small team of music lovers and sound specialists who are devoted to
          helping you get the most out of personal audio. Come and visit our
          demo facility - we're open 7 days a week.
        </p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center sm:justify-between ">
          <p className="opacity-50">Copyright 2021. All Rights Reserved</p>
          <div className="flex gap-4">
            <Link href="#">
              <img
                className="social-icon transition duration-300 ease-in-out"
                src={facebook}
                alt=""
              />
            </Link>
            <Link href="#">
              <img
                className="social-icon transition duration-300 ease-in-out"
                src={instagram}
                alt=""
              />
            </Link>
            <Link href="#">
              <img
                className="social-icon transition duration-300 ease-in-out"
                src={twitter}
                alt=""
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
