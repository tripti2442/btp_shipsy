import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [rollNo, setRollNo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginData = { username, password, role, ...(role === 'student' && { rollNo }) };

        const dataPromise = login(username, password, role, rollNo);
        dataPromise.then((data) => {
            console.log(data.message);

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }


            navigate("/studentdashboard");
        })

        console.log('Logging in with:', loginData);


        // TODO: Add your API call for authentication
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Role Selector */}
                    <div className="mb-4">
                        <label
                            htmlFor="role"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="student">Student</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Roll Number (only for students) */}
                    {role === 'student' && (
                        <div className="mb-4">
                            <label
                                htmlFor="rollNo"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Roll Number
                            </label>
                            <input
                                id="rollNo"
                                type="text"
                                placeholder="Enter your roll number"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
