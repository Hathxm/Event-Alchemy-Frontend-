import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiMoreHorizontal } from 'react-icons/fi';
const BASEUrl = process.env.REACT_APP_BASE_URL;

const ChatRooms = ({ onSelectChat }) => {
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem('access');
            const response = await axios.get(`${BASEUrl}managers/chats/prev_msgs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChats(response.data);
            setFilteredChats(response.data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    useEffect(() => {
        fetchChats();

        // Set up an interval to fetch chats every 30 seconds
        const intervalId = setInterval(fetchChats, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Filter chats based on search term
        if (searchTerm) {
            const filtered = chats.filter(chat =>
                chat.user_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredChats(filtered);
        } else {
            setFilteredChats(chats);
        }
    }, [searchTerm, chats]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="w-1/3 border-r flex flex-col bg-gray-100">
            <div className="py-2 px-3 bg-gray-200 flex justify-between items-center">
                <div className="flex items-center ">
                    <img
                        className="w-10 h-10 rounded-full"
                        src="https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/companylogo2.svg"
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
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="flex-1 overflow-auto">
                {filteredChats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        className={`px-2 py-2 flex items-center cursor-pointer ${
                            chat.hasUnreadMessages ? 'bg-teal-100' : 'bg-gray-200'
                        }`}
                    >
                        <img
                            className="h-12 w-12 rounded-full"
                            src={chat.user_profile_pic ? chat.user_profile_pic : 'https://cdn-icons-png.flaticon.com/256/3177/3177440.png'}
                            alt="Contact"
                        />
                        <div className="ml-4 flex-1 border-b border-gray-300 py-2">
                            <div className="flex justify-between">
                                <p className="text-gray-800">{chat.user_name || 'Unknown User'}</p>
                            </div>
                            <p className="text-sm">
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
