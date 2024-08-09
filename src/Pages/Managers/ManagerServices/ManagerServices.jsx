// Services.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AdminTableComponent from '../../../Components/Admin/AdminTable/AdminTableComponent';
import { useSelector } from 'react-redux';
import AddServicesForm from './AddServiceForm';
import { toast } from 'react-toastify';
const BASEUrl = process.env.REACT_APP_BASE_URL

const Services = () => {
    const [serviceData, setServiceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: 'All', search: '' });
    const managerDetails = useSelector(state => state.user_basic_details);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                console.log(managerDetails.manager_type);
                const response = await axios.post(`${BASEUrl}managers/event_services`, {
                    'manager_type': managerDetails.manager_type,
                });

                if (response.status === 200) {
                    setServiceData(response.data);
                } else {
                    console.error('API response error:', response.data);
                }
            } catch (error) {
                console.error('Error fetching service data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (managerDetails.manager_type) {
            fetchServices();
        }
    }, [managerDetails.manager_type]);

    
    const toggleServiceStatus = async (serviceId, currentStatus) => {
        try {
            const newStatus = !currentStatus; // Toggle the status
            const response = await axios.patch(`${BASEUrl}managers/serviceManagement/`, { serviceId: serviceId, is_deleted: newStatus });
    
            if (response.status === 200) {
                setServiceData(prevServiceData =>
                    prevServiceData.map(service =>
                        service.id === serviceId ? { ...service, is_deleted: newStatus } : service
                    )
                );
                toast.success(newStatus ? 'Service blocked successfully!' : 'Service unblocked successfully!');
            } else {
                toast.error('Failed to update service status.');
            }
        } catch (error) {
            console.error('Error toggling service status:', error);
            toast.error('An error occurred while updating the service status.');
        }
    };


const addService = async (newService) => {
    try {
        const res = await axios.post(`${BASEUrl}managers/add_service`, newService);

        if (res.status === 201) {
            setServiceData(res.data);
            toast.success('Service added successfully!');
        } else {
            toast.error('Failed to add service. Please try again.');
        }
    } catch (error) {
        console.error('Error adding service:', error);
        toast.error('An error occurred while adding the service.');
    }
};


    const columns = useMemo(() => [
        {
            header: 'Service',
            accessor: (item) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                        <img
                            className="w-full h-full rounded-full"
                            src={item.image ? `${item.image}` : 'https://cdn-icons-png.flaticon.com/256/11815/11815789.png'}
                            alt=""
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">{item.service_name || 'Unknown Service'}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Type',
            accessor: (item) => (<p className="text-gray-900 whitespace-no-wrap">{item.service_name}</p>)
        },
        {
            header: 'Created at',
            accessor: (item) => new Date(item.created_at).toLocaleDateString(),
        },
        {
            header: 'Status',
            accessor: (item) => (
                <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${item.is_deleted ? 'text-red-900' : 'text-green-900'}`}>
                    {item.is_deleted ? (
                        <>
                            <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                            <span className="relative">Blocked</span>
                        </>
                    ) : (
                        <>
                            <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                            <span className="relative">Active</span>
                        </>
                    )}
                </span>
            ),
        },
        {
            header: 'Action',
            accessor: (item) => (
                <button
                    onClick={() => toggleServiceStatus(item.id, item.is_deleted)}
                    className={`px-4 py-2 rounded-lg ${item.is_deleted ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} text-white`}
                >
                    {item.is_deleted ? 'Unblock' : 'Block'}
                </button>
            ),
        }
    ], [toggleServiceStatus]);

    const filteredData = useMemo(() => {
        return serviceData.filter((service) => {
            const matchesStatus = filter.status === 'All' || (filter.status === 'Active' ? service.is_active : !service.is_active);
            const matchesSearch = service.service_name?.toLowerCase().includes(filter.search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [serviceData, filter]);

    return (
        <div className="flex-grow flex justify-center items-center">
            <div className="container mx-auto px-4 sm:px-7">
                <div className="py-8">
                    <div>
                        <h2 className="text-2xl font-semibold leading-tight">Event Services</h2>
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
                        <AddServicesForm addService={addService} />
                        </div>
                    </div>
                </div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                        <AdminTableComponent data={filteredData} columns={columns} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
