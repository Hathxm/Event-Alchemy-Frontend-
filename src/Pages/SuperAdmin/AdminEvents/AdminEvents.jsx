import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AdminTableComponent from '../../../Components/Admin/AdminTable/AdminTableComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS for toast notifications
import Form from './AddEventsForm';
import AdminPageHeader from '../../../Components/Admin/AdminPageHeader/AdminPageHeader';
const BASEUrl = process.env.REACT_APP_BASE_URL



const AdminEvents = () => {
  const [eventData, setEventData] = useState([]);
  const [filter, setFilter] = useState({ status: 'All', search: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASEUrl}superadmin/eventmanagement/`, {
          params: { page, search: filter.search || undefined },
        });
        if (Array.isArray(response.data)) {
          setEventData(response.data);
          setTotalPages(1);
        } else {
          setEventData(response.data.results || []);
          const pageSize = (response.data.results || []).length || 10;
          setTotalPages(Math.max(1, Math.ceil((response.data.count || 0) / pageSize)));
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchData();
  }, [page, filter.search]);

  const addEvent = async (newEvent) => {
    try {
      const formData = new FormData();
      formData.append('eventname', newEvent.name);
      formData.append('description', newEvent.description);
      if (newEvent.image) {
        formData.append('image', newEvent.image);
      }

      const response = await axios.post(`${BASEUrl}superadmin/eventmanagement/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setEventData(response.data);

      // Show success toast
      toast.success('Event created successfully!');
    } catch (error) {
      console.error(error);

      // Show error toast
      toast.error('Failed to create event. Please try again.');
    }
  };


  const toggleEventStatus = async (eventId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.patch(`${BASEUrl}superadmin/eventmanagement/`, { eventId: eventId, is_deleted: newStatus });

      // Update the eventData state
      setEventData(prevEventData =>
        prevEventData.map(event =>
          event.id === eventId ? { ...event, is_deleted: newStatus } : event
        )
      );

      // Show success toast
      toast.success(`Event has been ${newStatus ? 'deleted' : 'restored'} successfully.`);
    } catch (error) {
      console.error('Error toggling event status:', error);
      // Show error toast
      toast.error('Failed to toggle event status.');
    }
  };

  const columns = useMemo(() => [
    {
      header: 'Event Name',
      accessor: (item) => item.name
    },
    {
      header: 'Services',
      accessor: (item) => item.services ? item.services.join(', ') : 'N/A',
    },
    {
      header: 'Created at',
      accessor: (item) => new Date(item.created_at).toLocaleDateString()
    },
    {
      header: 'Status',
      accessor: (item) => (
        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${item.is_deleted ? 'text-red-900' : 'text-green-900'}`}>
          {item.is_deleted ? (
            <>
              <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
              <span className="relative">Deleted</span>
            </>
          ) : (
            <>
              <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
              <span className="relative">Active</span>
            </>
          )}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (item) => (
        <button
          onClick={() => toggleEventStatus(item.id, item.is_deleted)}
          className={`px-4 py-2 rounded-lg ${item.is_deleted ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} text-white`}
        >
          {item.is_deleted ? 'Restore' : 'Delete'}
        </button>
      ),
    }
  ], []);

  const filteredData = useMemo(() => {
    return eventData.filter(event => {
      const matchesSearch = event.name && event.name.toLowerCase().includes(filter.search.toLowerCase());
      return matchesSearch;
    });
  }, [eventData, filter]);

  return (
    <div className="flex-grow flex justify-center items-center">
  
      <div className="container mx-auto px-4 sm:px-7">
        <AdminPageHeader
          title="Events"
          search={filter.search}
          onSearchChange={(value) => {
            setFilter({ ...filter, search: value });
            setPage(1);
          }}
          action={<Form addEvent={addEvent} />}
        />
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <AdminTableComponent
              data={filteredData}
              columns={columns}
              pagination={{ page, totalPages, onPageChange: setPage }}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminEvents;
