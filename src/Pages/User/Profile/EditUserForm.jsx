import React, { useState, useEffect } from 'react';

const EditUserForm = ({ userdata, handleInputChange, handleFileChange, handleSubmit }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        email: '',
        profile_pic: null,
    });

    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (userdata) {
            setFormData({
                username: userdata.username || '',
                first_name: userdata.first_name || '',
                email: userdata.email || '',
                profile_pic: userdata.profile_pic || null,
            });
        }
    }, [userdata]);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFormData({ ...formData, profile_pic: file });
            handleFileChange(e);
        }
    };

    return (
        <div>
            <div className="w-auto h-auto">
                <div className="flex-1 h-full">
                    <button
                        className="flex items-center justify-center flex-1 h-full p-2 bg-green-500 text-white shadow rounded-lg"
                        onClick={toggleModal}
                    >
                        <div className="relative">
                            <img src="https://cdn-icons-png.flaticon.com/256/2985/2985043.png" className="h-5 w-5" alt="Edit" />
                        </div>
                    </button>
                </div>
            </div>

            {showModal && (
                <div
                    id="crud-modal"
                    aria-hidden="true"
                    className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
                >
                    <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                            <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">Edit Details</h3>
                            <div
                                onClick={toggleModal}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                            >
                                <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className="w-full h-full" alt="Close" />
                            </div>
                        </div>

                        <form className="p-4 md:p-6" onSubmit={(e) => handleSubmit(e, formData, toggleModal)}>
                            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-gray-700">Username</label>
                                    <input
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={(e) => {
                                            setFormData({ ...formData, username: e.target.value });
                                            handleInputChange(e);
                                        }}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700">First Name</label>
                                    <input
                                        name="first_name"
                                        type="text"
                                        placeholder="First Name"
                                        value={formData.first_name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, first_name: e.target.value });
                                            handleInputChange(e);
                                        }}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-700">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            handleInputChange(e);
                                        }}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <label
                                                htmlFor="profile_pic"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span className="text-sm text-gray-600">Upload a file or drag and drop</span>
                                                <input
                                                    id="profile_pic"
                                                    name="profile_pic"
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={handleFileSelect}
                                                />
                                            </label>
                                            <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                            {fileName && <p className="text-xs text-green-600">Selected file: {fileName}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end p-4 md:p-6 border-t border-gray-200 rounded-b">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditUserForm;

