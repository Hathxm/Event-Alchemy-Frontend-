  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { toast } from 'react-toastify';
  const BASEUrl = process.env.REACT_APP_BASE_URL


  const AddVendorService = ({ addvendorservice }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
      description: '',
      price: '',
      location: '',
      serviceType: '',
    });
    const [locations, setLocations] = useState([]);
    const [services, setServices] = useState([]);

    const toggleModal = () => {
      setShowModal(!showModal);
    };

    useEffect(() => {
      axios.get(`${BASEUrl}vendor/services`)
        .then(response => {
          setLocations(response.data.locations);
          setServices(response.data.services);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
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
      addvendorservice(formPayload)
        .then(() => {
          toast.success('Service added successfully!');
        })
        .catch((error) => {
          toast.error(`Error adding service: ${error.response ? error.response.data.error : error.message}`);
        });
      setShowModal(false);
      setFormData({
        description: '',
        price: '',
        location: '',
        serviceType: '',
      });
    };

    return (
      <div>
              
              <button
          className="flex items-center justify-center flex-1 h-full p-2 bg-blue-400 text-white shadow rounded-full"
          onClick={toggleModal}
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
          <div
            id="crud-modal"
            aria-hidden="true"
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
          >
            <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">Add Service</h3>
                <div
                  onClick={toggleModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                >
                  <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className="w-full h-full" alt="Close" />
                </div>
              </div>

              <form className="p-4 md:p-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                  <div>
                    <label className="text-gray-700">Select Location</label>
                    <select
                      name="location"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    >
                      <option disabled value="">Select location</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-700">Select Service Type</label>
                    <select
                      name="serviceType"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                    >
                      <option disabled value="">Select service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>{service.service_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-700">Price/Hour</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700">Description</label>
                    <input
                      name="description"
                      type="text"
                      placeholder="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                    />
                  </div>

                  <div className="col-span-2">
                    <button
                      type="submit"
                      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 mt-2"
                    >
                      Add Service
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

  export default AddVendorService;

