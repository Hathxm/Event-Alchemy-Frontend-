import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import PageHeading from '../../../Components/Common/PageHeading/PageHeading';
import SummaryPanel from '../../../Components/Common/SummaryPanel/SummaryPanel';
const BASEUrl = process.env.REACT_APP_BASE_URL

// Uniform money formatter (matches the `$` display used on the services page).
const money = (n) => `$${Math.round(Number(n) || 0).toLocaleString()}`;

const formatTime = (time) => {
  if (!time) return '';
  let [hours, minutes] = time.split(':');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};


export default function Checkout() {
  const token = localStorage.getItem('access');
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const eventId = searchParams.get('event'); // event id preserved for "Add More Services"
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [venue, setVenue] = useState({});
  const [bookingDetails, setBookingDetails] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountToPay, setAmountToPay] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const servicesParam = searchParams.get('services');
    const serviceIds = servicesParam ? servicesParam.split(',') : [];
    setSelectedServices(serviceIds);
  }, [searchParams]);

  useEffect(() => {
    const fetchSelectedServicesDetails = async () => {
      try {
        const response = await axios.get(`${BASEUrl}selected_services`, {
          params: { id: id, ids: selectedServices.join(',') },
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Selected Services Response:', response.data);
        setServices(response.data.services);
        setVenue(response.data.venue);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Could not fetch services. Please try again later.');
      }
    };

    fetchSelectedServicesDetails();
  }, [selectedServices, id, token]);

  useEffect(() => {
    const storedBookingDetails = localStorage.getItem('bookingDetails');
    if (storedBookingDetails) {
      setBookingDetails(JSON.parse(storedBookingDetails));
    } else {
      navigate('/')
    }
  }, []);

  useEffect(() => {
    if (bookingDetails) {
      calculateAmountToPay();
    }
  }, [bookingDetails, services]);

  const calculateAmountToPay = () => {
    if (bookingDetails.shift && venue.price_per_hour) {
      const shiftStartTime = bookingDetails.shift.start_time;
      const shiftEndTime = bookingDetails.shift.end_time;

      const shiftStart = new Date(`2000-01-01T${shiftStartTime}`);
      const shiftEnd = new Date(`2000-01-01T${shiftEndTime}`);
      const shiftDurationInHours = (shiftEnd - shiftStart) / (1000 * 60 * 60);

      const totalVenueCost = venue.price_per_hour * shiftDurationInHours;

      const servicesCosts = services.map((service) => {
        const serviceCost = service.price * shiftDurationInHours;
        return {
          ...service,
          serviceCost: serviceCost || 0, // Ensure serviceCost is a number
        };
      });

      const totalServicesCost = servicesCosts.reduce((total, service) => total + (service.serviceCost || 0), 0);
      const totalAmount = totalVenueCost + totalServicesCost;
      const amountToPay = totalAmount * 0.25;

      setTotalAmount(totalAmount);
      setAmountToPay(amountToPay);
    }
  };


  const handleAddMoreServices = () => {
    const eventParam = eventId ? `&event=${eventId}` : '';
    navigate(`/venue_services/${id}?services=${selectedServices.join(',')}${eventParam}`);
  };

  const handleDeleteService = (serviceId) => {
    const updatedServices = selectedServices.filter((id) => id !== serviceId.toString());
    setSelectedServices(updatedServices);
    setSearchParams({
      services: updatedServices.join(','),
      ...(eventId ? { event: eventId } : {}),
    });
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadRazorpay = async () => {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
      }
    };

    loadRazorpay();
  }, []);

  const handlePaymentSuccess = async (response) => {
    try {
        const paymentData = {
            payment: 'Razorpay',
            venueId: id,
            services: selectedServices,
            bookingDetails,
            totalAmount,
            amountToPay,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
        };

        await axios.post(`${BASEUrl}create_order`, paymentData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        toast.success('Payment successful! Booking has been created.', {
          position: "bottom-right",
          autoClose: 5000,
        });
        localStorage.removeItem('bookingDetails')

        navigate('/bookings');
    } catch (error) {
        console.error('Error saving payment details:', error);
        toast.error('Failed to save payment details. Please try again.', {
          position: "bottom-right",
          autoClose: 5000,
        });
    }
  };

  const handleFinalizeBooking = async () => {
    try {
      const options = {
        key: 'rzp_test_USjwD14i3epQF2',
        amount: amountToPay * 100,
        currency: 'INR',
        name: 'Event Management',
        description: 'Advance Payment',
        handler: function (response) {
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function () {
            alert('Payment dismissed');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error finalizing booking:', err);
      setError('Could not finalize booking. Please try again later.');
    }
  };

  const shiftDuration = bookingDetails.shift
    ? (new Date(`2000-01-01T${bookingDetails.shift.end_time}`) -
        new Date(`2000-01-01T${bookingDetails.shift.start_time}`)) /
      (1000 * 60 * 60)
    : 0;
  const venueCost = (Number(venue.price_per_hour) || 0) * shiftDuration;
  const venueImg = venue.image1
    ? `${BASEUrl}${venue.image1.replace(/^\//, '')}`
    : 'https://via.placeholder.com/800x400?text=Venue';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4">
        <PageHeading
          title="Order Summary"
          subtitle="Review your selections before proceeding to payment"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          {/* Left column */}
          <div className="space-y-4">
            {/* Venue card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <img
                src={venueImg}
                alt={venue.venue_name || 'Venue'}
                className="w-full h-56 object-cover bg-gray-100"
              />
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900">
                  {venue.venue_name || 'Venue'}
                </h2>
                {venue.location_name && (
                  <p className="text-sm text-gray-500 mt-0.5">{venue.location_name}</p>
                )}
                {venue.description && (
                  <p className="text-sm text-gray-600 mt-3">{venue.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {venue.accomodation != null && (
                    <div>
                      <div className="text-xs text-gray-500">Capacity</div>
                      <div className="text-sm font-medium text-gray-900">
                        {venue.accomodation} guests
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="text-sm font-bold text-gray-800">
                      {money(venue.price_per_hour)}/hour
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Booking Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="text-sm text-gray-900">{bookingDetails.date || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="text-sm text-gray-900">
                    {bookingDetails.shift
                      ? `${formatTime(bookingDetails.shift.start_time)} - ${formatTime(
                          bookingDetails.shift.end_time
                        )}`
                      : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Shift</div>
                  <div className="text-sm text-gray-900">
                    {bookingDetails.shift?.name || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="text-sm font-semibold text-amber-600">Awaiting Payment</div>
                </div>
              </div>
            </div>

            {/* Selected Services */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Selected Services</h2>
                <button
                  onClick={handleAddMoreServices}
                  className="flex items-center gap-1 text-xs font-medium text-gray-800 hover:text-gray-600"
                >
                  <Plus className="h-3.5 w-3.5" /> Add More
                </button>
              </div>

              {services.length > 0 ? (
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-start gap-3 border border-gray-200 rounded-lg p-3"
                    >
                      <img
                        src={
                          service.service_image
                            ? `${BASEUrl}${service.service_image.replace(/^\//, '')}`
                            : 'https://via.placeholder.com/150?text=Service'
                        }
                        alt={service.service_name}
                        className="w-16 h-16 rounded-md object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {service.service_name}
                          </h3>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-gray-400 hover:text-red-500 flex-shrink-0"
                            aria-label={`Remove ${service.service_name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="text-sm font-bold text-gray-800 mt-1">
                          {money(Number(service.price) * shiftDuration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No services selected.</p>
              )}
            </div>
          </div>

          {/* Right: Price Summary */}
          <SummaryPanel>
              <h2 className="text-base font-bold text-gray-900 mb-4">Price Summary</h2>

              <div className="space-y-2.5">
                <div className="flex justify-between text-sm gap-2">
                  <span className="text-gray-600">Venue Rental</span>
                  <span className="font-medium text-gray-900 flex-shrink-0">
                    {money(venueCost)}
                  </span>
                </div>
                {services.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm gap-2">
                    <span className="text-gray-600 truncate">{service.service_name}</span>
                    <span className="font-medium text-gray-900 flex-shrink-0">
                      {money(Number(service.price) * shiftDuration)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 my-4" />

              <div className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3">
                <span className="text-sm font-bold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-gray-800">{money(totalAmount)}</span>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-gray-500">25% advance due now</span>
                <span className="font-semibold text-gray-700">{money(amountToPay)}</span>
              </div>

              <button
                onClick={handleFinalizeBooking}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold py-2.5 rounded-md mt-4 transition"
              >
                Proceed to Payment
              </button>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-[11px] text-gray-400 text-center mt-3">
                Secure payment powered by industry-leading encryption
              </p>
          </SummaryPanel>
        </div>
      </div>
    </div>
  );
}
