import React, { useState } from 'react';
import ChatRooms from './Chats';
import ChatMessages from './ChatMessages';

const ManagerChatComponent = () => {
    const [activeChat, setActiveChat] = useState(null);

    const handleSelectChat = (chat) => {
        setActiveChat(chat);
    };

    return (
        <div className="flex h-full">
            <ChatRooms onSelectChat={handleSelectChat} />
            <ChatMessages activeChat={activeChat} />
        </div>
    );
};

export default ManagerChatComponent;
