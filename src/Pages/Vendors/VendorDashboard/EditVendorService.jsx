import React, { useState, useEffect } from "react";
import axios from "../../../axiosinstance/axiosinstance";
const BASEUrl = process.env.REACT_APP_BASE_URL;

export default function EditVendorService({ serviceData, onClose, updateVendorService }) {
  const [formData, setFormData] = useState({
    service_name: serviceData?.service_name || "",
    description: serviceData?.description || "",
    price: serviceData?.price || "",
    location: serviceData?.location || "",
    serviceType: serviceData?.serviceType || "",
  
  });

  const [locations, setLocations] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASEUrl}vendor/services`);
        setLocations(response.data.locations);
        setServiceTypes(response.data.services);
      } catch (error) {
        console.error('Error fetching locations or service types:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (serviceData) {
      setFormData({
        service_name: serviceData.service_name || "",
        description: serviceData.description || "",
        price: serviceData.price || "",
        location: serviceData.location || "",
        serviceType: serviceData.serviceType || "",
      });

    }
  }, [serviceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!serviceData) {
      console.error('No service data available');
      return;
    }
  
    const data = new FormData();
    data.append('service_id', serviceData.id);
    data.append('service_name', formData.service_name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('serviceType', formData.serviceType);

    try {
      await updateVendorService(data);
      onClose();  // Close the modal after form submission
      alert('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service. Please try again.');
    }
  };
  

  if (!serviceData) {
    return null;  // Or a loading indicator
  }

  return (
    <div
      id="crud-modal"
      aria-hidden="true"
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
    >
      <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">Edit Service</h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
            aria-label="Close"
          >
            <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className="w-full h-full" alt="Close" />
          </button>
        </div>

        <form className="p-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700">Service Name</label>
              <input
                name="service_name"
                type="text"
                placeholder="Service Name"
                value={formData.service_name}
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
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="text-gray-700">Price</label>
              <input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
              />
            </div>

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
                {serviceTypes.map(service => (
                  <option key={service.id} value={service.id}>{service.service_name}</option>
                ))}
              </select>
            </div>

         

            <div className="col-span-2">
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 mt-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
