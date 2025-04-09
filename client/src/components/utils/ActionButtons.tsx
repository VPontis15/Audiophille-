import { Link, useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

interface ItemWithId {
  id?: string | number;
  slug?: string;
}

export default function ActionButtons({
  item,
  path,
}: {
  item: ItemWithId;
  path?: string;
}): React.ReactElement {
  const location = useLocation();
  const queryParams = location.search;
  const id = typeof item.slug === 'string' ? item.slug : item.id;
  return (
    <div className="flex items-center justify-center gap-x-2">
      <Link
        to={`${path}/${id}/edit/${queryParams}`}
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
