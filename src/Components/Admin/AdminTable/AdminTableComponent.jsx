import React, { memo } from 'react';

const AdminTableComponent = memo(({ data, columns }) => {
  
  console.log('table rendering');
  return (
    <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
      <table className="min-w-full leading-normal">
        <thead className="sticky top-0 bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 4).map((item, index) => (
            <tr key={index}>
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
  );
});

export default AdminTableComponent;
