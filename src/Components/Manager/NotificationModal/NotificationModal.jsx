import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

// const BASEUrl = process.env.REACT_APP_BASE_URL;
const socket = process.env.REACT_APP_SOCKET_URL;


const NotificationModal = ({ onClose, user_id }) => {
  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null); // Use ref to persist WebSocket client

  useEffect(() => {
    console.log("socket url is",socket)
    clientRef.current = new W3CWebSocket(`${BASEUrl}ws/notifications/${user_id}`);

    clientRef.current.onopen = () => {
     
      console.log('WebSocket connection established');
    };  

    clientRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      // Optionally, add reconnection logic here
    };

    clientRef.current.onmessage = (message) => {
      const newNotification = JSON.parse(message.data);
      setNotifications(prev => [newNotification, ...prev]); // Add new notification to the state
    };

    clientRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      clientRef.current.close();
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
