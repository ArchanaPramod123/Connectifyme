// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

// const baseURL = "http://127.0.0.1:8000";

// const updateAdminToken = async () => {
//     const refreshToken = localStorage.getItem("refresh");

//     try {
//         const res = await axios.post(baseURL + "/api/token/refresh/", {
//             refresh: refreshToken,
//         });

//         if (res.status === 200) {
//             localStorage.setItem("access", res.data.access);
//             localStorage.setItem("refresh", res.data.refresh);



//             const decoded = jwtDecode(res.data.access);
//             dispatch(
//               set_Authentication({
//                 user_id:decoded.user_id,
//                 name: decoded.name,
//                 email: decoded.email,
//                 // profile_picture:decoded.profile_picture,
//                 isAuthenticated: true,
//                 isAdmin: decoded.isAdmin,
//               })
//             );

            
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         return false;
//     }
// };

// const fetchisAdmin = async () => {
//     const token = localStorage.getItem("access");
//     try {
//         const mockResponse = {
//             data: {
//                 is_superuser: true, 
//             }
//         };
//         return mockResponse.data.is_superuser;
//     } catch (error) {
//         console.error("Error fetching isAdmin:", error);
//         return false;
//     }
// };

// const isAuthAdmin = async () => {
//     const accessToken = localStorage.getItem("access");

//     if (!accessToken) {
//         return { isAuthenticated: false, isAdmin: false };
//     }

//     const currentTime = Date.now() / 1000;
//     let decoded = jwtDecode(accessToken);
//     if (decoded.exp > currentTime) {
//         let checkAdmin = await fetchisAdmin();
//         return {
//             isAuthenticated: true,
//             isAdmin: checkAdmin,
//         };
//     } else {
//         const updateSuccess = await updateAdminToken();

//         if (updateSuccess) {
//             let decoded = jwtDecode(accessToken);
//             let checkAdmin = await fetchisAdmin();
//             return {
//                 isAuthenticated: true,
//                 isAdmin: checkAdmin,
//             };
//         } else {
//             return { isAuthenticated: false, isAdmin: false };
//         }
//     }
// };

// export default isAuthAdmin;


















// import jwtDecode from "jwt-decode";
// import axios from "axios";
// import { set_Authentication } from '../../Redux/Authentication/authenticationSlice';
// import store from '../../Redux/store';

// const updateAdminToken = async () => {
//   const baseURL = 'http://127.0.0.1:8000';
//   const refreshToken = localStorage.getItem("refresh");

//   try {
//     const res = await axios.post(baseURL + "/api/account/token/refresh/", {
//       refresh: refreshToken,
//     });

//     if (res.status === 200) {
//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     return false;
//   }
// };

// const fetchIsAdmin = async () => {
//   const token = localStorage.getItem("access");
//   const baseURL = 'http://127.0.0.1:8000';

//   try {
//     const res = await axios.get(baseURL + "/api/account/user/details/", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });
//     return res.data.data.is_superuser; 
//   } catch (error) {
//     return false;
//   }
// };

// const isAuthAdmin = async () => {
//   const accessToken = localStorage.getItem("access");

//   if (!accessToken) {
//     return { name: null, isAuthenticated: false, isAdmin: false };
//   }

//   const currentTime = Date.now() / 1000;
//   let decoded = jwtDecode(accessToken);

//   if (decoded.exp > currentTime) {
//     let checkAdmin = await fetchIsAdmin();
    
//     store.dispatch(set_Authentication({
//       user_id: decoded.user_id,
//       name: decoded.name,
//       email: decoded.email,
//       isAuthenticated: true,
//       isAdmin: checkAdmin,
//     }));

//     return {
//       name: decoded.name,
//       isAuthenticated: true,
//       isAdmin: checkAdmin,
//     };
//   } else {
//     const updateSuccess = await updateAdminToken();

//     if (updateSuccess) {
//       let decoded = jwtDecode(accessToken);
//       let checkAdmin = await fetchIsAdmin();
      
//       store.dispatch(set_Authentication({
//         user_id: decoded.user_id,
//         name: decoded.name,
//         email: decoded.email,
//         isAuthenticated: true,
//         isAdmin: checkAdmin,
//       }));

//       return {
//         name: decoded.name,
//         isAuthenticated: true,
//         isAdmin: checkAdmin,
//       };
//     } else {
//       return { name: null, isAuthenticated: false, isAdmin: false };
//     }
//   }
// };

// export default isAuthAdmin;







import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { set_Authentication } from '../Redux/Authentication/authenticationSlice';

const updateAdminToken = async (dispatch) => {
  const refreshToken = localStorage.getItem('refresh');
  const baseURL = 'http://127.0.0.1:8000';

  try {
    const res = await axios.post(`${baseURL}/api/token/refresh/`, { refresh: refreshToken });

    if (res.status === 200) {
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      const decoded = jwtDecode(res.data.access);
      dispatch(
        set_Authentication({
          user_id:decoded.user_id,
          name: decoded.name,
          email: decoded.email,
          // profile_picture:decoded.profile_picture,
          isAuthenticated: true,
          isAdmin: decoded.isAdmin,
        })
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const isAuthAdmin = async (dispatch) => {
  const accessToken = localStorage.getItem('access');

  if (!accessToken) {
    dispatch(set_Authentication({ name: null, isAuthenticated: false }));
    return false;
  }

  const currentTime = Date.now() / 1000;
  const decoded = jwtDecode(accessToken);

  if (decoded.exp > currentTime) {
    dispatch(
      set_Authentication({
        user_id: decoded.user_id,
        name: decoded.name,
        email: decoded.email,
        // profile_picture: decoded.profile_picture,
        isAuthenticated: true,
        isAdmin: decoded.isAdmin,
      })
    );
    return true;
  } else {
    const updateSuccess = await updateAdminToken(dispatch);
    return updateSuccess;
  }
};

export default isAuthAdmin;
