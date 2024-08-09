import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AdminTableComponent from '../../../Components/Admin/AdminTable/AdminTableComponent';
import { useSelector } from 'react-redux';
import ChatComponent from '../../../Components/User/ChatComponent/ChatComponent';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles
const BASEUrl = process.env.REACT_APP_BASE_URL

const ManagerVendors = () => {
    const [vendorData, setVendorData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: 'All', search: '' });
    const managerDetails = useSelector(state => state.user_basic_details);
    const [chatData, setChatData] = useState(null);
    const [managerId, setManagerId] = useState(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await axios.post(`${BASEUrl}managers/vendor_detail`, 
                {
                    manager_name: managerDetails.name,
                });

                if (response.status === 200) {
                    const data = response.data;
                    setVendorData(data.data);  // Set the vendor data
                    setManagerId(data.manager_id); // Set the manager ID
                } else {
                    console.error('API response error:', response.data);
                }
            } catch (error) {
                console.error('Error fetching vendor data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (managerDetails.name) {
            fetchVendors();
        }
    }, [managerDetails.name]);

    const toggleVendorStatus = async (vendorId, currentStatus) => {
        try {
            const newStatus = !currentStatus;  // Toggle status
            const response = await axios.patch(`${BASEUrl}managers/vendorServiceManagement`, { vendorId, is_deleted: newStatus });

            if (response.status === 200) {
                setVendorData(prevVendorData =>
                    prevVendorData.map(vendor =>
                        vendor.id === vendorId ? { ...vendor, is_deleted: newStatus } : vendor
                    )
                );
                toast.success(newStatus ? 'Vendor Service blocked successfully!' : 'Vendor Service unblocked successfully!');
            } else {
                toast.error('Failed to update vendor status.');
            }
        } catch (error) {
            console.error('Error toggling vendor status:', error);
            toast.error('An error occurred while updating vendor status.');
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Vendor',
            accessor: (item) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                        <img
                            className="w-full h-full rounded-full"
                            src={item.service_image ? `${item.service_image}` : 'https://cdn-icons-png.flaticon.com/256/11815/11815789.png'}
                            alt=""
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">{item.vendor_name || 'Unknown Vendor'}</p>
                    </div>
                </div>
            ),
        },
        { 
            header: 'Service',
            accessor: (item) => (<p className="text-gray-900 whitespace-no-wrap">{item.service_name}</p>)
        },
        {
            header: 'Connect',
            accessor: (item) => (
                <button
                    onClick={() => handleConnectClick(item.vendor_id, item.vendor_name)}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white"
                >
                    Connect
                </button>
            ),
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
                    onClick={() => toggleVendorStatus(item.id, item.is_deleted)}
                    className={`px-4 py-2 rounded-lg ${item.is_deleted ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} text-white`}
                >
                    {item.is_deleted ? 'Unblock' : 'Block'}
                </button>
            ),
        }
    ], [toggleVendorStatus]);

    const filteredData = useMemo(() => {
        return vendorData.filter((vendor) => {
            const matchesStatus = filter.status === 'All' || (filter.status === 'Active' ? !vendor.is_deleted : vendor.is_deleted);
            const matchesSearch = vendor.service_name?.toLowerCase().includes(filter.search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [vendorData, filter]);

    const handleConnectClick = (vendor_id, vendor_name) => {
        if (managerId) {
            setChatData({
                userId: vendor_id,
                managerId: managerId,
                username: vendor_name,
                sendername: managerDetails.name,
            });
        } else {
            console.error('Manager ID is not set.');
        }
    };

    return (
        <div className="flex-grow flex justify-center items-center">
            <div className="container mx-auto px-4 sm:px-7">
                <div className="py-8">
                    <div>
                        <h2 className="text-2xl font-semibold leading-tight">Vendor Services Available</h2>
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
                    </div>
                </div>
                {chatData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-4 rounded-lg w-full max-w-3xl">
                            <div className="flex justify-end">
                                <button 
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => setChatData(null)}
                                >
                                    Close
                                </button>
                            </div>
                            <ChatComponent 
                                userId={chatData.userId} 
                                managerId={chatData.managerId} 
                                username={chatData.username} 
                                sendername={chatData.sendername}
                            />
                        </div>
                    </div>
                )}
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

export default ManagerVendors;
