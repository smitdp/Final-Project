import { useEffect, useState } from "react";
import { baseURL } from "../Server";
import axios from "axios";

export const useUserInfo = (userId) => {
    const [information, setInformation] = useState({});
    const token = localStorage.getItem("login");
    useEffect(() => {
       try {
        if (userId) {
            const user = async () => {
                const user = await axios.get(`${baseURL}/user/user-info/${userId}`, {
                    headers: { Authorization: `Bearer ${token}`, credentials: true },
                  });
                console.log("RELOAD");
                setInformation(user.data);
            }
            user();
        }
       }catch(error) {
        console.log(error.Message)
       }
    }, [userId])

    return { information }
}

