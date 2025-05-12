import { SiAdminer } from 'react-icons/si';
import CartBtn from './CartBtn';
import Link from './Link';

export default function NavigationActions(): React.ReactElement {
  return (
    <div className="flex items-center gap-6">
      <CartBtn />
      {/* <Link href={'/admin/dashboard'}>
        <SiAdminer className="text-white w-7.5 h-7.5 " />
      </Link> */}
      <Link className="text-white text-sm" href="/signup">
        Login/Singup
      </Link>
    </div>
  );
}
