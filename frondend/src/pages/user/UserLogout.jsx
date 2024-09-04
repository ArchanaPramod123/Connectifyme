import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    navigate('/user');
  };
  

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
};

export default UserLogout;
