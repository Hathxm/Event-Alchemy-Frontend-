import React, { useState, useEffect } from 'react';

const EditVendorForm = ({ userdata, handleInputChange, handleFileChange, handleSubmit, errors }) => {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    email: '',
    profile_pic: null,
  });

  useEffect(() => {
    if (userdata) {
      setFormData({
        username: userdata.username || '',
        first_name: userdata.first_name || '',
        email: userdata.email || '',
        profile_pic: userdata.profile_pic || null,
      });
    }
  }, [userdata]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <div className="w-auto h-auto">
        <div className="flex-1 h-full">
          <button
            className="flex items-center justify-center flex-1 h-full p-2 bg-green-500 text-white shadow rounded-lg"
            onClick={toggleModal}
          >
            <div className="relative">
              <img src="https://cdn-icons-png.flaticon.com/256/2985/2985043.png" className="h-5 w-5" alt="Edit" />
            </div>
          </button>
        </div>
      </div>

      {showModal && (
        <div
          id="crud-modal"
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
        >
          <div className="relative max-h-screen mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900 flex-grow text-center">Edit Details</h3>
              <div
                onClick={toggleModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              >
                <img src="https://cdn-icons-png.flaticon.com/256/6276/6276642.png" className="w-full h-full" alt="Close" />
              </div>
            </div>

            <form className="p-4 md:p-6"  onSubmit={(e) => {
                setShowModal(false);
                handleSubmit(e, formData);
               
              }}>
              <div className="grid gap-2 mb-2 grid-cols-2">
                <div>
                  <label>Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      handleInputChange(e);
                    }}
                    className={`input-primary w-full bg-gray-200 ${errors.username ? 'border-red-500' : ''}`}
                  />
                  {errors.username && <span className="text-red-500">{errors.username}</span>}
                </div>

                <div>
                  <label>First Name</label>
                  <input
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={(e) => {
                      setFormData({ ...formData, first_name: e.target.value });
                      handleInputChange(e);
                    }}
                    className={`input-primary w-full bg-gray-200 ${errors.first_name ? 'border-red-500' : ''}`}
                  />
                  {errors.first_name && <span className="text-red-500">{errors.first_name}</span>}
                </div>

                <div>
                  <label>Email</label>
                  <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      handleInputChange(e);
                    }}
                    className={`input-primary w-full bg-gray-200 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <span className="text-red-500">{errors.email}</span>}
                </div>

                <div>
                  <label>Profile Pic</label>
                  <input
                    name="profile_pic"
                    type="file"
                    onChange={(e) => {
                      setFormData({ ...formData, profile_pic: e.target.files[0] });
                      handleFileChange(e);
                    }}
                    className="file-input file-input-primary w-full bg-gray-200"
                  />
                  {errors.profile_pic && <span className="text-red-500">{errors.profile_pic}</span>}
                </div>

                <div className="col-span-2">
                  <button
                    type="submit"
                    className="mt-2 text-white w-full text-lg bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg px-5 py-2.5"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditVendorForm;