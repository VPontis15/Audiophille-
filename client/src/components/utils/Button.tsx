import type { FunctionComponent } from 'react';
import className from 'classnames';
import Link from './Link';

type ExcludeFromTuple<T extends any[], U> = {
  [K in keyof T]: T[K] extends U ? never : T[K];
}[number];

type Exclusive<T extends PropertyKey[], U = any> = T[number] extends infer E
  ? E extends string
    ? Record<E, U> & { [k in ExcludeFromTuple<T, E>]?: never }
    : never
  : never & {};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Partial<{
    outline?: boolean;
    rounded?: boolean;
    to?: string;
    children: React.ReactNode;
  }> &
  Exclusive<['primary', 'secondary', 'transparent'], boolean>;

const Button: FunctionComponent<ButtonProps> = ({
  children,
  primary,
  secondary,
  transparent,

  to = '',

  ...rest
}) => {
  const classes = className(
    '  border py-3 px-8 md:py-4  md:px-8 font-bold uppercase tracking-[1px]  transition duration-300 ease-in-out cursor-pointer',
    rest.className, // Add custom classes directly as a separate argument
    {
      ' bg-accent text-white hover:bg-hover border-accent text-[13px] hover:border-hover hover:text-white ':
        primary,
      '  border-text text-text hover:bg-text hover:text-white text-[13px]':
        secondary,
      ' border-none bg-none text-text hover:text-accent text-[13px]':
        transparent,
    }
  );
  if (to) {
    return (
      <Link href={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
};

export default Button;
