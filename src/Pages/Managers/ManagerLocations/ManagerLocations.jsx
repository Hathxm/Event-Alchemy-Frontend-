import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import Form from './AddVenuesForm';
import Editvenueform from './EditVenuesForm';
import { toast } from 'react-toastify';
const BASEUrl = process.env.REACT_APP_BASE_URL  


const ManagerLocations = () => {
  
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVenue, setEditingVenue] = useState(null); // State for editing venue
  const manager_details = useSelector((state) => state.user_basic_details);


  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.post(`${BASEUrl}managers/venues/`, {
          manager_type: manager_details.manager_type,
        });

        if (response.status === 200) {
          setLocations(response.data);
        } else {
          toast.error('Failed to fetch locations.');
        }
      } catch (error) {
        toast.error('Error fetching location data.');
      } finally {
        setLoading(false);
      }
    };

    if (manager_details.manager_type) {
      fetchLocations();
    }
  }, [manager_details.manager_type]);

  const addVenue = async (newVenue) => {
    try {
      const res = await axios.post(`${BASEUrl}managers/add-venue/`, newVenue, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 201) {
        setLocations(res.data);
        toast.success('Venue added successfully!');
      } else {
        toast.error('Failed to add venue. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while adding the venue.');
    }
  };

  const editVenue = async (newVenue) => {
    try {
      const res = await axios.patch(`${BASEUrl}managers/edit-venue/`, newVenue, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        setLocations(res.data);
        toast.success('Venue updated successfully!');
      } else {
        toast.error('Failed to update venue. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the venue.');
    }
  };

  const deleteVenue = async (venueId) => {
    try {
      const res = await axios.patch(`${BASEUrl}managers/delete-venue/`, { venue_id: venueId });
  
      if (res.status === 200) {
        // Toggle the local status of the venue
        setLocations(locations.map(location =>
          location.id === venueId
            ? { ...location, is_deleted: !location.is_deleted }
            : location
        ));
        toast.success('Venue status updated successfully!');
      } else {
        toast.error('Failed to update venue status. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while updating the venue status.');
    }
  };

  const generateRandomColor = () => {
    const colors = ['blue', 'gray', 'green'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center text-dark mb-8">Event Venues</h1>
      <div className="d-flex justify-content-end mb-3">
        <Form addVenue={addVenue} managerType={manager_details.manager_type} />
      </div>
      {locations.map((location, index) => (
        <Card
          key={location.id} // Use a unique key for each item
          color={generateRandomColor()}
          date={location.event_type_name}
          location={location.location_name}
          link={location.venue_name}
          imageSrc={location.image1}
          isLight={true}
          align={index % 2 === 0 ? 'left' : 'right'}
          description={location.description}
          venue_id={location.id}
          venueData={location}
          onEdit={() => setEditingVenue(location)} // Set editing venue
          onDelete={() => deleteVenue(location.id)} // Add delete function
        />
      ))}
      {editingVenue && (
        <Editvenueform
          venueData={editingVenue}
          editVenue={editVenue}
          onClose={() => setEditingVenue(null)} // Close the form
          managerType={manager_details.manager_type}
        />
      )}
    </div>
  );
};

const Card = ({ color, date, location, link, imageSrc, isLight = false, align = 'left', description, venue_id, venueData, onEdit, onDelete }) => {
  const baseClass = isLight ? 'bg-gray-200 text-black' : 'bg-gray-800 text-white';
  const titleClass = `text-${color}-500 group-hover:text-${color}-700`;
  const barClass = `bg-${color}-500`;

  // Determine button classes based on venue status
  const buttonClass = venueData.is_deleted
    ? 'text-white bg-green-500 hover:bg-green-600'
    : 'text-white bg-red-500 hover:bg-red-600';

  return (
    <article className={`postcard flex flex-col md:flex-row mb-8 rounded-lg shadow-md overflow-hidden relative ${baseClass} group ${align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}  `}>
      <div className="w-full md:w-1/4 relative overflow-hidden">
        <div className="relative h-0 pb-56 md:pb-0 md:h-full">
          <img src={imageSrc} alt="Image Title" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-110" />
        </div>
      </div>
      <div className="p-6 flex flex-col justify-between w-full md:w-3/4">
        <h1 className={`text-xl font-semibold mb-2 ${titleClass}`}>
          <a href="#" className="hover:no-underline relative">
            {link}
            <div className={`h-1 w-12 rounded-sm transition-all duration-300 mt-1 group-hover:w-1/5 ${barClass}`}></div>
          </a>
        </h1>
        <div className="text-sm mb-2">
          <time dateTime={date}>
            <i className="fas fa-calendar-alt mr-2"></i>
            {date}
          </time>
        </div>
        <div className="text-justify overflow-hidden mb-4">{description}</div>
        <ul className="flex flex-wrap justify-center md:justify-start">
          <li className="text-xs bg-gray-600 bg-opacity-40 rounded-md py-1 px-3 mr-2 mb-2">{location}</li>

          <li className="text-xs mb-1">
            <button onClick={onEdit} className="text-white bg-blue-500 hover:bg-blue-600 rounded-md py-1 px-2">
              Edit Venue
            </button>
          </li>
          <li className="text-xs mb-1">
            <button onClick={onDelete} className={`rounded-md py-1 px-2 ml-2 ${buttonClass}`}>
              {venueData.is_deleted ? 'Restore Venue' : 'Delete Venue'}
            </button>
          </li>
        </ul>
      </div>
    </article>
  );
};

export default ManagerLocations;
