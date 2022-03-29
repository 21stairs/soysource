import React from "react";
import "./myNav.scss";
import { Link } from "react-router-dom";

const myNav = () => {
  return (
    <div id="navigation-bar">
      <nav>
        <div id="logo">
          <Link to="/">Soysourcetree</Link>
        </div>

        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/room">잰말놀이</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default myNav;
