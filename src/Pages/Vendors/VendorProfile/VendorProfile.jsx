import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { set_user_basic_details } from '../../../Redux/UserDetails/UserdetailsSlice';
import EditUserForm from '../../User/Profile/EditUserForm';
// import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const BASEUrl = process.env.REACT_APP_BASE_URL

const VendorProfile = () => {
    const baseURL = 'http://127.0.0.1:8000';
    const accessToken = localStorage.getItem('access');
    const dispatch = useDispatch();
    const user_basic_details = useSelector(state => state.user_basic_details);

    const [formState, setFormState] = useState({
        username: '',
        first_name: '',
        email: '',
        bio: '',
        profile_pic: null,
    });

  

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${BASEUrl}vendor/details`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            console.log('data fetched');

            setFormState({
                username: res.data.username,
                first_name: res.data.first_name,
                email: res.data.email,
                bio: res.data.bio,
                profile_pic: res.data.profile_pic,
            });

        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormState({ ...formState, profile_pic: e.target.files[0] });
    };

    const handleSubmit = async (e, updatedFormData, closeModal) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', updatedFormData.username);
        formData.append('first_name', updatedFormData.first_name);
        formData.append('email', updatedFormData.email);
        if (updatedFormData.profile_pic instanceof File) {
            formData.append('profile_pic', updatedFormData.profile_pic);
        }

        try {
            const response = await axios.patch(`${BASEUrl}vendor/updateprofile/`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            dispatch(
                set_user_basic_details({
                    name: response.data.data.first_name,
                    profile_pic: response.data.data.profile_pic,
                    email: response.data.data.email,
                })
            );

            fetchUserData();  // Fetch updated data to reflect changes immediately

            toast.success(response.data.message, {
                position: "bottom-right",
                autoClose: 5000,
            });

            // Close the modal on successful update
            closeModal();

        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                // Display error messages as toasts
                Object.keys(errorData).forEach((key) => {
                    toast.error(`${errorData[key]}`, {
                        position: "bottom-right",
                        autoClose: 5000,
                    });
                });

            } else {
                console.error('Error:', error);
            }
        }
    };

    const handlePasswordResetRequest = async () => {
        try {
            await axios.post(`${BASEUrl}auth/password_reset`, { email: formState.email });
          
            toast.success('Password reset email sent. Please check your inbox.', {
                position: "bottom-right",
                autoClose: 5000,
            });
        } catch (error) {
            console.error('Error:', error);
         
            toast.error('Failed to send password reset email. Please try again.', {
                position: "bottom-right",
                autoClose: 5000,
            });
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [accessToken]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
            <div className="flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl bg-white dark:bg-gray-50 dark:text-gray-800">
                <img
                    src={formState.profile_pic ? `${user_basic_details.profile_pic}` : "https://source.unsplash.com/150x150/?portrait?3"}
                    alt="Profile"
                    className="w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square"
                />
                <div className="space-y-4 text-center divide-y dark:divide-gray-300">
                    <div className="my-2">
                        <h2 className="text-xl font-semibold sm:text-2xl">{user_basic_details.name}</h2>
                        <p className="text-xs sm:text-base dark:text-gray-600 break-words">{user_basic_details.email}</p>
                    </div>

                    <div className="flex justify-center pt-2">
                        <EditUserForm
                            userdata={formState}
                            handleInputChange={handleInputChange}
                            handleFileChange={handleFileChange}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
            <button onClick={handlePasswordResetRequest} className="mt-4 text-blue-500 hover:underline">Change password?</button>
       
        </div>
    );
};

export default VendorProfile;