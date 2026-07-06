import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Check, X, Star } from "lucide-react";
import PageHeading from "../../../Components/Common/PageHeading/PageHeading";
import SummaryPanel from "../../../Components/Common/SummaryPanel/SummaryPanel";
const BASEUrl = process.env.REACT_APP_BASE_URL

// ServiceCard component — a compact selectable card with a corner checkmark,
// image, optional rating and price.
const ServiceCard = ({ service, isChecked, onToggle, image }) => {
  const defaultImage = "https://via.placeholder.com/400x250?text=Service";
  const imageUrl = image || defaultImage;

  return (
    <div
      onClick={() => onToggle(service.id)}
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col cursor-pointer border-2 ${
        isChecked ? "border-gray-800" : "border-gray-200"
      }`}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={service.service_name}
          onError={(e) => (e.target.src = defaultImage)}
          className="w-full h-32 object-cover bg-gray-100"
        />
        <div
          className={`absolute top-2 right-2 h-6 w-6 rounded-full flex items-center justify-center border-2 transition ${
            isChecked
              ? "bg-gray-800 border-gray-800 text-white"
              : "bg-white/80 border-gray-300 text-transparent"
          }`}
        >
          <Check className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-gray-900 mb-0.5 truncate">
          {service.service_name}
        </h3>
        <p className="text-gray-500 text-xs mb-1.5 line-clamp-2">
          {service.description}
        </p>

        {service.avg_rating != null && (
          <div className="flex items-center gap-1 mb-1.5 text-xs">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i <= Math.round(service.avg_rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-gray-800">
              {Number(service.avg_rating).toFixed(1)}
            </span>
            {service.rating_count != null && (
              <span className="text-gray-400 text-[10px]">({service.rating_count})</span>
            )}
          </div>
        )}

        <div className="text-sm font-bold text-gray-900 mt-auto">
          ${Number(service.price).toLocaleString()}
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
  const { id } = useParams(); // venue id — kept for the checkout route
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Services are looked up by the event id (threaded from the Venues page), so
  // every location within the same event returns the same service list.
  const eventId = searchParams.get("event");

  useEffect(() => {
    const fetchVenueServices = async () => {
      try {
        const response = await axios.get(`${BASEUrl}venue_services`, {
          params: { id: eventId || id },
        });
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVenueServices();
  }, [id, eventId]);

  useEffect(() => {
    const servicesParam = searchParams.get("services");
    if (servicesParam) {
      setSelectedServices(servicesParam.split(","));
    }
  }, [searchParams]);

  // Selection is tracked as string ids so clicks and URL params stay comparable.
  const handleToggle = (serviceId) => {
    const sid = String(serviceId);
    setSelectedServices((prev) =>
      prev.map(String).includes(sid)
        ? prev.filter((x) => String(x) !== sid)
        : [...prev, sid]
    );
  };

  const handleCheckout = () => {
    const eventParam = eventId ? `&event=${eventId}` : "";
    navigate(`/checkout/${id}?services=${selectedServices.join(",")}${eventParam}`);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-gray-500">Error: {error}</div>;
  }

  const isSelected = (serviceId) =>
    selectedServices.map(String).includes(String(serviceId));

  const selectedServiceObjects = services.filter((s) => isSelected(s.id));
  const estimatedTotal = selectedServiceObjects.reduce(
    (sum, s) => sum + (Number(s.price) || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4">
      <PageHeading
        title="Choose Your Services"
        subtitle="Select the services you'd like to add to your booking"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
        {/* Services grid — 3 columns by default, collapses to 2 on narrower screens */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              image={
                service.service_image
                  ? `${BASEUrl}${service.service_image.replace(/^\//, "")}`
                  : ""
              }
              isChecked={isSelected(service.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* Selected services summary */}
        <SummaryPanel>
          <h2 className="text-base font-bold text-gray-900 mb-3">Selected Services</h2>

            {selectedServiceObjects.length === 0 ? (
              <p className="text-xs text-gray-500 mb-3">No services selected yet.</p>
            ) : (
              <div className="space-y-1.5 mb-3">
                {selectedServiceObjects.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between border border-gray-200 rounded-md px-2.5 py-1.5"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {s.service_name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        ${Number(s.price).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(s.id)}
                      className="text-gray-400 hover:text-gray-700 flex-shrink-0 ml-2"
                      aria-label={`Remove ${s.service_name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 pt-3 mb-3">
              <span className="text-xs text-gray-600">Estimated Total:</span>
              <span className="text-base font-bold text-gray-900">
                ${estimatedTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={selectedServices.length === 0}
              className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-md transition"
            >
              Proceed to Checkout
            </button>
        </SummaryPanel>
      </div>
    </div>
  );
};

export default VenueServices;
