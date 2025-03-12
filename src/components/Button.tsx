import classname from 'classnames';

interface ButtonProps {
  to?: string;
  className?: string;
  primary?: boolean;
  secondary?: boolean;
  outline?: boolean;
  success?: boolean;
  danger?: boolean;
  warning?: boolean;
  submit?: boolean;
  icon?: string;
  children: React.ReactNode;
}

export default function Button({
  children,
  primary,
  secondary,
  outline,
  success,
  danger,
  warning,
  className,
  submit,
  icon = '',
  to,

  ...props
}: ButtonProps): React.ReactElement {
  const classes = classname(
    'py-2 px-4 border uppercase tracking-[1px] text-[13px] transition duration-300 ease-in-out cursor-pointer',
    className, // Add custom classes directly as a separate argument
    {
      'bg-accent text-white hover:bg-hover border-accent': primary,
      'border-text text-text hover:bg-text hover:text-white': secondary,
    }
  );

  if (to) {
    return (
      <a className={classes} {...props} href={to}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
