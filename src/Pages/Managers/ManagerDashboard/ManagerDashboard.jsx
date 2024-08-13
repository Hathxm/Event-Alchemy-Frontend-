import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faDollarSign, faCreditCard, faUsers } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
const BASEUrl = process.env.REACT_APP_BASE_URL

// Initial empty data
const initialData = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 0 },
  { month: "Aug", value: 0 },
  { month: "Sep", value: 0 },
  { month: "Oct", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dec", value: 0 },
];

const ManagerDashboard = () => {
  const [chartData, setChartData] = useState(initialData);
  const [yearlyData, setYearlyData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgBookingValue, setAvgBookingValue] = useState(0);
  const [wallet_amt, setwallet_amt] = useState(0);
  const [bookings, setBookings] = useState([]); // Assuming bookings data is available

  // Fetch dashboard data
  const fetchDashboardData = async (year = selectedYear) => {
    try {
      const response = await axios.post(`${BASEUrl}managers/dashboard`, { year }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        }
      });

      if (response.status === 200) {
        const monthlyData = response.data.monthly_revenue;
        const yearlyDataResponse = response.data.yearly_revenue;
        const bookings = response.data.bookings;
        setBookings(bookings);
        setwallet_amt(response.data.wallet); 

        // Define month names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Set monthly chart data
        if (monthlyData && monthlyData.length > 0) {
          const chartData = monthNames.map((month, index) => {
            const dataItem = monthlyData.find(item => item.month === index + 1); // Adjusted to match month number
            return {
              month: month,
              value: dataItem ? dataItem.total_revenue : 0
            };
          });

          setChartData(chartData);
        } else {
          toast.info('No monthly revenue data available for this year.');
        }

        // Set yearly data for dropdown
        if (yearlyDataResponse && yearlyDataResponse.length > 0) {
          setYearlyData(yearlyDataResponse);
        } else {
          toast.info('No yearly revenue data available.');
        }

        // Calculate total bookings
        const totalBookings = monthlyData.length;

        // Calculate total revenue
        const totalRevenue = monthlyData.reduce((acc, item) => acc + item.total_revenue, 0);

        // Calculate average booking value
        const avgBookingValue = totalBookings > 0 ? (totalRevenue / totalBookings) : 0;

        // Update state with correct values
        setTotalBookings(totalBookings);
        setTotalRevenue(totalRevenue);
        setAvgBookingValue(avgBookingValue);
       // Placeholder value

      } else {
        toast.error('Failed to fetch revenue data.');
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      toast.error('Error fetching revenue data.');
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    fetchDashboardData(year);
  };

  // Function to handle booking completion
  const handleCompleteBooking = async (bookingId) => {
    try {
      const response = await axios.post(`${BASEUrl}managers/host-booking`, 
        { booking_id: bookingId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          }
        }
      );

      if (response.status === 200) {
        toast.success('Booking marked as completed.');
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.id === bookingId ? { ...booking, booking_status: 'Hosted' } : booking
          )
        );
      } else {
        toast.error('Failed to mark booking as completed.');
      }
    } catch (error) {
      console.error("Error completing booking:", error);
      toast.error('Error completing booking.');
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <main className="flex-1 p-4">
        <div className="grid gap-8 p-4 sm:p-6 md:grid-cols-[1fr_2fr] lg:grid-cols-[2fr_3fr]">
          <div className="flex flex-col gap-6">
            {/* Performance Card */}
            <div className="card bg-white rounded-lg shadow-md p-4">
              <div className="card-header mb-4">
                <h2 className="text-lg font-semibold">Performance</h2>
                <p className="text-gray-500">View your service performance metrics over time.</p>
              </div>
              <div className="card-content">
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="mb-4 p-2 border rounded-md"
                >
                  <option value="" disabled>Select a year</option>
                  {yearlyData.map(item => (
                    <option key={item.year} value={item.year}>{item.year}</option>
                  ))}
                </select>
                <div className="h-64">
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
            </div>
            {/* Performance Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Total Bookings</h3>
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <p className="text-xs text-gray-500">+12.5% from last year</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Total Revenue</h3>
                  <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-gray-500">+18.2% from last year</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Average Booking Value</h3>
                  <FontAwesomeIcon icon={faCreditCard} className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">₹{avgBookingValue.toFixed(2)}</div>
                <p className="text-xs text-gray-500">+7.3% from last year</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Wallet Amount</h3>
                  <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-gray-500" />
                </div>
                <div className="text-2xl font-bold">₹{wallet_amt}</div>
                <p className="text-xs text-gray-500">+4.6% from last year</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 h-auto">
            <div className="card-header mb-4">
              <h2 className="text-lg font-semibold">Bookings Overview</h2>
              <p className="text-gray-500">List of recent bookings and actions.</p>
            </div>
            <div className="overflow-y-auto max-h-64">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.booking_status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  {booking.booking_status === "Pending" && (
    <button
      onClick={() => handleCompleteBooking(booking.id)}
      className={`px-4 py-2 ${
        booking.booking_status === "Hosted"
          ? "bg-green-600 hover:bg-green-700"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white rounded`}
    >
      {booking.booking_status === "Hosted" ? "Hosted" : "Complete"}
    </button>
  )}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;


