import React, { memo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_PAGE_SIZE = 5;

const AdminTableComponent = memo(({ data, columns, pagination, pageSize = DEFAULT_PAGE_SIZE }) => {
  // Two modes:
  //  - Server-side: the parent passes `pagination` ({ page, totalPages, onPageChange })
  //    and supplies only the current page's rows in `data`. Page changes should
  //    trigger a new request to the backend (page/page_size params).
  //  - Client-side (default): this table paginates `data` itself, `pageSize` rows
  //    per page. No backend support required.
  const isServer = !!pagination;

  const [clientPage, setClientPage] = useState(1);

  // Reset to the first page whenever the dataset size changes (e.g. a new search
  // or filter shrinks/grows the list) so we never sit on an out-of-range page.
  useEffect(() => {
    if (!isServer) setClientPage(1);
  }, [data.length, isServer]);

  const page = isServer ? pagination.page : clientPage;
  const totalPages = isServer
    ? pagination.totalPages
    : Math.max(1, Math.ceil(data.length / pageSize));
  const onPageChange = isServer ? pagination.onPageChange : setClientPage;

  const safePage = Math.min(page, totalPages);
  const rows = isServer
    ? data
    : data.slice((safePage - 1) * pageSize, safePage * pageSize);

  const renderPageNumbers = () => {
    if (!totalPages || totalPages <= 1) return null;
    const pages = [];
    const window = 1;
    const start = Math.max(1, safePage - window);
    const end = Math.min(totalPages, safePage + window);

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
            p === safePage
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
      <div className="overflow-x-auto">
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
            {rows.map((item, index) => (
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {safePage} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(safePage - 1)}
              disabled={safePage <= 1}
              className="h-8 px-2 rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => onPageChange(safePage + 1)}
              disabled={safePage >= totalPages}
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
