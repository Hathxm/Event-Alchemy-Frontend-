import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [expandedDescription, setExpandedDescription] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const BASEUrl = process.env.REACT_APP_BASE_URL

  useEffect(() => {
    axios
      .get(`${BASEUrl}superadmin/eventmanagement/`)
      .then((response) => {
        setEventData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Image URLs for the first section carousel
  const images = [
    "https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/user-landing-page-img.png",
    "https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/aboutexperts.jpg",
    "https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/aboutevents.avif"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex + 1) % eventData.length);
  };

  const handlePrevEvent = () => {
    setCurrentEventIndex((prevIndex) => (prevIndex - 1 + eventData.length) % eventData.length);
  };

  const handleLearnMoreClick = (eventId) => {
    navigate(`/venues/${eventId}`);
  };

  const toggleDescription = (index) => {
    setExpandedDescription(expandedDescription === index ? null : index);
  };

  return (
<>    <div className='relative h-screen'>
    <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
            backgroundImage: `url("https://partyslate.imgix.net/photos/447992/photo-f2f9ee2d-0f01-4daf-a446-478b44272b72.jpg?ixlib=js-2.3.2&auto=compress%2Cformat&bg=fff&w=2400")`,
            filter: 'brightness(0.5)', // Adjusts the overall brightness
        }}
    ></div>
    <div className='absolute inset-0 bg-black opacity-20'></div> {/* Overlay for opacity */}
    <div className='relative z-10 flex items-center justify-center h-full'>
        <div className='text-white text-center mt-5'>
            <h4 className=' font-bold mb-4 uppercase '>Event alchemy presents</h4>
            <h2 className='text-5xl  mb-4 uppercase font-serif'>An experience to remember..</h2>
     

          
        </div>
    </div>
</div>

    <div className="flex flex-col min-h-screen">
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="bg-background rounded-lg border p-6 flex gap-12 items-center max-w-6xl w-full mx-auto overflow-hidden">
            <div className="flex-1">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                      Effortless Event Management
                    </h1>
                    <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl">
                      Streamline your event planning with our all-in-one platform. From ticketing to venue management, we've got you covered.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                    <a
                      href="#events"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      Explore Events
                    </a>
                  </div>
                </div>
                <div
                  className="mx-auto rounded-xl bg-cover bg-center sm:w-full lg:order-last lg:aspect-square overflow-hidden"
                  style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
                >
                  {/* This div will act as a placeholder for the dynamic background image */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
  


        <section id="events" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Available Events</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl lg:text-base xl:text-xl">
                  Discover a wide range of events to attend and enjoy.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden mx-auto w-full max-w-5xl py-12">
              <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${currentEventIndex * 100}%)` }}
              >
                {eventData.map((event, index) => (
                  <div key={event.id} className="min-w-full p-1">
                    <div className="flex justify-center items-center">
                      <div className="max-w-lg mx-4 bg-white shadow-lg rounded-xl overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full aspect-[4/3] overflow-hidden rounded-t-xl object-cover"
                        />
                        <div className="p-6 space-y-2">
                          <h3 className="text-lg font-bold">{event.name}</h3>
                          <p className={`text-gray-700 ${expandedDescription === index ? '' : 'line-clamp-3'}`}>
                            {event.description}
                          </p>
                          <div className="flex justify-between items-center">
                            {event.description.length > 200 && (
                              <button
                                onClick={() => toggleDescription(index)}
                                className="text-blue-500 underline focus:outline-none"
                              >
                                {expandedDescription === index ? 'Read Less' : 'Read More'}
                              </button>
                            )}
                            <button
                              onClick={() => handleLearnMoreClick(event.id)}
                              className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 focus:outline-none"
                            >
                              View Venues
                              <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePrevEvent}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none z-10"
              >
                &#10094;
              </button>
              <button
                onClick={handleNextEvent}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none z-10"
              >
                &#10095;
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 bg-gray-800 text-white">
        <p className="text-xs">&copy; 2024 Event Management. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a href="#" className="text-xs hover:underline">
            Terms of Service
          </a>
          <a href="#" className="text-xs hover:underline">
            Privacy Policy
          </a>
        </nav>
      </footer>
    </div>
    </>

  );
};

export default LandingPage;

