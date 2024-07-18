import React from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate } from "react-router-dom";
import AboutUsPage from "./pages/AboutUsPage";
// import AboutUsPage from "./pages/AboutUsPage";
import "./App.css";
import HabitFormPage from "./pages/HabitFormPage";
import Feed from "./pages/Feed";
import {ShowHabitPage} from "./pages/ShowHabitPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from "./context/AuthContext";

import {NavBar, ExpandMenuBtn} from "./components/NavBar";
import Profile from "./pages/Profile";
import { SharedProvider } from "./context/SharedContext";
import { Search } from "./components/Search";
import UserProfile from "./components/UserProfile";
import ShowHabitsForeign from "./components/ShowHabitsForeign";

function Navigation(props) {
  return (
<>
<NavBar />
    {/* <nav className="navbar navbar-expand-sm navbar-dark bg-dark shadow mb-3">
      <div className="container-fluid">
        <ExpandMenuBtn />
        <Link className="navbar-brand" to="/">
          Home
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/habits/new">
              Create
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about-us">
              About Us
            </NavLink>
          </li>
          <li className="nav-item">
            <AuthButton style={{}} />
          </li>
        </ul>
      </div>
    </nav> */}
    </>
  );
 
}

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    <SharedProvider>
    <div id="main">
      <NavBar />
      {/* <NavBar /> */}
      <div className="container-xl text-center">
        <div className="row justify-content-center">
          <Search />
          <Routes>
            <Route path="/habits/:id" element={<PrivateRoute><ShowHabitPage /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><Feed /></PrivateRoute>}  />
            <Route path="/create/:makeHabit" element={<PrivateRoute><HabitFormPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/users/:username" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/users/:username/habits/:makeHabit" element={<PrivateRoute><ShowHabitsForeign /></PrivateRoute>} />
             
            {/** public routes */}
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
    </SharedProvider>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;