import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Info,
} from 'lucide-react';
import { toast } from 'react-toastify';

const BASEUrl = process.env.REACT_APP_BASE_URL;

const formatTime = (time) => {
  if (!time) return '';
  let [hours, minutes] = time.split(':');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const computeShiftDurationHours = (shift) => {
  if (!shift) return 0;
  const start = new Date(`2000-01-01T${shift.start_time}`);
  const end = new Date(`2000-01-01T${shift.end_time}`);
  return (end - start) / (1000 * 60 * 60);
};

const VenueDetails = () => {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableShifts, setAvailableShifts] = useState([]);
  const [notAvailableShifts, setNotAvailableShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // The event id is threaded through from the Venues page so the services
  // lookup stays tied to the event (not the individual venue/location).
  const eventId = searchParams.get('event');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASEUrl}venue_details`, {
          params: { id },
        });
        setVenue(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDateChange = async (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    setSelectedShift('');

    const currentDate = new Date();
    const selected = new Date(value);
    const minBookingDate = new Date(
      currentDate.setDate(currentDate.getDate() + 3)
    ).setHours(0, 0, 0, 0);

    if (selected < minBookingDate) {
      toast.error('Please choose a date at least 3 days from today', {
        position: 'bottom-right',
        autoClose: 5000,
      });
      setAvailableShifts([]);
      setNotAvailableShifts([]);
      return;
    }

    try {
      const response = await axios.post(`${BASEUrl}check_availability`, {
        venue_id: id,
        date: value,
      });
      setAvailableShifts(response.data.available_shifts || []);
      setNotAvailableShifts(response.data.not_available_shifts || []);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleBooking = () => {
    if (!selectedShift) {
      toast.error('Please choose a shift to continue', {
        position: 'bottom-right',
        autoClose: 5000,
      });
      return;
    }

    const selectedShiftDetails = availableShifts.find(
      (s) => s.name === selectedShift
    );
    const bookingDetails = {
      venueId: id,
      date: selectedDate,
      shift: selectedShiftDetails,
    };
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    navigate(`/venue_services/${id}${eventId ? `?event=${eventId}` : ''}`);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }
  if (!venue) {
    return <div className="text-center py-20 text-gray-500">No data available</div>;
  }

  const images = [venue.image1, venue.image2, venue.image3, venue.image4]
    .filter(Boolean)
    .map((img) => `${BASEUrl}${img.replace(/^\//, '')}`);

  const allShifts = [
    ...availableShifts.map((s) => ({ ...s, available: true })),
    ...notAvailableShifts.map((s) => ({ ...s, available: false })),
  ];

  const activeShift = allShifts.find((s) => s.name === selectedShift);
  const shiftDuration = computeShiftDurationHours(activeShift);
  const shiftPrice = shiftDuration * (Number(venue.price_per_hour) || 0);

  const minDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return (
    <div className="min-h-screen lg:min-h-0 lg:h-[calc(100vh-4rem)] lg:overflow-hidden bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 lg:h-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:h-full lg:min-h-0">
          <div className="lg:min-h-0 lg:overflow-hidden">
            {images.length > 0 && (
              <div className="relative bg-white rounded-xl overflow-hidden shadow-sm mb-3">
                <img
                  src={images[activeImage]}
                  alt={venue.venue_name}
                  className="w-full h-96 object-cover bg-gray-100"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImage((i) =>
                          i === 0 ? images.length - 1 : i - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImage((i) =>
                          i === images.length - 1 ? 0 : i + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                      {activeImage + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {images.length > 1 && (
              <div className="flex gap-2  overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 transition ${
                      i === activeImage
                        ? 'border-gray-800'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={src}
                      alt={`thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {venue.venue_name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-gray-600 text-sm">
                {venue.location_name && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-800" />
                    <span>{venue.location_name}</span>
                  </div>
                )}
                {venue.accomodation != null && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-800" />
                    <span>Accommodates up to {venue.accomodation} guests</span>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-800">
                  ${venue.price_per_hour}
                </span>
                <span className="text-sm text-gray-500 ml-1">/hour</span>
              </div>

              {venue.description && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    About This Venue
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {venue.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4 lg:h-full lg:min-h-0 lg:overflow-y-auto pr-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-gray-800" />
                <h2 className="text-lg font-bold text-gray-900">Select Date</h2>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={minDate}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <p className="text-xs text-gray-500 mt-2">
                Bookings must be at least 3 days in advance.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-gray-800" />
                <h2 className="text-lg font-bold text-gray-900">Select Shift</h2>
              </div>

              {allShifts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Pick a date to see available shifts.
                </p>
              ) : (
                <div className="space-y-2">
                  {allShifts.map((shift) => {
                    const isSelected = selectedShift === shift.name;
                    return (
                      <button
                        key={shift.name}
                        onClick={() =>
                          shift.available && setSelectedShift(shift.name)
                        }
                        disabled={!shift.available}
                        className={`w-full text-left p-3 rounded-lg border transition ${
                          !shift.available
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : isSelected
                            ? 'border-gray-800 bg-gray-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{shift.name}</span>
                          {!shift.available && (
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-gray-200 rounded">
                              Booked
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {formatTime(shift.start_time)} -{' '}
                          {formatTime(shift.end_time)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {activeShift && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-sm text-gray-600">Price per shift</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-800">
                    ${shiftPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    for {shiftDuration} hours
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6">
              {(!selectedDate || !selectedShift) && (
                <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-md p-3 mb-3">
                  <Info className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>Please select a date and shift to proceed.</span>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedShift}
                className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
              >
                Proceed to Booking
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                You won't be charged until you complete your booking.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
