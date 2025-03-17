import React from 'react';
import { useLocation, Link } from 'react-router';

export default function BreadCrumps(): React.ReactElement {
  const location = useLocation().pathname.split('/');
  const currentPath = useLocation().pathname.split('/').pop();
  let path = '';
  const breadcrumps = location.slice(1, location.length - 1);
  const breadcrumpsHtml = breadcrumps.map((breadcrump, index) => {
    path += `/${breadcrump}`;
    breadcrumps[index] =
      breadcrump.charAt(0).toUpperCase() + breadcrump.slice(1);
    return (
      <React.Fragment key={breadcrump}>
        {index !== 0 && <span>&gt;</span>}
        <Link className="text-text" to={path}>
          {breadcrump}
        </Link>
      </React.Fragment>
    );
  });
  return (
    <div className="text-text mb-8 mt-24 text-sm max-w-container mx-auto flex items-center gap-0.5">
      {breadcrumpsHtml}
      <span>&gt;</span>

      <span className="text-accent">{currentPath}</span>
    </div>
  );
}
