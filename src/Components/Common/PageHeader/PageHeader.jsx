import React from 'react';
import { Search } from 'lucide-react';

/**
 * Shared list-page header: a title, a rounded search input with a left search
 * icon, and an optional action slot (e.g. the "Add" button/modal trigger).
 *
 * Props:
 *  - title            heading text
 *  - search           controlled search value
 *  - onSearchChange   (value) => void
 *  - searchPlaceholder placeholder text (default "Search")
 *  - showSearch       toggle the search input (default true)
 *  - action           node rendered on the right (add button, etc.)
 */
const PageHeader = ({
  title,
  search,
  onSearchChange,
  searchPlaceholder = 'Search',
  showSearch = true,
  action,
}) => (
  <div className="py-8">
    <h2 className="text-2xl font-semibold leading-tight">{title}</h2>
    <div className="my-2 flex flex-col gap-2 sm:flex-row sm:items-center">
      {showSearch && (
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            placeholder={searchPlaceholder}
            className="block w-full appearance-none rounded-lg border border-gray-400 bg-white py-2 pl-10 pr-6 text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:text-gray-700 focus:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
      {action && <div className="sm:ml-auto">{action}</div>}
    </div>
  </div>
);

export default PageHeader;
