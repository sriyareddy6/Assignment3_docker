import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/css/style.css"
import { NavLink } from "react-router-dom";

export default function Navbar({userLoggedIn}) {
  // console.log(userLoggedIn)

  const loggedOut = (e) => {
    e.preventDefault();
    window.localStorage.removeItem('token');
    window.location = "/login";
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          <h1 className="logo ml-3">B</h1>
        </NavLink>
        <h1>Media Library</h1>
        <ul className="app_menu">
        {userLoggedIn ? (
            <li>
              <a href="#" onClick={loggedOut}>Logout</a>
            </li>
        ) : (
          <>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </>
        )

        }
        
        <li>
          <NavLink to="/user-list">List</NavLink>
        </li>
      </ul>
      </nav>
       
    </div>
  );
}
