import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddManagerForm = ({ addManager }) => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    eventType: '',
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const response = axios.get('superadmin/eventmanagement')
      .then(response => {
        setEvents(response.data); // Assuming response.data is an array of events
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
       
      });}
    

  return (
    <div>
      <button
        onClick={toggleModal}
        className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-blue-900"
        type="button"
      >
        <span className="text-lg font-bold">+</span> Add Manager
      </button>

      {showModal && (
        <div
          id="crud-modal"
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
        >
          <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">Add Manager</h3>
              <div
                onClick={toggleModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className="w-full h-full" alt="Close" />
              </div>
            </div>

            <form className="p-4 md:p-6" onSubmit={handleSubmit}>
              <div className="grid gap-2 mb-2 grid-cols-2">
                <div>
                  <label>Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="input-primary w-full bg-gray-200"
                  />
                </div>

                <div>
                  <label>Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-primary w-full bg-gray-200"
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-primary w-full bg-gray-200"
                    required
                  />
                </div>

                <div>
                  <label>Select Event</label>
                  <select
                    name="eventType"
                    className="select select-primary w-full bg-gray-200"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                  >
                    <option disabled value="">Select category</option>
                    {events.map(event => (
                      <option key={event.id} value={event.name}>{event.name}</option>
                    ))}
                  </select>
                </div>

               

              

                <div className="col-span-2">
                  <button
                    type="submit"
                    className="mt-2 text-white w-full text-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg px-5 py-2.5 btn btn-primary dark:hover:ring-blue-500 dark:focus:ring-blue-500"
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
