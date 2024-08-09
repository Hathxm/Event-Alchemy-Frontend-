import React, { useState, useEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { FiSend, FiPaperclip, FiDownload, FiEye } from 'react-icons/fi';
import moment from 'moment';
const BASEUrl = process.env.REACT_APP_BASE_URL

const ChatMessages = ({ activeChat }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (activeChat) {
            const user_id = activeChat.user;
            const manager_id = activeChat.manager;
            const wsUrl = `${BASEUrl}ws/chat/${user_id}/${manager_id}`;

            socketRef.current = new W3CWebSocket(wsUrl);

            socketRef.current.onmessage = (messageEvent) => {
                const messageData = JSON.parse(messageEvent.data);
                if (messageData.status) {
                    // Update message status
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.message === messageData.message
                                ? { ...msg, status: messageData.status }
                                : msg
                        )
                    );
                } else {
                    // Add new message
                    setMessages((prevMessages) => [...prevMessages, messageData]);
                }
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

    const sendMessage = (e) => {
        e.preventDefault();
        if ((message.trim() || selectedFile) && activeChat) {
            const newMessage = {
                message: message,
                chatId: activeChat.id,
                sendername: activeChat.manager_name,
                file: selectedFile,
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

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="py-2 px-3 bg-gray-200 flex justify-between items-center">
                {activeChat ? (
                    <>
                        <div className="flex items-center">
                            <img
                                className="w-10 h-10 rounded-full"
                                src={activeChat.user_profile_pic}
                                alt="Active Chat Avatar"
                            />
                            <div className="ml-3">
                                <p className="text-gray-800">{activeChat.user_name}</p>
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
                            <span className="text-sm text-gray-500">
                                {formatDate(group.date)}
                            </span>
                        </div>
                        {group.messages.map((msg, index) => (
                            <div key={index} className="mb-4">
                                <div
                                    className={`flex ${
                                        msg.sendername === activeChat.manager_name
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-sm rounded shadow px-4 py-2 ${
                                            msg.sendername === activeChat.manager_name
                                                ? 'bg-teal-200'
                                                : 'bg-gray-200'
                                        }`}
                                    >
                                        {msg.file_url && (
                                            <div className="mb-2">
                                                {msg.file_url.endsWith('.jpg') ||
                                                msg.file_url.endsWith('.png') ||
                                                msg.file_url.endsWith('.jpeg') ? (
                                                    <img
                                                        className="max-h-64 w-auto rounded"
                                                        src={msg.file_url}
                                                        alt="Uploaded File"
                                                    />
                                                ) : msg.file_url.endsWith('.mp4') ||
                                                  msg.file_url.endsWith('.mkv') ? (
                                                    <video
                                                        className="max-h-64 w-auto rounded"
                                                        controls
                                                    >
                                                        <source
                                                            src={msg.file_url}
                                                            type="video/mp4"
                                                        />
                                                    </video>
                                                ) : msg.file_url.endsWith('.pdf') ? (
                                                    <div className="relative">
                                                        <embed
                                                            src={msg.file_url}
                                                            type="application/pdf"
                                                            width="100%"
                                                            height="400px"
                                                        />
                                                        <a
                                                            href={msg.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute top-2 right-2 text-teal-600"
                                                        >
                                                            <FiEye className="w-5 h-5" />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <FiPaperclip className="w-5 h-5" />
                                                        <a
                                                            href={msg.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600"
                                                        >
                                                            {msg.file_name || 'View File'}
                                                        </a>
                                                        <a
                                                            href={msg.file_url}
                                                            download
                                                            className="text-teal-600"
                                                        >
                                                            <FiDownload className="w-5 h-5" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-gray-800">{msg.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatTimestamp(msg.timestamp)}
                                            {msg.status === 'seen' && (
                                                <span className="text-teal-600 ml-2">Seen</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={sendMessage} className="py-2 px-3 bg-gray-200 flex">
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="mr-2"
                >
                    <FiPaperclip className="w-6 h-6 text-gray-600" />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 rounded px-2 py-1 text-gray-800 border"
                    placeholder="Type a message"
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button type="submit" className="ml-2">
                    <FiSend className="w-6 h-6 text-teal-600" />
                </button>
            </form>
        </div>
    );
};

export default ChatMessages;
