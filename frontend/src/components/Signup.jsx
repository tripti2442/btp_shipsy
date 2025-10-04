import React, { useState } from 'react';
import { Navigate , Link ,useNavigate} from 'react-router-dom';
import { signup } from '../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [rollNo, setRollNo] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Basic password validation
    if (newPassword.length > 0 && newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    const signupData = {
      username,
      password,
      role,
      ...(role === 'student' && { rollNo }), // Include rollNo only if role is student
    };

    const dataPromise= signup(username, password, role, rollNo);

    dataPromise.then((data)=>{
      console.log(data.message);
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
 
      navigate("/studentdashboard");
    })

    console.log('Submitting:', signupData);
    // TODO: Add your API call logic here (e.g., axios.post(...))
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
                         focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="******************"
              className={`shadow appearance-none border ${
                passwordError ? 'border-red-500' : ''
              } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight 
                         focus:outline-none focus:shadow-outline`}
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs italic">{passwordError}</p>
            )}
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 
                         leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="student">Student</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Roll Number (only for students) */}
          {role === 'student' && (
            <div className="mb-4 transition-all duration-500 ease-in-out">
              <label htmlFor="rollNo" className="block text-gray-700 text-sm font-bold mb-2">
                Roll Number
              </label>
              <input
                id="rollNo"
                type="text"
                placeholder="e.g., 20F-1234"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                           leading-tight focus:outline-none focus:shadow-outline"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required={role === 'student'} // ✅ Required only if role is student
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 
                         rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
