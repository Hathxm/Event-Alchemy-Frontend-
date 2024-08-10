import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountain, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { toast } from 'react-toastify';
const BASEUrl = process.env.REACT_APP_BASE_URL



export default function Checkout() {
  const token = localStorage.getItem('access');
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [venue, setVenue] = useState({});
  const [bookingDetails, setBookingDetails] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [serviceAmount, setServiceAmount] = useState(0);
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
    }else{
      navigate('/')
    }
  }, []);

  useEffect(() => {
    if (bookingDetails && services.length > 0) {
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
      setServiceAmount(totalServicesCost);
    }
  };

   
  const handleAddMoreServices = () => {
    navigate(`/venue_services/${id}?services=${selectedServices.join(',')}`);
  };

  const handleDeleteService = (serviceId) => {
    const updatedServices = selectedServices.filter((id) => id !== serviceId.toString());
    setSelectedServices(updatedServices);
    setSearchParams({ services: updatedServices.join(',') });
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
        key: 'rzp_test_2Ppy65nLGqi9SS',
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

  const formatTime = (time) => {
    let [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <a href="#" prefetch="false">
            <FontAwesomeIcon icon={faMountain} className="w-8 h-8" />
          </a>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 p-6 md:p-10">
        <section>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <h2 className="text-2xl font-bold">Venue Details</h2>
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={venue.image1 || '/placeholder.svg'}
                    width={200}
                    height={150}
                    alt="Venue Image"
                    className="rounded-lg object-cover"
                  />
                  <div className="grid gap-2">
                    <h3 className="text-xl font-semibold">
                      {venue.venue_name || 'The Grand Ballroom'}
                    </h3>
                    <p className="text-muted-foreground">
                      {venue.location_name || '123 Main St, Anytown USA 12345'}
                    </p>
                    <p>
                      {venue.description ||
                        'The Grand Ballroom is a stunning event space with high ceilings, elegant decor, and a spacious dance floor. Accommodates up to 300 guests.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="grid gap-2">
              <h2 className="text-2xl font-bold">Service Details</h2>
              <div className="grid gap-4">
                {services.length > 0 ? (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-center border-b py-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={service.service_image || '/placeholder.svg'}
                          width={100}
                          height={75}
                          alt="Service Image"
                          className="rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold">{service.service_name}</h3>
                          <p>{service.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {(service.price || 0).toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                          })}
                        </p>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No services selected</p>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span>Venue Price:</span>
              <span>
                {(venue.price_per_hour || 0).toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Total:</span>
              <span>
                {serviceAmount.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </span>
            </div>
            <Divider />
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>
                {totalAmount.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Amount to Pay:</span>
              <span>
                {amountToPay.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                })}
              </span>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinalizeBooking}
              className="mt-4"
            >
              Proceed to Payment
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </section>
      </main>
      <footer className="p-6 border-t">
        <Button
          variant="outlined"
          onClick={handleAddMoreServices}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
        >
          Add More Services
        </Button>
      </footer>
    </div>
  );
}
