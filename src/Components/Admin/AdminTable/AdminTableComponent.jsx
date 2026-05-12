import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminTableComponent = memo(({ data, columns, pagination }) => {
  const { page, totalPages, onPageChange } = pagination || {};

  const renderPageNumbers = () => {
    if (!totalPages || totalPages <= 1) return null;
    const pages = [];
    const window = 1;
    const start = Math.max(1, page - window);
    const end = Math.min(totalPages, page + window);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('…');
    }
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('…');
      pages.push(totalPages);
    }

    return pages.map((p, i) =>
      p === '…' ? (
        <span key={`e-${i}`} className="px-2 text-gray-400">…</span>
      ) : (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`min-w-[32px] h-8 px-2 rounded text-sm border ${
            p === page
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      )
    );
  };

  return (
    <>
      <div className="overflow-auto max-h-[400px]">
        <table className="min-w-full leading-normal">
          <thead className="sticky top-0 z-20 bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id ?? index}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-8 px-2 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-8 px-2 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default AdminTableComponent;
