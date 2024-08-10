import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BASEUrl = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem("access");

// Avatar Component
function Avatar({ className, children }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

function DotIcon(props) {
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
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

// AvatarImage Component
function AvatarImage({ src, alt }) {
  return (
    <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
  );
}

// AvatarFallback Component
function AvatarFallback({ children }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full">
      {children}
    </div>
  );
}

// CalendarDaysIcon Component
function CalendarDaysIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

// StarIcon Component
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

// Main Component
export default function Manager_Profile_Rating() {
  const { id } = useParams();
  const [managerData, setManagerData] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await axios.get(`${BASEUrl}superadmin/manager-profile`, {
          params: { manager_id: id },
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setManagerData(response.data.manager);
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error('Error fetching manager data:', error);
      }
    };

    fetchManagerData();
  }, [id, token]);

  // Calculate total rating based on bookings
  const totalRating = bookings.reduce((sum, booking) => sum + booking.rating, 0) / bookings.length;
  const roundedRating = Math.round(totalRating * 10) / 10; // Round to one decimal place

  if (!managerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-12 md:py-16 lg:py-20">
      {/* Left Column */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={managerData.profilePic || '/placeholder-user.jpg'} alt={managerData.username || 'User Avatar'} />
            <AvatarFallback>{managerData.username ? managerData.username[0] : 'JD'}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 text-center">
            <h1 className="text-3xl font-bold">{managerData.first_name || 'John Doe'}</h1>
            <p className="text-gray-500">{managerData.event_name || 'Software Engineer'} Manager</p>
          </div>
        </div>
        <div className="grid max-w-md gap-4 text-center">
          <p className="text-gray-500">{managerData.bio || 'John is a passionate software engineer with a strong background in full-stack development. He loves building innovative solutions that solve real-world problems.'}</p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-5 w-5 ${index < Math.floor(roundedRating) ? 'fill-current text-yellow-500' : 'fill-current text-gray-300'}`}
                />
              ))}
            </div>
            <div className="text-primary font-medium">{roundedRating || '0.0'}</div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">Joined on {managerData.created_at?.split('T')[0] || '2018'}</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">{bookings.length || '125'} Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Table */}
      <div className="flex flex-col">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Bookings Hosted By {managerData.username}</h2>
            <p className="card-description">View event managers bookings and their details.</p>
          </div>
          <div className="card-content">
            <div className="relative">
              <div className="overflow-auto h-80">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Client</th>
                      <th>Venue</th>
                      <th className="text-right">Amount</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking, index) => (
                      <tr key={index}>
                        <td className="font-medium">{booking.id}</td>
                        <td className="font-medium">{booking.event_name}</td>
                        <td>
                          <time dateTime={booking.date}>{booking.date}</time>
                        </td>
                        <td>{booking.customer_name}</td>
                        <td>{booking.venue.venue_name}</td>
                        <td className="text-right">{booking.Total}</td>
                        <td>
                          <div className="dropdown-menu">
                            <button className="button-ghost-icon" aria-haspopup="true">
                              <DotIcon className="icon-small" />
                              <span className="sr-only">Toggle menu</span>
                            </button>
                            <div className="dropdown-content">
                              <p className="dropdown-label">Actions</p>
                              <button className="dropdown-item">View Details</button>
                              <button className="dropdown-item">Edit Booking</button>
                              <button className="dropdown-item">Cancel Booking</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="card-footer" />
        </div>
      </div>
    </div>
  );
}
