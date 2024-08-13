import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CartesianGrid, XAxis, Area, AreaChart, Tooltip } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
const BASEUrl = process.env.REACT_APP_BASE_URL


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    try {
      const response = await axios.post(`${BASEUrl}vendor/contact`, formData);
      if (response.status === 200) {
       
        toast.success("Your message has been sent, please wait till we reach out.");
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        setStatus('Failed to send message');
        toast.error("There was an issue sending your message. Please try again later.");
      }
    } catch (error) {
      setStatus('Failed to send message');
      toast.error("There was an error with the request. Please try again later.");
    }
  };
  // 
  return (
    <div className="w-full">
       <ToastContainer/>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-200">
        <div className="container mx-auto grid items-center justify-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get in Touch</h1>
            <p className="max-w-[600px] text-gray-600 md:text-xl lg:text-base xl:text-xl">
              Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
         
          <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input id="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>
         
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows={4} value={formData.message} onChange={handleChange} placeholder="How can we help you?" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                Submit
              </button>
              {status && <p className="text-green-600">{status}</p>}
            </form>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto grid items-start gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Contact Information</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LocateIcon className="h-5 w-5 text-gray-500" />
                <p>123 Main St, Anytown USA</p>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-gray-500" />
                <p>(123) 456-7890</p>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="h-5 w-5 text-gray-500" />
                <p>info@example.com</p>
              </div>
            </div>
          </div>
          <div className="w-full aspect-w-4 aspect-h-3">
            <AreachartChart />
          </div>
        </div>
      </section>
    </div>
  );
}

function AreachartChart(props) {
  return (
    <div {...props}>
      <div className="min-h-[300px]">
        <AreaChart
          data={[
            { month: 'January', desktop: 186 },
            { month: 'February', desktop: 305 },
            { month: 'March', desktop: 237 },
            { month: 'April', desktop: 73 },
            { month: 'May', desktop: 209 },
            { month: 'June', desktop: 214 },
          ]}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            dataKey="desktop"
            type="natural"
            fill="rgba(0, 123, 255, 0.4)"
            stroke="rgba(0, 123, 255, 1)"
          />
        </AreaChart>
      </div>
    </div>
  );
}

function CustomTooltip({ payload, label }) {
  if (payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="text-gray-800">{label}</p>
        <p className="text-gray-600">{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}

function LocateIcon(props) {
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
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

function MailIcon(props) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props) {
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
      <path d="M6.62 10.79a15.78 15.78 0 0 0 6.4 6.39l2.2-2.2a1 1 0 0 1 1.2-.17l2.9 1.17a1 1 0 0 0 1.19-.53l1.67-3.34a1 1 0 0 0-.22-1.1L15.4 3.41a1 1 0 0 0-1.19-.22l-3.34 1.67a1 1 0 0 0-.53 1.19l1.17 2.9a1 1 0 0 1-.17 1.2l-2.2 2.2a15.78 15.78 0 0 0-6.39-6.4A15.78 15.78 0 0 0 1.21 4.21a1 1 0 0 1 .22-1.1l3.34-1.67a1 1 0 0 0 1.19-.22l2.2 2.2a1 1 0 0 1 1.2.17l1.17 2.9a1 1 0 0 0 1.19.53l3.34-1.67a1 1 0 0 0 1.1.22L21 9.62a1 1 0 0 0 .22 1.1l-1.67 3.34a1 1 0 0 0 .53 1.19l2.9 1.17a1 1 0 0 1 1.2-.17l2.2-2.2a15.78 15.78 0 0 0 6.39-6.4" />
    </svg>
  );
}
