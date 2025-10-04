import React, { useState, useEffect } from "react";
import { fetch_teams, evaluate_team, fetch_evaluation } from "../services/api"; // replace with your actual frontend API functions

const SupervisorDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openEvaluation, setOpenEvaluation] = useState(null); // group id currently being evaluated
  const [marks, setMarks] = useState({
    report_marks: "",
    literature_survey_marks: "",
    work_done_marks: "",
    presentation_marks: "",
  });
  const [viewEvaluation, setViewEvaluation] = useState(null); // group id currently viewing evaluation
  const [evaluationData, setEvaluationData] = useState(null); // store evaluation for viewing

  // Load teams on mount
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetch_teams();
        if (data.groups) {
          setTeams(data.groups);
        } else {
          setError("No teams found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching teams.");
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  // Handle opening evaluation form
  const handleEvaluateClick = (groupId) => {
    setOpenEvaluation(groupId);
    setMarks({
      report_marks: "",
      literature_survey_marks: "",
      work_done_marks: "",
      presentation_marks: "",
    });
    setViewEvaluation(null); // close view if open
  };

  // Handle input changes in evaluation form
  const handleMarkChange = (e) => {
    const { name, value } = e.target;
    setMarks({ ...marks, [name]: value });
  };

  // Submit evaluation
  const handleEvaluationSubmit = async (groupId) => {
    try {
      const response = await evaluate_team(groupId, marks);
      alert(response.message || "Evaluation submitted!");
      // Update team evaluation status locally
      setTeams((prevTeams) =>
        prevTeams.map((t) =>
          t._id === groupId ? { ...t, is_evaluated: true } : t
        )
      );
      setOpenEvaluation(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit evaluation.");
    }
  };

  // View evaluation result
  const handleViewEvaluation = async (groupId) => {
    try {
      const data = await fetch_evaluation(groupId);
      if (data.evaluation) {
        setEvaluationData(data.evaluation);
        setViewEvaluation(groupId);
        setOpenEvaluation(null); // close form if open
      } else {
        alert("No evaluation found for this team.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch evaluation.");
    }
  };

  if (loading) return <p>Loading teams...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Supervisor Dashboard</h2>

      {teams.map((team) => (
        <div key={team._id} className="bg-white shadow-md rounded p-4 mb-4">
          <h3 className="font-semibold text-xl">{team.title}</h3>
          <p>
            <span className="font-semibold">Members:</span>{" "}
            {team.members
              .map((m) => `${m.username} (${m.roll_no || "-"})`)
              .join(", ")}
          </p>
          <p>
            <span className="font-semibold">Evaluated:</span>{" "}
            {team.is_evaluated ? "Yes" : "No"}
          </p>

          {/* Evaluation button */}
          {!team.is_evaluated && (
            <button
              onClick={() => handleEvaluateClick(team._id)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Evaluate
            </button>
          )}

          {/* View evaluation button */}
          {team.is_evaluated && (
            <button
              onClick={() => handleViewEvaluation(team._id)}
              className="mt-2 ml-2 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
            >
              View Evaluation
            </button>
          )}

          {/* Evaluation Form */}
          {openEvaluation === team._id && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Evaluation Form</h4>
              <div className="grid grid-cols-2 gap-4">
                {["report_marks","literature_survey_marks","work_done_marks","presentation_marks"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1">{field.replace(/_/g," ")}</label>
                    <input
                      type="number"
                      name={field}
                      value={marks[field]}
                      onChange={handleMarkChange}
                      min={0}
                      max={5}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleEvaluationSubmit(team._id)}
                className="mt-3 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Submit Evaluation
              </button>
            </div>
          )}

          {/* View Evaluation Result */}
          {viewEvaluation === team._id && evaluationData && (
            <div className="mt-4 border-t pt-4 bg-gray-50 p-3 rounded">
              <h4 className="font-semibold mb-2">Evaluation Result</h4>
              <p>
                <strong>Report Marks:</strong> {evaluationData.report_marks}
              </p>
              <p>
                <strong>Literature Survey Marks:</strong> {evaluationData.literature_survey_marks}
              </p>
              <p>
                <strong>Work Done Marks:</strong> {evaluationData.work_done_marks}
              </p>
              <p>
                <strong>Presentation Marks:</strong> {evaluationData.presentation_marks}
              </p>
              <p>
                <strong>Total Marks:</strong> {evaluationData.total_marks}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SupervisorDashboard;
