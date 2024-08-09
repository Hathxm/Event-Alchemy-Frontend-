import React, { useState, useEffect } from 'react';
import axios from 'axios';
const BASEUrl = process.env.REACT_APP_BASE_URL


const EditVenuesForm = ({ venueData, editVenue, onClose, managerType }) => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    venueName: venueData.venue_name || "",
    location: venueData.location_id || "", // Adjusted to use location_id
    price_per_hour: venueData.price_per_hour || "",
    description: venueData.description || "",
    image1: null, // Default to null, since we don't have an existing image
    accomodation: venueData.accomodation || ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch locations for the select dropdown
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${BASEUrl}managers/locations/`, {
          params: { manager_type: managerType }
        });
        if (response.status === 200) {
          setLocations(response.data);
        } else {
          console.error('Failed to fetch locations:', response.data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [managerType]);

  useEffect(() => {
    if (venueData) {
      setFormData({
        venueName: venueData.venue_name || "",
        location: venueData.location_id || "", // Adjusted to use location_id
        price_per_hour: venueData.price_per_hour || "",
        description: venueData.description || "",
        image1: null,
        accomodation: venueData.accomodation || ""
      });
    }
  }, [venueData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('venue_id', venueData.id);
    data.append('venue_name', formData.venueName);
    data.append('location', formData.location);
    data.append('price_per_hour', formData.price_per_hour);
    data.append('description', formData.description);
    if (formData.image1) {
      data.append('image1', formData.image1);
    }
    data.append('accomodation', formData.accomodation);
    data.append('manager_type', managerType); // Include manager type in the form data

    await editVenue(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">Edit Venue</h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
          >
            <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className="w-full h-full" alt="" />
          </button>
        </div>

        <form className="p-4 md:p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venueName">Venue Name</label>
              <input
                name="venueName"
                type="text"
                placeholder="Venue Name"
                value={formData.venueName}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="location">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
                required
              >
                <option value="">Select Location</option>
                {loading ? (
                  <option value="">Loading...</option>
                ) : (
                  locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label htmlFor="price_per_hour">Price/hour</label>
              <input
                name="price_per_hour"
                type="number"
                placeholder="Price"
                value={formData.price_per_hour}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="accomodation">Accomodation</label>
              <input
                name="accomodation"
                type="number"
                placeholder="Accomodation Capacity"
                value={formData.accomodation}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="image1">Image</label>
              <input
                name="image1"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="mt-2 text-white w-full justify-center inline-flex items-center text-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg px-5 py-2.5 text-center btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenuesForm;
