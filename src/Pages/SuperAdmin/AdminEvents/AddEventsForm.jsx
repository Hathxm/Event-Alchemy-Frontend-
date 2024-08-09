import React, { useState } from 'react';

const Form = ({ addEvent }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        eventName: "",
        eventDescription: "",
        eventImage: null,
    });

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'eventImage') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0]
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);

        const newEvent = {
            name: formData.eventName,
            description: formData.eventDescription,
            image: formData.eventImage
        };

        addEvent(newEvent);

        setShowModal(false);
        setFormData({
            eventName: "",
            eventDescription: "",
            eventImage: null
        });
    };

    return (
        <div>
            <button
                onClick={toggleModal}
                className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-blue-900"
                type="button"
            >
                <span className="text-lg font-bold">+</span> Add Event
            </button>

            {showModal && (
                <div
                    id="crud-modal"
                    aria-hidden="true"
                    className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
                >
                    <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                            <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">Add Event</h3>
                            <div
                                onClick={toggleModal}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            >
                                <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className='w-full h-full' alt="" />
                            </div>
                        </div>

                        <form className="p-4 md:p-6" onSubmit={handleSubmit}>
                            <div className="grid gap-2">
                                <div>
                                    <label>Event Name</label>
                                    <input
                                        name="eventName"
                                        type="text"
                                        placeholder="Name"
                                        value={formData.eventName}
                                        onChange={handleChange}
                                        className="input input-bordered input-primary w-full"
                                    />
                                </div>
                                <div>
                                    <label>Event Description</label>
                                    <textarea
                                        name="eventDescription"
                                        placeholder="Description"
                                        value={formData.eventDescription}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered textarea-primary w-full"
                                    />
                                </div>
                                <div>
                                    <label>Event Image</label>
                                    <input
                                        name="eventImage"
                                        type="file"
                                        onChange={handleChange}
                                        className="file-input file-input-bordered file-input-primary w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="mt-2 text-white w-full justify-center inline-flex items-center text-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg px-5 py-2.5 text-center btn btn-primary dark:hover:ring-blue-500 dark:focus:ring-blue-500"
                                >
                                    Add Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Form;