import React, { useState, useEffect, useRef } from 'react';
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
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

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

  // The venues API returns the location name (not its id), so once the
  // locations list has loaded, resolve the matching option and pre-select it.
  useEffect(() => {
    if (!venueData || locations.length === 0) return;
    const match = locations.find(
      (loc) =>
        String(loc.id) === String(venueData.location_id ?? venueData.location ?? '') ||
        loc.name === venueData.location_name
    );
    if (match) {
      setFormData((prev) => ({ ...prev, location: String(match.id) }));
    }
  }, [locations, venueData]);

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

    try {
      await editVenue(data);
      onClose();
    } catch (error) {
      setError("Error updating venue, please try again");
      console.error("Error:", error);
    }
  };

  const truncateFileName = (name) => {
    return name.length > 15 ? `${name.slice(0, 7)}...${name.slice(-7)}` : name;
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
            <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className="w-full h-full" alt="Close" />
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-2">{error}</div>
        )}

        <form className="p-4 md:p-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">Venue Name</label>
              <input
                name="venueName"
                type="text"
                placeholder="Venue Name"
                value={formData.venueName}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              >
                <option value="">Select Location</option>
                {loading ? (
                  <option value="">Loading...</option>
                ) : (
                  locations.map(loc => (
                    <option key={loc.id} value={String(loc.id)}>{loc.name}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label htmlFor="price_per_hour" className="block text-sm font-medium text-gray-700">Price/hour</label>
              <input
                name="price_per_hour"
                type="number"
                placeholder="Price"
                value={formData.price_per_hour}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              />
            </div>
            <div>
              <label htmlFor="accomodation" className="block text-sm font-medium text-gray-700">Accommodation</label>
              <input
                name="accomodation"
                type="number"
                placeholder="Accommodation Capacity"
                value={formData.accomodation}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="image1" className="block text-sm font-medium text-gray-700">Upload Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <label
                    htmlFor="image1"
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
                      ref={fileInputRef}
                      id="image1"
                      name="image1"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleChange}
                    />
                  </label>
                  <p className="text-xs text-gray-600">Leave empty to keep the current image (PNG, JPG, GIF up to 10MB)</p>
                  {fileName && <p className="text-xs text-green-600">Selected file: {truncateFileName(fileName)}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring"
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
