import axios from "axios";

const API_URL = "http://localhost:5000";

export const signup= async (username, password, role, rollNo)=>{
    try{
        const roll_no= rollNo;
        const data={username, password, role, roll_no};
        console.log(data.roll_no);
        const response= await axios.post(`${API_URL}/signup`,data,{withCredentials:true});
        return response.data;
    }
    catch(error){
        console.log("error: ",error);
    }

}

export const login= async (username, password, role, rollNo)=>{
    try{
        const roll_no= rollNo;
        const data={username, password, role, roll_no};
        console.log(data.roll_no);
        const response= await axios.post(`${API_URL}/login`,data,{withCredentials:true});
        return response.data;
    }
    catch(error){
        console.log("error: ",error);
    }

}

export const fetch_group= async ()=>{
    try{
     
        const response= await axios.get(`${API_URL}/display_group`,{withCredentials:true});
        return response.data;
    }
    catch(error){
        console.log("error: ",error);
    }

}

export const fetch_students= async ()=>{
    try{
     
        const response= await axios.get(`${API_URL}/fetch_students`,{withCredentials:true});
        return response.data;
    }
    catch(error){
        console.log("error: ",error);
    }

}

export const fetch_supervisors= async ()=>{
    try{
     
        const response= await axios.get(`${API_URL}/fetch_supervisors`,{withCredentials:true});
        return response.data;
    }
    catch(error){
        console.log("error: ",error);
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