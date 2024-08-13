import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BASEUrl = process.env.REACT_APP_BASE_URL;

const RatingStarIcon = ({ filled, onClick, disabled }) => (
  <svg
    onClick={!disabled ? onClick : undefined}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={filled ? 'text-yellow-400' : 'text-gray-300'}
    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Ratings = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [bookingRating, setBookingRating] = useState(0);
  const [serviceRatings, setServiceRatings] = useState([]);
  const [review, setReview] = useState(''); // State for review
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`${BASEUrl}rate-booking`, {
          params: { booking_id: id },
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookingData = response.data;
        setBooking(bookingData.booking);
        setBookingRating(bookingData.booking.rating || 0);
        setServiceRatings(bookingData.services_with_ratings || []);
        setReview(bookingData.booking.review || ''); // Set initial review if available
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    fetchBookingData();
  }, [id, token]);

  const handleStarClick = (rating, serviceId = null) => {
    if (serviceId) {
      setServiceRatings(prev =>
        prev.map(service =>
          service.service_id === serviceId ? { ...service, rating } : service
        )
      );
    } else if (!booking?.is_rated) {
      setBookingRating(rating);
    }
  };

  const handleSubmit = () => {
    const data = {
      booking_id: id,
      booking_rating: bookingRating,
      service_ratings: serviceRatings,
      review, // Include review in the submission
    };

    axios.post(`${BASEUrl}rate-booking`, data, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        console.log('Ratings submitted:', response.data);
        const updatedBooking = response.data.booking;
        setBooking(updatedBooking);
        setBookingRating(updatedBooking.rating || 0);
        setServiceRatings(response.data.services_with_ratings || []);
        setReview(updatedBooking.review || ''); // Update review state
        toast.success("Booking Has Been Rated Thank You For Choosing Us..")
      })
      .catch(error => {
        console.error('Error submitting ratings:', error);
      });
  };

  if (!booking) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Manager Information */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
          <img src={booking.manager.profile_pic || 'path/to/default-image.jpg'} alt={booking.manager.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{booking.manager_name}</h1>
          <p className="text-gray-600">{booking.event_name}</p>
        </div>
      </div>

      {/* Rating Section */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Rate the Manager or Event</h2>
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, index) => (
            <RatingStarIcon
              key={index}
              filled={index < bookingRating}
              onClick={() => handleStarClick(index + 1)}
              disabled={booking.is_rated}
            />
          ))}
          <span className="text-lg font-medium text-gray-800">{bookingRating}</span>
        </div>
        
        {/* Review Section */}
        {booking.is_rated ? (
          <div className="bg-white p-4 rounded-md border border-gray-300">
            <h3 className="text-lg font-bold text-gray-900">Your Review</h3>
            <p className="text-gray-700 mt-2">{booking.review}</p>
          </div>
        ) : (
          <textarea
            className="w-full p-4 rounded-md border border-gray-300 mb-4"
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            disabled={booking.is_rated} // Disable if already rated
          ></textarea>
        )}

        <button
          onClick={handleSubmit}
          className={`bg-blue-500 text-white rounded-md px-4 py-2 ${booking.is_rated ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={booking.is_rated}
        >
          {booking.is_rated ? 'Already Rated' : 'Submit Ratings'}
        </button>
      </div>

      {/* Services Booked */}
      <h2 className="text-xl font-bold mb-4 text-gray-900">Services Booked for the Event</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceRatings.map(service => (
          <div key={service.service_id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                <img
                  src={service.profile_pic || 'path/to/default-image.jpg'}
                  alt={service.service_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{service.service_name}</h3>
                <p className="text-gray-600">{service.vendor_name}</p>
              </div>
            </div>
            <img
              src={service.service_image}
              alt={service.service_name}
              className="rounded-lg mb-4 w-full h-auto"
              style={{ aspectRatio: '300/200', objectFit: 'cover' }}
            />
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, index) => (
                <RatingStarIcon
                  key={index}
                  filled={index < (service.rating || 0)}
                  onClick={() => handleStarClick(index + 1, service.service_id)}
                  disabled={booking.is_rated}
                />
              ))}
              <span className="text-sm font-medium text-gray-600">{service.rating || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ratings;
