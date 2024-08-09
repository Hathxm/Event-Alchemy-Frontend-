import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const BASEUrl = process.env.REACT_APP_BASE_URL


const Form = ({ addVenue, managerType }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    venueName: "",
    location: "",
    price_per_hour: "",
    description: "",
    images: [],
    accomodation: "",
  });
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${BASEUrl}managers/locations/`);
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
    if (showModal) {
      // Clear form data when closing the modal
      setFormData({
        venueName: "",
        location: "",
        price_per_hour: "",
        description: "",
        images: [],
        accomodation: "",
      });
      setFileNames([]);
      setError("");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const selectedFiles = Array.from(files);
      setFormData((prevState) => ({
        ...prevState,
        [name]: selectedFiles,
      }));
      setFileNames(selectedFiles.map((file) => file.name));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { venueName, location, price_per_hour, description, images, accomodation } = formData;

    // Trim input values for validation
    const trimmedVenueName = venueName.trim();
    const trimmedDescription = description.trim();

    // Check if all fields are filled and exactly 4 images are uploaded
    if (
      !trimmedVenueName ||
      !location ||
      !price_per_hour ||
      !trimmedDescription ||
      images.length !== 4 ||
      !accomodation
    ) {
      setError("All fields are required, and exactly 4 images must be uploaded");
      return;
    }

    // Validate length of description and venue name
    if (trimmedDescription.length <= 20) {
      setError("Description must be longer than 20 characters");
      return;
    }

    if (trimmedVenueName.length < 4) {
      setError("Venue name must be at least 4 characters long");
      return;
    }

    const data = new FormData();
    data.append("manager_type", managerType);
    data.append("venue_name", trimmedVenueName);
    data.append("location", location);
    data.append("price_per_hour", price_per_hour);
    data.append("description", trimmedDescription);
    images.forEach((image, index) => {
      data.append(`image${index + 1}`, image);
    });
    data.append("accomodation", accomodation);

    console.log("FormData entries:");
    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await addVenue(data);
      setShowModal(false);
    } catch (error) {
      setError("Error adding venue, please try again");
      console.error("Error:", error);
    }
  };

  const truncateFileName = (name) => {
    return name.length > 15 ? `${name.slice(0, 7)}...${name.slice(-7)}` : name;
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
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">
                Add Venue
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
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
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
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">Upload Images</label>
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="block w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                  >
                    {fileNames.length ? fileNames.map((name, index) => (
                      <div key={index} className="truncate">{truncateFileName(name)}</div>
                    )) : "Choose Files"}
                  </button>
                  <input
                    ref={fileInputRef}
                    name="images"
                    type="file"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="mt-4 text-center">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring"
                >
                  Submit
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



