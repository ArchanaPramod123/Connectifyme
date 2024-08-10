import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { set_Authentication } from '../Redux/Authentication/authenticationSlice';

const updateUserToken = async (dispatch) => {
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

const isAuthUser = async (dispatch) => {
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
        isAuthenticated: true,
        isAdmin: decoded.isAdmin,
      })
    );
    return true;
  } else {
    const updateSuccess = await updateUserToken(dispatch);
    return updateSuccess;
  }
};

export default isAuthUser;
