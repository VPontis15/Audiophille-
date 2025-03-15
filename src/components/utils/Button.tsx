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
    ' py-3 px-8 md:py-4 font-bold md:px-8 border uppercase tracking-[1px] text-[13px] transition duration-300 ease-in-out cursor-pointer',
    rest.className, // Add custom classes directly as a separate argument
    {
      'bg-accent text-white hover:bg-hover border-accent': primary,
      'border-text text-text hover:bg-text hover:text-white': secondary,
      'border-none bg-none text-text hover:text-accent': transparent,
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
