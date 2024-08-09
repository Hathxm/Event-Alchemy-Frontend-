import React from 'react';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';





const VendorHomePage = () => {

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Example of using static images
        const staticImages = [
          'https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/user-landing-page-img.png',
          'https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/aboutexperts.jpg',
          'https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/aboutevents.avif',
        ];
        setImages(staticImages);
    
       
      }, []);
    
    
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
    
        return () => clearInterval(interval);
      }, [images.length]);
  return (
    <div className="flex flex-col min-h-screen">
     <section className="w-full py-5 md:py-24 lg:py-32 xl:py-48 bg-gray-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                  Showcase Your Services on Our Open Platform
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Our platform connects event organizers with a wide range of vendors, making it easy to book the perfect services for any occasion.
                </p>
              </div>
              <Link to="/vendor/dashboard">
                <button className="w-full max-w-[300px] bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600">
                  Post Your Services Here !
                </button>
              </Link>
            </div>
            <div
              className="mx-auto rounded-xl bg-cover bg-center sm:w-full lg:order-last lg:aspect-square overflow-hidden"
              style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
            >
              {/* This div will display the dynamic background image */}
            </div>
          </div>
        </div>
      </section>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl mx-auto mt-2">
                  What We Do .. ?
                </h1>
      <section className="w-full py-10 md:py-24 lg:py-32">
     
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-4 bg-blue-200">
              <UsersIcon className="h-10 w-10 text-blue-500" />
              <h3 className="text-xl font-semibold">Create a Profile</h3>
              <p className="text-gray-600">
                Showcase your services and expertise with a professional vendor profile.
              </p>
            </div>
            <div className="grid gap-4 bg-blue-200">
              <ListIcon className="h-10 w-10 text-blue-500" />
              <h3 className="text-xl font-semibold">List Your Services</h3>
              <p className="text-gray-600">
                Easily add and manage your services, including pricing and availability.
              </p>
            </div>
            <div className="grid gap-4 bg-blue-200">
              <CalendarIcon className="h-10 w-10 text-blue-500" />
              <h3 className="text-xl font-semibold">Manage Bookings</h3>
              <p className="text-gray-600">Receive and manage bookings directly through our platform.</p>
            </div>
            <div className="grid gap-4 bg-blue-200">
              <WalletIcon className="h-10 w-10 text-blue-500" />
              <h3 className="text-xl font-semibold">Get Paid</h3>
              <p className="text-gray-600">
                Our secure payment system ensures you get paid on time, every time.
              </p>
            </div>
            <div className="grid gap-4 bg-blue-200">
              <InfoIcon className="h-10 w-10 text-blue-500" />
              <h3 className="text-xl font-semibold">Track Performance</h3>
              <p className="text-gray-600">
                Monitor your bookings, reviews, and other key metrics to improve your business.
              </p>
            </div>
            <div className="grid gap-4 bg-blue-200">
              <PowerIcon className="h-10 w-10 text-blue-500" />
              <h3 className="text-xl font-semibold">Dedicated Support</h3>
              <p className="text-gray-600">
                Our team is here to help you every step of the way, from onboarding to ongoing support.
              </p>
            </div>
          </div>
        </div>
      </section>


      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl mx-auto mt-2 mb-4">
                  What Our Customers Say .. 
                </h1>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="border w-12 h-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="@username" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-600">Event Planner, Acme Events</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Our experience with this platform has been fantastic. The vendor selection and booking process is seamless, and we've been able to find the perfect services for all our events."
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="border w-12 h-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="@username" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Sarah Miller</p>
                  <p className="text-sm text-gray-600">Wedding Planner, Blissful Beginnings</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a vendor, this platform has been a game-changer for my business. The exposure and booking opportunities have significantly increased my revenue and client base."
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="border w-12 h-12">
                  <AvatarImage src="/placeholder-user.jpg" alt="@username" />
                  <AvatarFallback>KS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Karen Sato</p>
                  <p className="text-sm text-gray-600">Caterer, Gourmet Delights</p>
                </div>
              </div>
              <p className="text-gray-600">
                "This platform has been a game-changer for my catering business. The ability to showcase my services, manage bookings, and get paid securely has been a huge time-saver and has helped me grow my business significantly."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to Showcase Your Services?
            </h2>
            <p className="max-w-[600px] mx-auto text-gray-600 md:text-xl">
              Join our platform and start connecting with event organizers today. It's free to sign up and list your services.
            </p>
            <Link to="/vendor/dashboard">
              <button className="w-full max-w-[300px] bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600">
                Post A Service !
              </button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-600">&copy; 2024 Acme Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline">
            Terms of Service
          </Link>
          <Link to="#" className="text-xs hover:underline">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default VendorHomePage;

const Avatar = ({ className, children }) => (
  <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>
);

const AvatarImage = ({ src, alt }) => <img src={src} alt={alt} className="w-full h-full object-cover" />;
const AvatarFallback = ({ children }) => <div className="flex items-center justify-center w-full h-full bg-gray-200">{children}</div>;

// Icons
const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const InfoIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const ListIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);

const PowerIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-power"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
);

const UsersIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const WalletIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);
