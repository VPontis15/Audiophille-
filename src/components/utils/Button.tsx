import type { FunctionComponent } from 'react';
import className from 'classnames';

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
  }> &
  Exclusive<['primary', 'secondary', 'success', 'warning', 'danger'], boolean>;

const Button: FunctionComponent<ButtonProps> = ({
  children,
  primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  rounded,
  to = '',
  ...rest
}) => {
  const classes = className(
    'py-2 px-4 border uppercase tracking-[1px] text-[13px] transition duration-300 ease-in-out cursor-pointer',
    rest.className, // Add custom classes directly as a separate argument
    {
      'bg-accent text-white hover:bg-hover border-accent': primary,
      'border-text text-text hover:bg-text hover:text-white': secondary,
    }
  );
  if (to) {
    return (
      <a href={to} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
};

export default Button;
