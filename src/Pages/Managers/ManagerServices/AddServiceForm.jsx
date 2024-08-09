import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AddServiceForm = ({ addService }) => {
    const managerDetails = useSelector(state => state.user_basic_details);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        image: null,
    });
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");

    const toggleModal = () => {
        setShowModal(!showModal);
        setError("");
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
            setFileName(files[0] ? files[0].name : "");
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { name, image } = formData;
        const manager_type = managerDetails.manager_type;
        
        if (!name.trim() || !image) {
            setError("All fields are required");
            return;
        }
    
        const data = new FormData();
        data.append('name', name.trim());
        data.append('image', image);
        data.append('manager_type', manager_type);
    
        // Log FormData
        for (let [key, value] of data.entries()) {
            console.log(key, value);
        }
    
        try {
            await addService(data);
            setShowModal(false);
            setFormData({
                name: "",
                image: null,
            });
            setFileName("");
        } catch (error) {
            setError("Error adding service, please try again");
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button className="flex items-center justify-center flex-1 h-full p-2 bg-blue-400 text-white shadow rounded-full" onClick={toggleModal}>
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                            <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">Add Service</h3>
                            <button
                                onClick={toggleModal}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
                            >
                                <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className="w-full h-full" alt="" />
                            </button>
                        </div>

                        {error && <div className="text-red-500 text-center mb-2">{error}</div>}

                        <form className="p-4 md:p-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Service Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Image</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <label
                                                htmlFor="image"
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
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </label>
                                            <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                            {fileName && <p className="text-xs text-green-600">Selected file: {fileName}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="mt-2 text-white w-full justify-center inline-flex items-center text-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg px-5 py-2.5 text-center btn btn-primary"
                                >
                                    Add Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddServiceForm;
