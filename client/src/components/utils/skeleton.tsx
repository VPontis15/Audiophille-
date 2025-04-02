import classNames from 'classnames';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={classNames('bg-text/30 animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
