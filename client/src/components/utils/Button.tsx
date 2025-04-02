import type { FunctionComponent } from 'react';
import className from 'classnames';
import Link from './Link';
import { ButtonProps } from '../../types/genericTypes';

const Button: FunctionComponent<ButtonProps> = ({
  children,
  primary,
  secondary,
  transparent,
  sm = false,
  lg = false,
  to = '',
  ...rest
}) => {
  const classes = className(
    'border font-bold uppercase tracking-[1px] transition duration-300 ease-in-out cursor-pointer',
    rest.className, // Add custom classes directly as a separate argument
    {
      // Color variants
      ' bg-accent text-white hover:bg-hover border-accent text-[13px] hover:border-hover hover:text-white ':
        primary,
      '  border-text text-text hover:bg-text hover:text-white text-[13px]':
        secondary,
      ' border-none bg-none text-text hover:text-accent text-[13px]':
        transparent,

      // Size variants
      'py-2 px-4 text-xs': sm,
      'py-3 px-8 md:py-4 md:px-8 text-[13px]': !sm && !lg, // md is default
      'py-4 px-10 md:py-5 md:px-12 text-sm': lg,
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
