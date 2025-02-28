import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.png"; // Import ảnh đúng cách
import "../css/Logo.css";

class Logo extends Component {
  render(): ReactNode {
    return (
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>
    );
  }
}

export default Logo;
