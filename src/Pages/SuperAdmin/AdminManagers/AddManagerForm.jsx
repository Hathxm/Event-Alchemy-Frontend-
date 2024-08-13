import React, { useState, useEffect } from 'react';
import axios from 'axios';
const BASEUrl = process.env.REACT_APP_BASE_URL;

const AddManagerForm = ({ addManager }) => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    eventType: '',
  });
  const [error, setError] = useState('');

  const toggleModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      // Clear form data when closing the modal
      setFormData({
        username: '',
        name: '',
        email: '',
        eventType: '',
      });
      setError('');
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASEUrl}superadmin/eventmanagement`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, name, email, eventType } = formData;

    // Basic validation
    if (!username || !name || !email || !eventType) {
      setError('All fields are required.');
      return;
    }

    const formPayload = new FormData();
    for (const key in formData) {
      formPayload.append(key, formData[key]);
    }

    addManager(formPayload); // Add the new manager to the list
    setShowModal(false); // Close the modal
    setFormData({
      username: '',
      name: '',
      email: '',
      eventType: '',
    });
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="flex items-center justify-center h-full p-2 bg-blue-400 text-white shadow rounded-full"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">
                Add Manager
              </h3>
              <button
                onClick={toggleModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png"
                  className="w-full h-full"
                  alt="Close"
                />
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-center mb-2">{error}</div>
            )}

            <form className="p-4 md:p-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Event</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                    required
                  >
                    <option disabled value="">
                      Select category
                    </option>
                    {events.map((event) => (
                      <option key={event.id} value={event.name}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <button
                    type="submit"
                    className="mt-2 w-full text-lg text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 font-medium rounded-lg px-5 py-2.5"
                  >
                    Add Manager
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddManagerForm;
