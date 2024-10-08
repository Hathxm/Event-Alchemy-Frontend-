import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import NotificationModal from '../NotificationModal/NotificationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home, Wrench, MapPin, MessageCircle, Users, LogOut, Bell,Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerSidebar = ({ children, manager_id }) => {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const user_basic_details = useSelector(state => state.user_basic_details);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const logout = () => {
    localStorage.clear();
    dispatch(
      set_Authentication({
        name: null,
        isAuthenticated: false,
        isAdmin: false
      })
    );
    navigate('/manager/login');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <div className="h-screen w-full bg-white relative flex overflow-hidden">
        <aside className="h-full w-16 flex flex-col space-y-10 items-center justify-center relative bg-blue-400 text-white">
          <NavLink 
            to="/manager/dashboard"
            className={({ isActive }) => 
              `h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white ${
                isActive ? 'text-gray-800 bg-white' : 'text-gray-800'
              }`
            }
          >
            <Home className="h-6 w-6" />
          </NavLink>

          <NavLink 
            to="/manager/services"
            className={({ isActive }) => 
              `h-10 w-10 flex justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white ${
                isActive ? 'text-gray-800 bg-white' : 'text-gray-800'
              }`
            }
          >
            <Wrench className="h-6 w-6" />
          </NavLink>

          <NavLink 
            to="/manager/locations"
            className={({ isActive }) => 
              `h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white ${
                isActive ? 'text-gray-800 bg-white' : 'text-gray-800'
              }`
            }
          >
            <MapPin className="h-6 w-6" />
          </NavLink>

          <NavLink 
            to="/manager/chat"
            className={({ isActive }) => 
              `h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white ${
                isActive ? 'text-gray-800 bg-white' : 'text-gray-800'
              }`
            }
          >
            <MessageCircle className="h-6 w-6" />
          </NavLink>

          <NavLink 
            to="/manager/vendors"
            className={({ isActive }) => 
              `h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white ${
                isActive ? 'text-gray-800 bg-white' : 'text-gray-800'
              }`
            }
          >
            <Users className="h-6 w-6" />
          </NavLink>

         

          <div
            onClick={logout} 
            className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-red-500 hover:duration-300 hover:ease-linear focus:bg-red-500 text-red-500"
          >
            <LogOut className="h-6 w-6" />
          </div>
        </aside>

        <div className="w-full h-full flex flex-col justify-between">
        <header className="h-16 w-full flex items-center justify-end px-5 space-x-10 bg-blue-400">
  <div className="flex items-center space-x-4 text-white">
    <div className="relative">
      <button
        onClick={toggleModal}
        className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none"
      >
        <Bell />
      </button>
      {notifications.length > 0 && (
        <span className="absolute top-0 right-1 inline-block w-4 h-4 text-xs text-white bg-red-500 rounded-full">
          <p className="ml-1">{notifications.length}</p>
        </span>
      )}
    </div>

    {authentication_user.isAdmin && (
      <> 
      <Link to="/manager/profile">
        <div className="h-10 w-10 rounded-full cursor-pointer bg-gray-200 border-2 border-blue-400">
          <img
               src={user_basic_details.profile_pic ? user_basic_details.profile_pic :'https://cdn-icons-png.flaticon.com/256/4205/4205906.png'}
            alt="Profile"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </Link>

<div className="flex flex-col items-end">
  
      
<div className="text-md font-medium">{user_basic_details.name}</div>
<div className="text-md font-medium">{user_basic_details.manager_type} Manager</div>

</div>
</>
    )}

  
  </div>
</header>


          <main className="max-w-full h-full flex relative overflow-y overflow-x-hidden">
            <div className="h-full w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Notification Modal */}
      {isModalOpen && <NotificationModal onClose={toggleModal} user_id={manager_id} />}
    </div>
  );
};

export default ManagerSidebar;
