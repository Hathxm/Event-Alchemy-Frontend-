import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { set_Authentication } from '../../../Redux/AuthenticationSlice/AuthenticationSlice';
import { Menu, X, LogOut, MessageCircle, Calendar } from 'lucide-react';

function Navbar({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const authentication_user = useSelector((state) => state.authentication_user);
    const user_basic_details = useSelector((state) => state.user_basic_details);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        dispatch(
            set_Authentication({
                name: null,
                isAuthenticated: false,
                isAdmin: false,
            })
        );

        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 relative">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                                onClick={toggleMobileMenu}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>

                        {/* Centered Logo */}
                        <div className="flex flex-1 items-center justify-center sm:justify-between">
                            <div className="hidden sm:flex space-x-4">
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium no-underline'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium no-underline'
                                    }
                                    aria-current="page"
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium no-underline'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium no-underline'
                                    }
                                >
                                    About
                                </NavLink>
                                <NavLink
                                    to="/contact"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium no-underline'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium no-underline'
                                    }
                                >
                                    Contact
                                </NavLink>
                            </div>
                            <div className="flex flex-shrink-0 items-center mx-4">
                                <img
                                    className="h-20 w-auto"
                                    src="https://event-alchemy.s3.eu-north-1.amazonaws.com/Static_Medias/companylogo2.svg"
                                    alt="Your Company"
                                    style={{ filter: 'invert(100%)' }}
                                />
                            </div>
                            <div className="hidden sm:flex items-center space-x-5">
                                {authentication_user.isAuthenticated &&
                                !authentication_user.isAdmin &&
                                !authentication_user.isSuperAdmin ? (
                                    <>
                                        <NavLink
                                            to="/chat"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'relative rounded-full bg-gray-700 p-1 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                                    : 'relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                            }
                                        >
                                            <span className="sr-only">Chat</span>
                                            <MessageCircle className="h-6 w-6" />
                                        </NavLink>

                                        <NavLink
                                            to="/bookings"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'relative rounded-full bg-gray-700 p-1 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                                    : 'relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                            }
                                        >
                                            <span className="sr-only">Bookings</span>
                                            <Calendar className="h-6 w-6" />
                                        </NavLink>

                                        <div className="relative">
                                            <NavLink to="/userprofile">
                                                <button
                                                    type="button"
                                                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                                    id="user-menu-button"
                                                    aria-haspopup="true"
                                                >
                                                    <span className="sr-only">Open user menu</span>
                                                    {authentication_user.isAuthenticated &&
                                                        !authentication_user.isAdmin &&
                                                        !authentication_user.isSuperAdmin && (
                                                            <img
                                                                className="h-8 w-8 rounded-full"
                                                                src={user_basic_details.profile_pic ? user_basic_details.profile_pic : 'https://cdn-icons-png.flaticon.com/256/3177/3177440.png'}
                                                                alt=""
                                                            />
                                                        )}
                                                </button>
                                            </NavLink>
                                        </div>

                                        <button
                                            type="button"
                                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            onClick={logout}
                                        >
                                            <span className="sr-only">Logout</span>
                                            <LogOut className="h-6 w-6" />
                                        </button>
                                    </>
                                ) : (
                                    <NavLink to="/login" className="text-white no-underline">
                                        Signup | Login
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden" id="mobile-menu">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium no-underline'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium no-underline'
                                }
                                aria-current="page"
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium no-underline'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium no-underline'
                                }
                            >
                                About
                            </NavLink>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium no-underline'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium no-underline'
                                }
                            >
                                Contact
                            </NavLink>
                            <div className="flex justify-between items-center pt-2">
                                {authentication_user.isAuthenticated &&
                                !authentication_user.isAdmin &&
                                !authentication_user.isSuperAdmin ? (
                                    <>
                                        <NavLink
                                            to="/chat"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'relative rounded-full bg-gray-700 p-1 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                                    : 'relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                            }
                                        >
                                            <span className="sr-only">Chat</span>
                                            <MessageCircle className="h-6 w-6" />
                                        </NavLink>

                                        <NavLink
                                            to="/bookings"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? 'relative rounded-full bg-gray-700 p-1 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                                    : 'relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                            }
                                        >
                                            <span className="sr-only">Bookings</span>
                                            <Calendar className="h-6 w-6" />
                                        </NavLink>
                                    </>
                                ) : (
                                    <NavLink
                                        to="/login"
                                        className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium no-underline"
                                    >
                                        Signup | Login
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            <main>{children}</main>
        </>
    );
}

export default Navbar;
