import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import AdminTableComponent from "../../../Components/Admin/AdminTable/AdminTableComponent";
import AddVendorService from './AddVendorService';

export default function Component() {
  const [chartData, setChartData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearlyData, setYearlyData] = useState([]);
  const [services, setServices] = useState([]);
  const [userData, setUserData] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/vendor/vendor_services', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserData();
  }, []);

 

  const columns = useMemo(() => [
    {
      header: 'Service Name',
      accessor: (item) => (
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">{item.service_name}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: (item) => <p className="text-gray-900 whitespace-no-wrap">{item.description}</p>
    },
    {
      header: 'Price/Hour',
      accessor: (item) => <p className="text-gray-900 whitespace-no-wrap">{item.price}</p>
    },
    {
      header: 'Status',
      accessor: (item) => (
        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${item.is_active ? 'text-green-900' : 'text-red-900'}`}>
          {item.is_active ? (
            <>
              <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
              <span className="relative">Active</span>
            </>
          ) : (
            <>
              <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
              <span className="relative">Inactive</span>
            </>
          )}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: (item) => (
        <div className='flex'>
          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white">Edit</button>
          <button
            // onClick={() => toggleUserStatus(item.id, item.is_active)}
            className={`px-4 py-2 rounded-lg ${item.is_active ? 'bg-red-500 hover:bg-red-700 ml-2' : 'bg-green-500 hover:bg-green-700'} text-white ml-2`}
          >
            {item.is_active ? 'Block' : 'Unblock'}
          </button>
        </div>
      )
    },
  ], []);

  useEffect(() => {
    const fetchChartData = async (year) => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/vendor/dashboard', { year }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          }
        });
        const monthlyData = response.data.monthly_revenue || [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = monthNames.map((month, index) => {
          const dataItem = monthlyData.find(item => item.month === index + 1);
          return { month: month, value: dataItem ? dataItem.total_revenue : 0 };
        });
        setChartData(chartData);
        setYearlyData(response.data.years || []);
        console.log(response.data.yearly_revenue)
        setBookings(response.data.bookings)
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/vendor/vendor_services', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          }
        });
        setServices(response.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const addService = async (newService) => {
    try {
      const token = localStorage.getItem('access');
      const res = await axios.post('/vendor/addservice', newService, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setUserData(res.data.updated_data);
    } catch (error) {
      console.error('Error adding service:', error.response ? error.response.data : error.message);
      throw error; // Ensure errors propagate to be caught in the AddVendorService component
    }
  };

  return (
    <>
      <div className="grid gap-8 p-4 sm:p-6 md:grid-cols-[1fr_2fr] lg:grid-cols-[2fr_3fr]">
        <div className="grid gap-6">
          {/* Performance Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Performance</h2>
              <p className="card-description">View your service performance metrics over time.</p>
            </div>
            <div className="card-content">
              <div className="h-64">
              <select
  id="year-select"
  value={selectedYear}
  onChange={handleYearChange}
  className="mb-4 p-2 border rounded-md"
>
  <option value="" disabled>Select a year</option>
  {yearlyData.map((item, index) => (
    <option key={index} value={item.year}>
      {item.year}
    </option>
  ))}
</select>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card-footer">
              <div className="flex items-center justify-between">
                <div className="dropdown-menu">
                  {/* Placeholder for dropdown menu if needed */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Bookings Overview</h2>
              <p className="card-description">View your upcoming bookings and their details.</p>
            </div>
            <div className="card-content">
              <div className="relative">
                <div className="overflow-auto h-80 mt-4">
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

      <div className="flex justify-end mt-4 px-4">
        <AddVendorService addvendorservice={addService} />
      </div>

      <div className="flex justify-center mt-4">
        <div className="inline-block min-w-full max-w-5xl shadow rounded-lg overflow-hidden">
          <div className="relative">
          </div>
          <AdminTableComponent data={userData} columns={columns} />
        </div>
      </div>
    </>
  );
}

function CalendarIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function DotIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12.1" cy="12.1" r="1" />
    </svg>
  );
}

function ListOrderedIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}
