import React, { useState, useRef, useEffect } from 'react';
import { ColumnsIcon } from './Icons';

interface ColumnFilterProps<T extends string> {
  columns: Record<T, { label: string; visible: boolean }>;
  onToggle: (columnKey: T) => void;
}

const ColumnFilter = <T extends string>({ columns, onToggle }: ColumnFilterProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
      >
        <ColumnsIcon className="w-5 h-5 mr-2" />
        Colunas
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {Object.keys(columns).map((key) => (
              <label key={key} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  checked={columns[key as T].visible}
                  onChange={() => onToggle(key as T)}
                />
                <span className="ml-3">{columns[key as T].label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnFilter;