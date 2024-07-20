import { jwtDecode } from "jwt-decode";
import axios from "axios";

const baseURL = "http://127.0.0.1:8000";

const updateAdminToken = async () => {
    const refreshToken = localStorage.getItem("refresh");

    try {
        const res = await axios.post(baseURL + "/api/token/refresh/", {
            refresh: refreshToken,
        });

        if (res.status === 200) {
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

const fetchisAdmin = async () => {
    const token = localStorage.getItem("access");
    try {
        const mockResponse = {
            data: {
                is_superuser: true, 
            }
        };
        return mockResponse.data.is_superuser;
    } catch (error) {
        console.error("Error fetching isAdmin:", error);
        return false;
    }
};

const isAuthAdmin = async () => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        return { isAuthenticated: false, isAdmin: false };
    }

    const currentTime = Date.now() / 1000;
    let decoded = jwtDecode(accessToken);
    if (decoded.exp > currentTime) {
        let checkAdmin = await fetchisAdmin();
        return {
            isAuthenticated: true,
            isAdmin: checkAdmin,
        };
    } else {
        const updateSuccess = await updateAdminToken();

        if (updateSuccess) {
            let decoded = jwtDecode(accessToken);
            let checkAdmin = await fetchisAdmin();
            return {
                isAuthenticated: true,
                isAdmin: checkAdmin,
            };
        } else {
            return { isAuthenticated: false, isAdmin: false };
        }
    }
};

export default isAuthAdmin;
