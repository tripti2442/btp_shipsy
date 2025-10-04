import React, { useState, useEffect } from "react";
import {
  fetch_all_groups,
  update_group,
  delete_group,
  fetch_evaluation,
} from "../services/api";

const AdminDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [editData, setEditData] = useState({ title: "", supervisor_name: "", members: [] });
  const [evaluationData, setEvaluationData] = useState({}); // store fetched evaluation data

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetch_all_groups();
        setGroups(data.groups || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  // Handle editing fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // Submit update
  const handleUpdate = async (groupId) => {
    try {
      const members = editData.members.split(",").map((r) => ({
        roll_no: r.trim(),
      }));

      const updatedData = {
        title: editData.title,
        supervisor_name: editData.supervisor_name,
        members,
      };

      const res = await update_group(groupId, updatedData);
      alert(res.message);
      setEditingGroup(null);

      setGroups((prev) =>
        prev.map((g) => (g._id === groupId ? res.group : g))
      );
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  // Delete group
  const handleDelete = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      const res = await delete_group(groupId);
      alert(res.message);
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      alert("Failed to delete group");
    }
  };

  // View evaluation
  const handleViewEvaluation = async (groupId) => {
    try {
      const data = await fetch_evaluation(groupId);
      setEvaluationData({ [groupId]: data.evaluation });
    } catch (err) {
      alert("Failed to load evaluation");
    }
  };

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>

      {groups.map((g) => (
        <div key={g._id} className="bg-white p-4 shadow-md rounded mb-4">
          {editingGroup === g._id ? (
            <div>
              <input
                name="title"
                value={editData.title}
                onChange={handleChange}
                placeholder="Title"
                className="border p-1 mr-2"
              />
              <input
                name="supervisor_name"
                value={editData.supervisor_name}
                onChange={handleChange}
                placeholder="Supervisor Name"
                className="border p-1 mr-2"
              />
              <input
                name="members"
                value={editData.members}
                onChange={handleChange}
                placeholder="Members Roll Nos (comma separated)"
                className="border p-1 mr-2"
              />
              <button
                onClick={() => handleUpdate(g._id)}
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingGroup(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold">{g.title}</h3>
              <p>
                <b>Supervisor:</b> {g.supervisor_id?.username || "N/A"}
              </p>
              <p>
                <b>Members:</b>{" "}
                {g.members.map((m) => `${m.username} (${m.roll_no})`).join(", ")}
              </p>
              <p>
                <b>Evaluated:</b> {g.is_evaluated ? "✅ Yes" : "❌ No"}
              </p>

              <div className="mt-2">
                {g.is_evaluated && (
                  <button
                    onClick={() => handleViewEvaluation(g._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    View Evaluation
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingGroup(g._id);
                    setEditData({
                      title: g.title,
                      supervisor_name: g.supervisor_id?.username || "",
                      members: g.members.map((m) => m.roll_no).join(", "),
                    });
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(g._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>

              {evaluationData[g._id] && (
                <div className="mt-3 border-t pt-2 text-gray-700">
                  <h4 className="font-semibold mb-1">Evaluation Report</h4>
                  <p>
                    <b>Report Marks:</b> {evaluationData[g._id].report_marks}
                  </p>
                  <p>
                    <b>Literature Survey Marks:</b>{" "}
                    {evaluationData[g._id].literature_survey_marks}
                  </p>
                  <p>
                    <b>Work Done Marks:</b>{" "}
                    {evaluationData[g._id].work_done_marks}
                  </p>
                  <p>
                    <b>Presentation Marks:</b>{" "}
                    {evaluationData[g._id].presentation_marks}
                  </p>
                  <p>
                    <b>Total Marks:</b> {evaluationData[g._id].total_marks}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
