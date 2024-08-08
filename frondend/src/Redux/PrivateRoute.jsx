import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import isAuthUser from "../utils/isAuthuser";

const PrivateRoute = ({ children }) => {
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

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
