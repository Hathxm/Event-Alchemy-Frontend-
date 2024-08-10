import { FaCheckCircle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutGrid } from "../../../Components/User/ImageLayout/ImageGrid.tsx";
import { toast } from 'react-toastify';
const BASEUrl = process.env.REACT_APP_BASE_URL


const base_url = "http://127.0.0.1:8000";

const Skeleton = ({ venueName, description }) => {
  return (
    <div>
      <p className="font-bold text-4xl text-white">{venueName}</p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">{description}</p>
    </div>
  );
};

const VenueDetails = () => {
  const [venueDetails, setVenueDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableShifts, setAvailableShifts] = useState([]);
  const [notAvailableShifts, setNotAvailableShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [dateError, setDateError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASEUrl}venue_details`, {
          params: { id: id }
        });
        setVenueDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleDateChange = async (e) => {
    const value = e.target.value;
    setSelectedDate(value);
    setDateError('');

    // Check if the selected date is at least 3 days from today
    const currentDate = new Date();
    const selected = new Date(value);
    const minBookingDate = new Date(currentDate.setDate(currentDate.getDate() + 3)).setHours(0, 0, 0, 0);

    if (selected < minBookingDate) {
      toast.error("Please Choose a Date after 3 days from today",{
        position: "bottom-right",
        autoClose: 5000,
      })
      setAvailableShifts([]);
      setNotAvailableShifts([]);
      return;
    }

    try {
      const response = await axios.post(`${BASEUrl}check_availability`, {
        venue_id: id,
        date: value
      });

      setAvailableShifts(response.data.available_shifts);
      setNotAvailableShifts(response.data.not_available_shifts);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleShiftSelection = (e) => {
    setSelectedShift(e.target.value);
  };

  const handleBooking = () => {
    if (!selectedShift) {
      toast.error("Please Choose a Shift To Continue Your Bookings",{
        position: "bottom-right",
        autoClose: 5000,
      })
      return;
    }

    const selectedShiftDetails = availableShifts.find(shift => shift.name === selectedShift);
    const bookingDetails = {
      venueId: id,
      date: selectedDate,
      shift: selectedShiftDetails,
      
    };

    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    navigate(`/venue_services/${id}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!venueDetails) {
    return <div className="text-center">No data available</div>;
  }

  const { venue_name, description, image1, image2, image3, image4, price_per_hour, location_name } = venueDetails;

  const image1Url = `${image1}`;
  const image2Url = `${image2}`;
  const image3Url = `${image3}`;
  const image4Url = `${image4}`;


  const cards = [
    {
      id: 1,
      content: <Skeleton venueName={venue_name} description={description} />,
      className: "md:col-span-2",
      thumbnail: image1Url,
    },
    {
      id: 2,
      content: <Skeleton venueName={venue_name} description={description} />,
      className: "col-span-1",
      thumbnail: image2Url,
    },
    {
      id: 3,
      content: <Skeleton venueName={venue_name} description={description} />,
      className: "col-span-1",
      thumbnail: image3Url,
    },
    {
      id: 4,
      content: <Skeleton venueName={venue_name} description={description} />,
      className: "md:col-span-2",
      thumbnail: image4Url,
    },
  ];

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  return (
    <>
      <div className="h-screen w-full  flex flex-col items-center bg-gray-100">
        <LayoutGrid cards={cards} />
        <div className="w-full flex justify-center mb-3">
  <div className="w-full flex justify-center">
    <div className=" bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/4 xl:w-3/4 max-w-6xl">
      <h1 className="text-xl font-semibold mb-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <a href="#" className="hover:no-underline relative">
            {venue_name}
            <div className="h-1 w-12 rounded-sm transition-all bg-blue-500 duration-300 mt-1 hover:w-full"></div>
          </a>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col md:flex-row gap-2 items-center mt-2 md:mt-0"
          >
            <div className="flex flex-col">
              <label htmlFor="booking-date" className="text-sm mb-1">
                Event Date
              </label>
              <input
                id="booking-date"
                type="date"
                className="border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              {dateError && <p className="text-red-600 mt-1">{dateError}</p>}

              <div className="flex flex-wrap justify-center md:justify-start">
                <div className="flex flex-row flex-wrap">
                  {availableShifts.map((shift, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center m-1"
                    >
                      <label htmlFor={`shift-${shift.name}`} className="text-sm">
                        {shift.name}
                      </label>
                      <input
                        type="radio"
                        id={`shift-${shift.name}`}
                        name="shift"
                        value={shift.name}
                        onChange={handleShiftSelection}
                        checked={selectedShift === shift.name}
                        className="mb-1"
                      />
                      <span className="text-xs">
                        {formatTime(shift.start_time)} -{" "}
                        {formatTime(shift.end_time)}
                      </span>
                    </div>
                  ))}
                  {notAvailableShifts.map((shift, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center m-1"
                    >
                      <label htmlFor={`shift-${shift.name}`} className="text-sm">
                        {shift.name}
                      </label>
                      <FaCheckCircle />
                      <span className="text-xs">
                        {formatTime(shift.start_time)} -{" "}
                        {formatTime(shift.end_time)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </h1>
      <div className="text-sm mb-2">
        {/* Additional content */}
      </div>
      <div className="text-justify overflow-hidden mb-4">
        {description}
      </div>
      <ul className="flex flex-wrap justify-center md:justify-start">
        <li className="text-xs bg-gray-600 bg-opacity-40 rounded-md py-1 px-3 mr-2 mb-2">
          {location_name}
        </li>
        <li className="text-xs mb-1">
          <button className="text-white bg-blue-500 hover:bg-blue-600 rounded-md py-1 px-2">
            ${price_per_hour}/Hour
          </button>
        </li>
        <li className="text-xs mb-1 ml-auto">
          <button
            onClick={handleBooking}
            className="text-white bg-green-500 hover:bg-green-600 rounded-md py-1 px-2"
          >
            Proceed to Booking
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>
</div>

    </>
  );
};

export default VenueDetails;



