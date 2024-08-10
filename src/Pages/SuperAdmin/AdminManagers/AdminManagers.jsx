import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AdminTableComponent from '../../../Components/Admin/AdminTable/AdminTableComponent';
import AddManagerForm from './AddManagerForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const BASEUrl = process.env.REACT_APP_BASE_URL


const AdminManagers = () => {
  const [userData, setUserData] = useState([]);
  const [filter, setFilter] = useState({ status: 'All', search: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASEUrl}superadmin/managersdetails/`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchData();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.patch(`${BASEUrl}superadmin/managermanagement`, { userId: userId, is_active: newStatus });
  
      // Update the userData state
      setUserData(prevUserData =>
        prevUserData.map(user =>
          user.id === userId ? { ...user, is_active: newStatus } : user
        )
      );
  
      // Show success toast
      toast.success(`User has been ${newStatus ? 'unblocked' : 'blocked'} successfully.`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      // Show error toast
      toast.error('Failed to toggle user status.');
    }
  };

  const addManager = async (newManager) => {
    try {
      // Send a POST request to add the new manager
      await axios.post('superadmin/addmanager/', newManager);
  
      // Fetch updated manager details
      const res = await axios.get(`${BASEUrl}superadmin/managersdetails/`);
      setUserData(res.data);
  
      // Display success toast notification
      toast.success('Manager added successfully!');
    } catch (error) {
      if (error.response && error.response.data) {
        // Display validation errors using toast
        Object.entries(error.response.data).forEach(([field, message]) => {
          toast.error(`${message}`);
        });
      } else {
        console.error('Error adding manager:', error);
        // Display generic error toast notification
        toast.error('An error occurred while adding the manager.');
      }
    }
  };

  const columns = useMemo(() => [
    {
      header: 'User',
      accessor: (item) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <img
              className="w-full h-full rounded-full"
              src={item.profile_pic ? `${item.profile_pic}` : 'https://cdn-icons-png.flaticon.com/256/4205/4205906.png'}
              alt=""
            />
          </div>
          <div className="ml-3">
            <a className="text-gray-900 whitespace-no-wrap"> <Link to={`/admin/manager-profile/${item.id}`}>{item.username}</Link></a>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: () => 'Admin',
    },
    {
      header: 'Created at',
      accessor: (item) => new Date(item.date_joined).toLocaleDateString(),
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
        <button
          onClick={() => toggleUserStatus(item.id, item.is_active)}
          className={`px-4 py-2 rounded-lg ${item.is_active ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white`}
        >
          {item.is_active ? 'Block' : 'Unblock'}
        </button>
      ),
    }
  ], [toggleUserStatus]);

  const filteredData = useMemo(() => {
    return userData.filter((user) => {
      const matchesStatus = filter.status === 'All' || (filter.status === 'Active' ? user.is_active : !user.is_active);
      const matchesSearch = user.username.toLowerCase().includes(filter.search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [userData, filter]);

  return (
    <div className="flex-grow flex justify-center items-center">
      <div className="container mx-auto px-4 sm:px-7">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Managers</h2>
          </div>
          <div className="my-2 flex sm:flex-row flex-col">
            <div className="relative">
              <input
                placeholder="Search"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
            <div className="ml-auto">
              <AddManagerForm addManager={addManager} />
            </div>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <AdminTableComponent data={filteredData} columns={columns} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminManagers;
