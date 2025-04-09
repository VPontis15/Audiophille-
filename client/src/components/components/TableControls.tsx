import { createPortal } from 'react-dom';
import { TableControlsProps } from '../../types/Dashboard/types';
import Button from '../utils/Button';
import SelectInput from './ui/SelectInput';
import { IoMdSearch } from 'react-icons/io';
import { IoMdAdd } from 'react-icons/io';
import { Outlet, useLocation } from 'react-router';
export default function TableControls({
  options,
  currentLimit,
  addLink = '',
  onLimitChange,
  onSearchChange,
  addBtn = false,
}: TableControlsProps) {
  const location = useLocation();
  const queryParams = location.search;
  return (
    <div className="flex justify-between items-center my-4 py-2">
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <SelectInput
            options={options}
            name="limit"
            value={String(currentLimit)}
            onChange={(e) => onLimitChange(e.target.value)}
          />
          <span className="text-sm text-gray-600">entries</span>
        </div>
        {addBtn && (
          <Button
            to={`${addLink}/${queryParams}`}
            sm
            withIcon
            className=" text-accent rounded-md"
          >
            <IoMdAdd width={20} height={20} className="w-5 h-5" />
            Add New
          </Button>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 pr-4 py-2 border rounded-md"
        />
        <IoMdSearch
          width={20}
          height={20}
          className="absolute w-5 h-5 left-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        />
      </div>
      {createPortal(<Outlet />, document.body)}
    </div>
  );
}
