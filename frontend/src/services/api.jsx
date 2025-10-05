import axios from "axios";

const API_URL = "http://localhost:5000";

export const signup = async (username, password, role, rollNo) => {
    try {
        const roll_no = rollNo;
        const data = { username, password, role, roll_no };
        console.log(data.roll_no);
        const response = await axios.post(`${API_URL}/signup`, data, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.log("error: ", error);
    }

}

export const login = async (username, password, role, rollNo) => {
    try {
        const roll_no = rollNo;
        const data = { username, password, role, roll_no };
        console.log(data.roll_no);
        const response = await axios.post(`${API_URL}/login`, data, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.log("error: ", error);
    }

}

export const logout = async () => {
    try {
        const response = await axios.get(`${API_URL}/logout`, { withCredentials: true });

        return response.data;
    }
    catch (error) {
        console.log("error: ", error);

    }
}

export const fetch_group = async () => {
    try {

        const response = await axios.get(`${API_URL}/display_group`, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.log("error: ", error);
    }

}

export const fetch_students = async () => {
    try {

        const response = await axios.get(`${API_URL}/fetch_students`, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.log("error: ", error);
    }

}

export const fetch_supervisors = async () => {
    try {

        const response = await axios.get(`${API_URL}/fetch_supervisors`, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.log("error: ", error);
    }

}

export const create_group = async ({ title, supervisor_id, members }) => {
    try {
        const response = await axios.post(
            `${API_URL}/create_group`,
            { title, supervisor_id, members },
            { withCredentials: true } // ✅ include cookies for auth
        );

        return response.data; // return backend response (e.g., message, group info)
    } catch (error) {
        console.error("Error creating group:", error);
        throw error.response?.data || { message: "Server error" };
    }
};

export const fetch_teams = async () => {
    try {
        const response = await axios.get(`${API_URL}/display_teams`, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        console.log("error: ", error);
    }

}

export const evaluate_team = async (groupId, { report_marks, literature_survey_marks, work_done_marks, presentation_marks }) => {
    try {
        const response = await axios.post(
            `${API_URL}/evaluate_team/${groupId}`, // groupId in params
            { report_marks, literature_survey_marks, work_done_marks, presentation_marks }, // body
            { withCredentials: true } // include cookies for auth
        );

        return response.data; // return backend response
    } catch (error) {
        console.error("Error evaluating team:", error);
        throw error.response?.data || { message: "Server error" };
    }
};

export const fetch_evaluation = async (groupId) => {
    try {
        const response = await axios.get(
            `${API_URL}/view_evaluation/${groupId}`, // groupId in params
            { withCredentials: true } // include cookies for auth
        );

        return response.data; // return backend response
    } catch (error) {
        console.error("Error view_evaluation:", error);
        throw error.response?.data || { message: "Server error" };
    }
};

export const update_group = async (groupId, updatedData) => {
    try {
        console.log(updatedData.supervisor_name);
        const res = await axios.patch(`${API_URL}/update_group/${groupId}`, updatedData, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error updating group:", error);
        throw error.response?.data || { message: "Server error" };
    }
};

export const delete_group = async (groupId) => {
    try {
        const res = await axios.delete(`${API_URL}/delete_group/${groupId}`, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting group:", error);
        throw error.response?.data || { message: "Server error" };
    }
};

export const fetch_all_groups = async (sortOrder = "asc") => {
    try {
        const res = await axios.get(`${API_URL}/display_all`, {
            params: { order: sortOrder }, // pass order as query param
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching groups:", error);
        throw error.response?.data || { message: "Server error" };
    }
};
