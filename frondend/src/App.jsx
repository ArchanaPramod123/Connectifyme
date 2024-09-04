import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserWrapper from "./components/user/UserWrapper";
import AdminWrapper from "./components/admin/AdminWrapper";
import AuthUser from "./Redux/AuthUser";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthUser>
                <LandingPage />
              </AuthUser>
            }
          ></Route>
          <Route path="user/*" element={<UserWrapper></UserWrapper>}></Route>
          <Route path="admin/*" element={<AdminWrapper />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
