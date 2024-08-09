import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

// Base URL for API requests
const baseURL = "http://127.0.0.1:8000";

// StarIcon component
function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ArrowIcon component
function ArrowIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75L21 10.5m0 0l-3.75 3.75M21 10.5H3"
      />
    </svg>
  );
}

// ServiceCard component
const ServiceCard = ({ service, isChecked, onCheckboxChange, image }) => {
  const defaultImage = "https://via.placeholder.com/150"; // Fallback image
  const imageUrl = image ? `${image}` : defaultImage; // Form the full image URL

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 w-full max-w-sm">
      <img
        src={imageUrl}
        alt="Service"
        onError={(e) => (e.target.src = defaultImage)} // Fallback if image fails to load
        className="w-full h-64 object-cover"
        style={{ aspectRatio: "600/400", objectFit: "cover" }}
      />
      <div className="p-4 space-y-2">
        <h5 className="text-lg font-bold">{service.service_name}</h5>
        <div
          className="text-gray-500 text-sm overflow-y-auto"
          style={{ maxHeight: "3rem" }} // Fixed height for description with scrollbar
        >
          {service.description}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-primary">
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-primary" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
            <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
          </div>
          <span className="text-sm text-gray-500">(4.3)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${service.price}/Hour</span>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out mr-2"
              checked={isChecked}
              onChange={() => onCheckboxChange(service.id)}
            />
     
          </div>
        </div>
      </div>
    </div>
  );
};

// VenueServices component
const VenueServices = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenueServices = async () => {
      try {
        const response = await axios.get(baseURL + "/venue_services", {
          params: { id },
        });
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVenueServices();
  }, [id]);

  useEffect(() => {
    const servicesParam = searchParams.get("services");
    if (servicesParam) {
      setSelectedServices(servicesParam.split(","));
    }
  }, [searchParams]);

  const handleCheckboxChange = (serviceId) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.includes(serviceId)
        ? prevSelectedServices.filter((id) => id !== serviceId)
        : [...prevSelectedServices, serviceId]
    );
  };

  const handleCheckout = () => {
    navigate(`/checkout/${id}?services=${selectedServices.join(",")}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Services Available</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            image={service.service_image}
            isChecked={selectedServices.includes(service.id)}
            onCheckboxChange={handleCheckboxChange}
          />
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
          onClick={handleCheckout}
        >
          Proceed to Checkout
          <ArrowIcon className="ml-5" />
        </button>
      </div>
    </div>
  );
};

export default VenueServices;

