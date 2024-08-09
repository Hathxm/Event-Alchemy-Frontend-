import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatComponent from '../../../Components/User/ChatComponent/ChatComponent';
import { Link  } from 'react-router-dom';

export default function UserBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chatData, setChatData] = useState(null);
    const token = localStorage.getItem('access');

    useEffect(() => {
        const baseURL = "http://127.0.0.1:8000";

        const fetchBookingsForUser = async () => {
            try {
                const response = await axios.post(`${baseURL}/fetch_bookings`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookings(response.data);
            } catch (err) {
                setError(err.message || 'Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingsForUser();
    }, [token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Your Bookings</h1>
                <Button variant="outline">Add New Booking</Button>
            </div>
            <div className="grid gap-6">
                {bookings.map(booking => (
                    <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        userId={booking.customer_id}
                        sendername={booking.customer_name}
                        setChatData={setChatData} 
                    />
                ))}
            </div>
            {chatData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg w-full max-w-3xl">
                        <div className="flex justify-end">
                            <button     
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setChatData(null)}
                            >
                                Close
                            </button>
                        </div>
                        <ChatComponent 
                            userId={chatData.userId} 
                            managerId={chatData.managerId} 
                            username={chatData.username} 
                            sendername={chatData.sendername}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function Button({ variant, children, ...props }) {
    const className = `
        px-4 py-2 rounded-md text-sm font-medium 
        ${variant === 'outline' ? 'border border-gray-300 text-gray-700' : ''}
        ${variant === 'destructive' ? 'bg-red-600 text-white' : ''}
    `;
    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
}

function BookingCard({ booking, userId, setChatData, sendername }) {
    const [isCancelVisible, setIsCancelVisible] = useState(false);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const today = new Date();
    const bookingDate = new Date(booking.date);
    const daysUntilBooking = Math.ceil((bookingDate - today) / (1000 * 60 * 60 * 24));
    const canCancel = daysUntilBooking >= 3;
    const balanceDue = booking.Total - booking.amount_paid;

    const handleConnectClick = () => {
        setChatData({
            userId: userId,
            managerId: booking.manager.id,
            username: booking.manager.username,
            sendername: sendername,
        });
    };

    const handleCancel = () => {
        if (canCancel) {
            setIsCancelVisible(true);
        } else {
            alert('Cannot cancel at the moment. Please contact the manager.');
        }
    };

    const validateInputs = () => {
        const phonePattern = /^\d{10}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!phonePattern.test(phone)) {
            alert('Please enter a valid phone number.');
            return false;
        }

        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        return true;
    };

    const handleConfirmCancel = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            const token = localStorage.getItem("access");
            const response = await axios.post(
                '/cancel-booking',
                {
                    bookingId: booking.id,
                    phone,
                    email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert('Booking cancelled successfully.');
                setIsCancelVisible(false);
            } else {
                alert('Failed to cancel booking.');
            }
        } catch (error) {
            alert('Error cancelling booking. Please try again later.');
        }
    };

    return (
        <div className="border rounded-md shadow-md">
            <div className="border-b p-4 bg-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">{booking.event_name}</h2>
                        <p className="text-gray-500">{booking.date}</p>
                    </div>
                    <div>
                        {booking.booking_status === 'Pending' && (
                            <>
                                {canCancel ? (
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={handleCancel}
                                    >
                                        Cancel Booking
                                    </button>
                                ) : (
                                    <p className="text-red-500">Cannot cancel at this moment. Please contact the manager.</p>
                                )}
                            </>
                        )}
                        {booking.booking_status === 'Hosted' && (
                             <Link to={`/rate-event/${booking.id}`}>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                               
                            >
                                Rate Event
                            </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Venue</h3>
                        <div className="flex items-center gap-2">
                            <img
                                src={booking.venue?.image1 || '/placeholder.svg'}
                                width={80}
                                height={80}
                                alt="Venue Image"
                                className="rounded-md"
                            />
                            <div>
                                <p className="font-medium">{booking.venue?.venue_name || "Venue Name"}</p>
                                <p className="text-gray-500">{booking.venue?.location_name || "Venue Address"}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Services</h3>
                        <ul className="space-y-2">
                            {booking.services?.map((service, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <CheckIcon className="w-5 h-5 text-blue-500" />
                                    <span>{service.service_name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Event Manager</h3>
                        <div className="flex items-center gap-4">
                            <div className="rounded-full overflow-hidden w-12 h-12 border">
                                <img
                                    className="w-full h-full object-cover"
                                    src={booking.manager?.profile_pic || '/placeholder-user.jpg'}
                                    alt="Avatar"
                                />
                            </div>
                            <div>
                                <p className="font-medium">{booking.manager?.username || "Manager Name"}</p>
                                <p className="text-gray-500">{booking.manager?.email || "Manager Email"}</p>
                                <p className="text-gray-500">{booking.manager?.phone || "Manager Phone"}</p>
                                <button
                                    className='btn-sm bg-blue-500 text-white rounded'
                                    onClick={handleConnectClick}
                                >
                                    Connect
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Details</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                {/* <span className="text-gray-500">Guests:</span>
                                <span>{booking.guests || "Guests Info"}</span> */}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Total Cost:</span>
                                <span>${booking.Total || "Total Cost"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Deposit Paid:</span>
                                <span>${booking.amount_paid || "Deposit Paid"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Balance Due:</span>
                                <span>${balanceDue || "Balance Due"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isCancelVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Cancel Booking</h2>
                        <p className="text-gray-700 mb-4">Please confirm your cancellation.</p>
                        <div className="mb-4">
                            <label className="block text-gray-700">Phone:</label>
                            <input 
                                type="text" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email:</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsCancelVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleConfirmCancel}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CheckIcon({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
            />
        </svg>
    );
}
