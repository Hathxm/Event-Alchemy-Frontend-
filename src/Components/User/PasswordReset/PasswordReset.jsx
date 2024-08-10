import React, { useState } from 'react';
import axios from 'axios';
const BASEUrl = process.env.REACT_APP_BASE_URL

const PasswordResetRequestForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASEUrl}auth/password_reset/`, { email });
            setMessage('Password reset email sent. Please check your inbox.');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to send password reset email. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-300">
            <div className="max-w-md p-6 bg-white rounded shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Send Reset Email
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-green-500">{message}</p>}
            </div>
        </div>
    );
};

export default PasswordResetRequestForm;
