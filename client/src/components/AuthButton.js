import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthButton = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.isAuthenticated) {
    return (
      <Link className="btn btn-primary" to="/login">
        Login
      </Link>
    );
  }

  const logout = () => {
    // auth.signout().then(() => navigate("/"));
    auth.signout().then(() => navigate('/login'));
    document.querySelector('#main').style.marginLeft='0';
  };

  return (
    <div className="text-white navList">
      <div className="" onClick={logout}>
        <Link>Logout</Link>
        {/* Logout */}
      </div>
    </div>
  );
};

export default AuthButton;