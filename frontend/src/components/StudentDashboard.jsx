import React, { useState, useEffect } from 'react';
import { fetch_supervisors } from '../services/api';
import { fetch_students } from '../services/api';
import { create_group } from '../services/api';
import { fetch_group } from '../services/api';



// --- Placeholder Components ---
const GroupDetails = () => {
    const [groupData, setGroupData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getGroupData = async () => {
            try {
                const data = await fetch_group();
                if (data.existingGroup) {
                    setGroupData(data.existingGroup);
                } else {
                    setError('No group found for the current student.');
                }
            } catch (err) {
                console.error('Failed to fetch group data:', err);
                setError('Error fetching group data.');
            } finally {
                setLoading(false);
            }
        };

        getGroupData();
    }, []);

    if (loading) {
        return <p>Loading group details...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Group Details</h2>
            <div className="mt-4">
                <p>
                    <span className="font-semibold">Project Title:</span> {groupData.title || 'N/A'}
                </p>
                <p>
                    <span className="font-semibold">Supervisor:</span> {groupData.supervisor_id?.username || 'N/A'}
                </p>
                <p className="font-semibold mt-2">Members:</p>
                <ul className="list-disc list-inside text-gray-600">
                    {groupData.members && groupData.members.length > 0 ? (
                        groupData.members.map(member => (
                            <li key={member._id}>
                                {member.username} ({member.roll_no || '-'})
                            </li>
                        ))
                    ) : (
                        <li>No members found</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

const CreateGroup = () => {
    const [title, setTitle] = useState('');
    const [members, setMembers] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [supervisorSearch, setSupervisorSearch] = useState('');
    const [allSupervisors, setAllSupervisors] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);

    // On mount, add logged-in student as default member
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser && loggedInUser.role === 'student') {
            setMembers([{
                _id: loggedInUser.id,
                username: loggedInUser.username,
                roll_no: loggedInUser.roll_no
            }]);
        }
    }, []);

    // Fetch unallocated students
    useEffect(() => {
        const fetchStudentsData = async () => {
            try {
                const data = await fetch_students();
                setAllStudents(data.students);
            } catch (err) {
                console.error('Failed to fetch students:', err);
            }
        };
        fetchStudentsData();
    }, []);

    // Fetch supervisors
    useEffect(() => {
        const fetchSupervisorsData = async () => {
            try {
                const data = await fetch_supervisors();
                setAllSupervisors(data.supervisors);
            } catch (err) {
                console.error('Failed to fetch supervisors:', err);
            }
        };
        fetchSupervisorsData();
    }, []);

    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    const filteredStudents = allStudents.filter(student =>
        !members.find(m => m._id === student._id) &&
        (student.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
            student.roll_no.toLowerCase().includes(studentSearch.toLowerCase()))
    );

    // Filter supervisors based on search input
    const filteredSupervisors = allSupervisors.filter(s =>
        s.username.toLowerCase().includes(supervisorSearch.toLowerCase())
    );

    const handleAddMember = (student) => {
        if (members.length >= 3) {
            alert("You can only add 2 more members (max 3 including yourself).");
            return;
        }
        setMembers([...members, student]);
    };

    const handleRemoveMember = (studentId) => {
        setMembers(members.filter(m => m._id !== studentId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !selectedSupervisor || members.length === 0) {
            alert('Please fill all fields and select members & supervisor.');
            return;
        }

        try {
            const data = await create_group({
                title,
                supervisor_id: selectedSupervisor._id,
                members: members.map(m => m._id)
            });

            console.log(data.message);
            alert(data.message);

            // Reset form
            setTitle('');
            setMembers([JSON.parse(localStorage.getItem('user'))]); // keep logged-in student
            setSelectedSupervisor(null);
            setStudentSearch('');
            setSupervisorSearch('');
        } catch (err) {
            console.error('Failed to create group:', err);
            alert(err.response?.data?.message || 'Error creating group');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a New Group</h2>
            <form onSubmit={handleSubmit}>
                {/* Project Title */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Project Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter project title"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                {/* Student Search */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Add Members</label>
                    <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Search by name or roll number"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline mb-2"
                    />
                    <ul className="max-h-40 overflow-y-auto border rounded p-2">
                        {filteredStudents.map(student => (
                            <li key={student._id} className="flex justify-between items-center py-1 hover:bg-gray-100">
                                <span>{student.username} ({student.roll_no})</span>
                                <button type="button" onClick={() => handleAddMember(student)} className="text-blue-500 hover:underline">
                                    Add
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Selected Members */}
                {members.length > 0 && (
                    <div className="mb-4">
                        <p className="font-semibold">Selected Members: ({members.length}/3)</p>
                        <ul>
                            {members.map(m => (
                                <li key={m._id} className="flex justify-between items-center py-1">
                                    <span>{m.username} ({m.roll_no}) {m._id === loggedInUser.id && '(You)'}</span>
                                    {m._id !== loggedInUser.id && (
                                        <button type="button" onClick={() => handleRemoveMember(m._id)} className="text-red-500 hover:underline">
                                            Remove
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {members.length >= 3 && (
                            <p className="text-sm text-red-500 mt-2">
                                You’ve reached the maximum limit of 3 members.
                            </p>
                        )}
                    </div>
                )}

                {/* Supervisor Search */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Supervisor</label>
                    <input
                        type="text"
                        value={supervisorSearch}
                        onChange={(e) => setSupervisorSearch(e.target.value)}
                        placeholder="Search supervisor by name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline mb-2"
                    />
                    <ul className="max-h-40 overflow-y-auto border rounded p-2">
                        {filteredSupervisors.map(s => (
                            <li
                                key={s._id}
                                className="flex justify-between items-center py-1 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedSupervisor(s)}
                            >
                                {s.username} {selectedSupervisor?._id === s._id && '(Selected)'}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Create Group
                </button>
            </form>
        </div>
    );
};

const EvaluationResults = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Evaluation Results</h2>
        <p className="text-gray-600">
            Your group's evaluation marks and feedback will be shown here once they are released.
        </p>
        <div className="mt-4">
            <p><span className="font-semibold">Total Marks:</span> 18/20</p>
            <p><span className="font-semibold">Feedback:</span> Great work on the presentation. The report could be more detailed.</p>
        </div>
    </div>
);

// --- Main Dashboard Component ---
const StudentDashboard = () => {
    const [activeView, setActiveView] = useState('groupDetails');
    const [groupData, setGroupData] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const dataPromise = fetch_group(username, password, role, rollNo);
                dataPromise.then((data) => {
                    console.log(data.message);
                })
                //setGroupData(response.data.group);
            } catch (error) {
                console.error('Failed to fetch group:', error);
            }
        };

        fetchGroup();
    }, []);

    const renderView = () => {
        switch (activeView) {
            case 'groupDetails':
                return <GroupDetails groupData={groupData} />;
            case 'createGroup':
                return <CreateGroup />;
            case 'evaluationResults':
                return <EvaluationResults />;
            default:
                return <GroupDetails />;
        }
    };

    const NavButton = ({ viewName, children }) => {
        const isActive = activeView === viewName;
        return (
            <button
                onClick={() => setActiveView(viewName)}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                    }`}
            >
                {children}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white p-4 shadow-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
                </div>
                <nav className="space-y-2">
                    <NavButton viewName="groupDetails">Group Details</NavButton>
                    <NavButton viewName="createGroup">Create Group</NavButton>
                    <NavButton viewName="evaluationResults">View Evaluations</NavButton>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8">{renderView()}</main>
        </div>
    );
};

export default StudentDashboard;
