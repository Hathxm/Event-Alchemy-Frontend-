// components/NotificationModal.js

import React from 'react';

const NotificationModal = ({ isOpen, onClose, notifications, handleAccept, handleReject }) => {
  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Vendor Requests</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <div className="mt-4">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((vendor, index) => (
                <li key={index} className="border-b border-gray-200 py-2 flex justify-between items-center">
                  <div>
                    <p><strong>{vendor.username}</strong> has requested to join.</p>
                    <p>{vendor.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleAccept(vendor.id)} className="bg-green-500 text-white px-3 py-1 rounded">Accept</button>
                    <button onClick={() => handleReject(vendor.id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No vendor requests available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
