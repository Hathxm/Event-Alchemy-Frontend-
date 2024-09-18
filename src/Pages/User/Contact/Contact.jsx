import React, { useState } from 'react';
import axios from 'axios';
const BASEUrl = process.env.REACT_APP_BASE_URL

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous errors

    try {
      const response = await axios.post(`${BASEUrl}contact`, formData);
      if (response.status === 200) {
        setFormSubmitted(true);
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }
    } catch (error) {
      setErrorMessage('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <div>
      {/* Container with Border */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
          <div className="grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            {/* Form Section */}
            <div className="space-y-4 p-6">
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Let us help plan your next event
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                Our team of event experts will work with you to create a memorable experience for your guests.
              </p>
              <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your event"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                    required
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
                {formSubmitted ? (
                  <p className="text-green-500 text-sm">Your message has been sent!</p>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
                  >
                    Submit
                  </button>
                )}
              </form>
            </div>
            {/* Image Section */}
            <div className="rounded">
              <img
                src="https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/contactpageimg.jpg"
                width="550"
                height="310"
                alt="Hero"
                className="mx-auto aspect-video object-cover object-center w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Event Services Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Event Services</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl lg:text-base xl:text-xl">
              Browse our selection of event services provided by our trusted vendors.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Service Card Components */}
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 border border-gray-300">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">Catering</h3>
                <p className="text-muted-foreground">Delicious meals and refreshments for your guests.</p>
              </div>
              <div className="flex items-center justify-between">
              </div>
            </div>
            {/* Add more service cards as needed */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
