import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BASEUrl = process.env.REACT_APP_BASE_URL


const NotificationModal = ({ onClose, user_id }) => {
  const [notifications, setNotifications] = useState([]);
  const client = new W3CWebSocket(`${BASEUrl}ws/notifications/${user_id}`);

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket connection established');
    };

    client.onclose = () => {
      console.log('WebSocket connection closed');
    };

    client.onmessage = (message) => {
      const newNotification = JSON.parse(message.data);
      setNotifications(prev => [newNotification, ...prev]);
    };

    client.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      client.close();
    };
  }, [user_id]);

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Notifications</h2>
            <button onClick={onClose} className="text-red-500">Close</button>
          </div>
          {notifications.length === 0 ? (
            <p>No notifications.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="font-medium">{notification.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
