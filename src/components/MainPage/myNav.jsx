import React from "react";
import "./myNav.scss";
import { Link } from "react-router-dom";

const myNav = () => {
  return (
    <>
      <nav>
        <div className="logo">
          <Link to="/">soysource</Link>
        </div>

        <ul className="nav-items">
          <li className="nav-item">
            <Link to="/">홈</Link>
          </li>
          <li className="nav-item">
            <Link to="/room">잰말놀이</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default myNav;