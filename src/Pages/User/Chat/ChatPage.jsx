import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { FiSend, FiSearch, FiMoreHorizontal, FiPaperclip, FiDownload, FiEye } from 'react-icons/fi';
import axios from 'axios';
import moment from 'moment';
const BASEUrl = process.env.REACT_APP_BASE_URL;
const socket = process.env.REACT_APP_SOCKET_URL;


const ChatComponent = ({ }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filteredChats, setFilteredChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    


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



    const fetchChats = async () => {
        try {
            const token = localStorage.getItem('access');
            const response = await axios.get(`${BASEUrl}chats/prev_msgs`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChats(response.data);
            setFilteredChats(response.data); // Adjust this if needed
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    useEffect(() => {
        fetchChats(); // Fetch chats on initial render

        // Set up an interval to fetch chats every 30 seconds
        const intervalId = setInterval(fetchChats, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (activeChat) {
            const manager_id = activeChat.manager;
            const user_id = activeChat.user;
            const wsUrl = `${socket}ws/chat/${user_id}/${manager_id}`;

            socketRef.current = new W3CWebSocket(wsUrl);

            socketRef.current.onmessage = (messageEvent) => {
                const messageData = JSON.parse(messageEvent.data);
                setMessages((prevMessages) => [...prevMessages, messageData]);
            };

            socketRef.current.onclose = () => {
                console.log('WebSocket closed.');
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socketRef.current.onopen = () => {
                setMessages([]);
            };

            return () => {
                if (socketRef.current) {
                    socketRef.current.close();
                }
            };
        }
    }, [activeChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const encodeFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if ((message.trim() || selectedFile) && activeChat) {
            let fileData = null;
            if (selectedFile) {
                try {
                    fileData = await encodeFileToBase64(selectedFile);
                } catch (error) {
                    console.error('Error encoding file to base64:', error);
                }
            }

            const newMessage = {
                message: message,
                chatId: activeChat.id,
                sendername: activeChat.user_name,
                file_data: fileData,
                file_name: selectedFile?.name,
                status: 'sent' // Add status here
            };
            if (socketRef.current) {
                socketRef.current.send(JSON.stringify(newMessage));
            }
            setMessage('');
            setSelectedFile(null);
            fileInputRef.current.value = '';
        }
    };
    const isSameDay = (date1, date2) => {
        return moment(date1).isSame(date2, 'day');
    };

    const formatDate = (date) => {
        return moment(date).format('MMMM D, YYYY');
    };

    const formatTimestamp = (timestamp) => {
        return moment(timestamp).format('h:mm a'); // Example format: 4:30 pm
    };  

    const groupedMessages = () => {
        const grouped = [];
        let currentDate = null;

        messages.forEach((msg) => {
            const messageDate = moment(msg.timestamp).startOf('day');

            if (!currentDate || !isSameDay(currentDate, messageDate)) {
                currentDate = messageDate;
                grouped.push({ date: currentDate, messages: [msg] });
            } else {
                grouped[grouped.length - 1].messages.push(msg);
            }
        });

        return grouped;
    };

    const handleFileView = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <div className="w-full h-32 bg-teal-600"></div>
            <div className="container mx-auto -mt-32 flex flex-col h-full">
                <div className="flex flex-1 border border-gray-300 rounded shadow-lg overflow-hidden">
                    <div className="w-1/3 border-r flex flex-col bg-gray-100">
                        <div className="py-2 px-3 bg-gray-200 flex justify-between items-center">
                            <div className="flex items-center">
                                <img className="w-10 h-10 rounded-full" src="http://andressantibanez.com/res/avatar.png" alt="User Avatar" />
                            </div>
                            <div className="flex space-x-4">
                                <FiSearch className="w-6 h-6 text-gray-600" />
                                <FiMoreHorizontal className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                        <div className="py-2 px-2 bg-gray-100">
                            <input type="text" className="w-full px-2 py-2 text-sm border rounded" placeholder="Search or start new chat"
                             value={searchTerm}
                             onChange={handleSearchChange} />
                        </div>
                        <div className="flex-1 overflow-auto">
                            {filteredChats.map((chat) => (
                                <div key={chat.id} onClick={() => setActiveChat(chat)} className="px-3 py-4 flex items-center bg-gray-200 cursor-pointer">
                                    <img className="h-12 w-12 rounded-full" src={chat.manager_profile_pic} alt="Contact" />
                                    <div className="ml-4 flex-1 border-b border-gray-300 py-2">
                                        <div className="flex justify-between">
                                            <p className="text-gray-800">{chat.manager_name}</p>
                                            <p className="text-xs text-gray-500">
                                                {chat.lastMessageTimestamp ? formatTimestamp(chat.lastMessageTimestamp) : ''}
                                            </p>
                                        </div>
                                        <p className="text-gray-600 mt-1 text-sm">
                                        {chat.last_message?.message || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Chat Window */}
                    <div className="flex-1 flex flex-col bg-white">
                        <div className="py-2 px-3 bg-gray-200 flex justify-between items-center">
                            {activeChat ? (
                                <>
                                    <div className="flex items-center">
                                        <img className="w-10 h-10 rounded-full" src={activeChat.manager_profile_pic} alt="Active Chat Avatar" />
                                        <div className="ml-3">
                                            <p className="text-gray-800">{activeChat.manager_name}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-800">Select a chat</p>
                            )}
                        </div>

                        {/* Chat messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {groupedMessages().map((group, index) => (
                                <div key={index}>
                                    <div className="flex justify-center my-2">
                                        <span className="text-sm text-gray-500">{formatDate(group.date)}</span>
                                    </div>
                                    {group.messages.map((msg, index) => (
                                        <div key={index} className="mb-4">
                                            <div className={`flex ${msg.sendername === activeChat.user_name ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-sm rounded shadow px-4 py-2 ${msg.sendername === activeChat.user_name ? 'bg-teal-200' : 'bg-gray-200'}`}>
                                                    {msg.file_url && (
                                                        <div className="mb-2">
                                                            {msg.file_url.endsWith('.jpg') || msg.file_url.endsWith('.png') || msg.file_url.endsWith('.jpeg') ? (
                                                                <img className="max-h-64 w-auto rounded" src={msg.file_url} alt="Uploaded File" />
                                                            ) : msg.file_url.endsWith('.mp4') || msg.file_url.endsWith('.mkv') ? (
                                                                <video className="max-h-64 w-auto rounded" controls>
                                                                    <source src={msg.file_url} type="video/mp4" />
                                                                </video>
                                                            ) : msg.file_url.endsWith('.pdf') ? (
                                                                <div className="relative">
                                                                    <embed src={msg.file_url} type="application/pdf" width="100%" height="400px" />
                                                                    <a
                                                                        href={msg.file_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="absolute top-2 right-2 text-teal-600"
                                                                    >
                                                                        <FiEye className="w-6 h-6" />
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center space-x-2">
                                                                    <FiDownload className="w-5 h-5 text-gray-600" />
                                                                    <a href={msg.file_url} download className="text-teal-600">
                                                                        {msg.file_url.split('/').pop()}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p className="text-gray-800">{msg.message}</p>
                                                    <span className="text-xs text-gray-600 ml-2">{formatTimestamp(msg.timestamp)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        {activeChat && (
                            <form onSubmit={sendMessage} className="flex items-center border-t border-gray-300 p-3">
                                <FiPaperclip className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => fileInputRef.current.click()} />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                {selectedFile && (
                                    <div className="ml-3 flex items-center space-x-2">
                                        <span className="text-gray-800">{selectedFile.name}</span>
                                        <button onClick={() => setSelectedFile(null)} className="text-red-500">Remove</button>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    className="flex-1 mx-3 px-3 py-2 border rounded-lg"
                                    placeholder="Type a message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button type="submit" className="text-teal-600">
                                    <FiSend className="w-6 h-6" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;

