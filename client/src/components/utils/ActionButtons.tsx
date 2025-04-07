import { Link, useLocation } from 'react-router-dom';
import { CategoryProps } from '../../types/Dashboard/types';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

export default function ActionButtons({
  item,
  path,
}: {
  item: unknown;
  path?: string;
}): React.ReactElement {
  const location = useLocation();
  const queryParams = location.search;
  const id = item.slug ? item.slug : item.id;
  return (
    <div className="flex items-center justify-center gap-x-2">
      <Link
        to={`${path}/${id}${queryParams}`}
        type="button"
        className="text-text hover:text-blue-700"
      >
        <FaEdit size={20} />
      </Link>
      <Link
        to={`${path}/${id}/delete${queryParams}`}
        type="button"
        className="text-red-500 hover:text-red-700"
      >
        <MdDeleteForever size={20} />
      </Link>
    </div>
  );
}
