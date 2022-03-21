import React from "react";
import "./myNav.scss";

const myNav = () => {
  return (
    <div id="navigation-bar">
      <nav>
        <a href="#" id="logo">
          Soysourcetree
        </a>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Portfolio</a>
          </li>
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
          <a href="#" id="menu-icon"></a>
        </ul>
      </nav>
    </div>
  );
};

export default myNav;
