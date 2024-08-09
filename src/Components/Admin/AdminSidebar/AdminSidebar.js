import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import NotificationModal from "../AdminNotificationModal/AdminNotificationModal";
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ children }) => {
  const dispatch = useDispatch();
  const authentication_user = useSelector(
    (state) => state.authentication_user
  );
  const user_basic_details = useSelector((state) => state.user_basic_details);

  const [isModalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate()

  
  const logout = () => {
    localStorage.clear();
    dispatch(
      set_Authentication({
        name: null,
        isAuthenticated: false,
        isAdmin: false
      })
    );
    navigate('/admin/login');
  };

  const toggleModal = () => setModalOpen(!isModalOpen);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/superadmin/vendor-requests"); // Replace with your API endpoint
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching vendor requests:", error);
    }
  };

  const handleAccept = async (vendorId) => {
    try {
      await axios.post(`/superadmin/vendor-requests/${vendorId}/accept/`); // Replace with your accept endpoint
      // Update UI by removing the accepted vendor
      setNotifications(notifications.filter((vendor) => vendor.id !== vendorId));
    } catch (error) {
      console.error("Error accepting vendor:", error);
    }
  };

  const handleReject = async (vendorId) => {
    try {
      await axios.post(`/superadmin/vendor-requests/${vendorId}/reject/`); // Replace with your reject endpoint
      // Update UI by removing the rejected vendor
      setNotifications(notifications.filter((vendor) => vendor.id !== vendorId));
    } catch (error) {
      console.error("Error rejecting vendor:", error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch when component mounts

    const interval = setInterval(() => {
      fetchNotifications(); // Periodically fetch notifications
    }, 60000); // Fetch every 60 seconds (adjust as needed)

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div>
      <div className="h-screen w-full bg-white relative flex overflow-hidden">
        <aside className="h-full w-16 flex flex-col space-y-10 items-center justify-center relative bg-gray-800 text-white">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white">
            <img
              src="https://cdn-icons-png.flaticon.com/256/609/609803.png"
              alt="icon"
            />
          </div>

          <div className="h-10 w-10 flex justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white">
            <Link to="/admin/managers">
              <img
                src="https://cdn-icons-png.flaticon.com/256/4205/4205906.png"
                alt="managers"
              />
            </Link>
          </div>

          <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white">
            <Link to="/admin/users">
              <img
                src="https://cdn-icons-png.flaticon.com/256/3177/3177440.png"
                alt="users"
              />
            </Link>
          </div>

          <div className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white">
            <Link to="/admin/events">
              <img
                src="https://cdn-icons-png.flaticon.com/256/3269/3269019.png"
                alt="events"
              />
            </Link>
          </div>


          <div onClick={logout} className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white">
            <img src='https://cdn-icons-png.flaticon.com/256/16395/16395630.png' alt="Logout"/>
          </div>
        </aside>
   

        <div className="w-full h-full flex flex-col justify-between">
          <header className="h-16 w-full flex items-center relative justify-end px-5 space-x-10 bg-gray-800">
            <div className="flex items-center space-x-4 text-white">
              <div className="relative">
                <button
                  onClick={toggleModal}
                  className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none"
                >
                  🔔
                </button>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-1 inline-block w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                    <p className="ml-1">{notifications.length}</p>
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                {authentication_user.isAdmin ? (
                  <>
                    <div className="text-md font-medium">
                      {user_basic_details.name}
                    </div>
                    <div className="text-sm font-regular">SuperUser</div>
                  </>
                ) : (
                  <div className="text-md font-medium">Unknown</div>
                )}
              </div>

              <div className="h-10 w-10 rounded-full cursor-pointer bg-gray-200 border-2 border-blue-400"></div>
            </div>
          </header>

          <main className="max-w-full h-full flex relative overflow-y-hidden overflow-x-hidden">
            <div className="h-full w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-max gap-4 overflow-y-scroll">
              {children}
            </div>
          </main>
        </div>
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        notifications={notifications}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
    </div>
  );
};

export default AdminSidebar;
