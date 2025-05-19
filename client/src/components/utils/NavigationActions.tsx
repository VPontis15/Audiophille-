import { SiAdminer } from 'react-icons/si';
import CartBtn from './CartBtn';
import Link from './Link';
import { useAppDispatch, useAppSelector } from '../../types/hooks';
import Button from './Button';
import { toast } from 'react-toastify';
import { IoLogIn } from 'react-icons/io5';
export default function NavigationActions(): React.ReactElement {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const logout = () => {
    dispatch({
      type: 'user/clearUser',
    });
    toast.success('Logout successful');
  };
  return (
    <div className="flex items-center gap-0.5">
      <CartBtn />z
      {/* <Link href={'/admin/dashboard'}>
        <SiAdminer className="text-white w-7.5 h-7.5 " />
      </Link> */}
      {user ? (
        <Button onClick={logout} className="text-white">
          Logout
        </Button>
      ) : (
        <Link className="text-white text-sm" href="/signup">
          <IoLogIn width={40} height={40} className="w-7 h-7" />
        </Link>
      )}
    </div>
  );
}
