import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiMoreHorizontal } from 'react-icons/fi';
const BASEUrl = process.env.REACT_APP_BASE_URL

const ChatRooms = ({ onSelectChat }) => {
    const [chats, setChats] = useState([]);
  

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem('access');
            const response = await axios.get(`${BASEUrl}managers/chats/prev_msgs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChats(response.data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    useEffect(() => {
        // Fetch chats initially
        fetchChats();

        // Set up an interval to fetch chats every 30 seconds
        const intervalId = setInterval(fetchChats, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="w-1/3 border-r flex flex-col bg-gray-100">
            <div className="py-2 px-3 bg-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        className="w-10 h-10 rounded-full"
                        src="http://andressantibanez.com/res/avatar.png"
                        alt="User Avatar"
                    />
                </div>
                <div className="flex space-x-4">
                    <FiSearch className="w-6 h-6 text-gray-600" />
                    <FiMoreHorizontal className="w-6 h-6 text-gray-600" />
                </div>
            </div>
            <div className="py-2 px-2 bg-gray-100">
                <input
                    type="text"
                    className="w-full px-2 py-2 text-sm border rounded"
                    placeholder="Search or start new chat"
                />
            </div>
            <div className="flex-1 overflow-auto">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        className={`px-2 py-2 flex items-center cursor-pointer ${
                            chat.hasUnreadMessages ? 'bg-teal-100' : 'bg-gray-200'
                        }`}
                    >
                        <img
                            className="h-12 w-12 rounded-full"
                            src={chat.user_profile_pic || 'default-image-url'}
                            alt="Contact"
                        />
                        <div className="ml-4 flex-1 border-b border-gray-300 py-2">
                            <div className="flex justify-between">
                                <p className="text-gray-800">{chat.user_name || 'Unknown User'}</p>
                                <p className="text-xs text-gray-500">12:45 pm</p>
                            </div>
                            <p className={`text-sm ${chat.hasUnreadMessages ? 'font-bold' : 'text-gray-600'}`}>
                                {chat.last_message?.message || 'No messages yet'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
 
export default ChatRooms;

