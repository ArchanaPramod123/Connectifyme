import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import isAuthUser from "../utils/isAuthuser";

const AuthUser = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await isAuthUser(dispatch);
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };
    authenticate();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/user/home" /> : children;
};

export default AuthUser;
