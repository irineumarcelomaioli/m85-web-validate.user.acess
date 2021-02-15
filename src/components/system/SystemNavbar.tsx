import React from "react";
import { FiX, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./SystemNavbar.css";

import Content from "./Field/Content";

interface PropsNavbar {
  title: string;
  pageDirection?: string;
  userName?: string;
  erroServer?: string;
}

const SystemNavbar: React.FC<PropsNavbar> = (props) => {
  const closeSystem = () => {
    localStorage.removeItem("@m85.tech:token");
  };

  return (
    <>
      <div className="navbar-container">
        <div
          className={`${
            props.erroServer ? "erroServer-show" : "erroServer-hidden"
          }`}
        >
          <Content
            text={props.erroServer}
            style="danger"
            align="center"
            fontSize="small"
            bold={true}
          />
        </div>
        <nav className="nav-container">
          <div className="nav-logo-container">
            <img
              src={process.env.PUBLIC_URL + "/images/store.web2.png"}
              alt="logo"
              className="nav-logo"
            />
          </div>
          <div className="nav-title">
            <Content
              text={props.title}
              style="light"
              fontSize="medium"
              title={true}
              align="center"
            />
          </div>
          {props.userName ? (
            <div className="nav-user-name">
              <Content
                text={props.userName.toLocaleUpperCase()}
                style="light"
                fontSize="small"
                title={true}
                align="center"
              />
            </div>
          ) : (
            ""
          )}
          {props.pageDirection === "/systemlogin" ? (
            <div className="nav-close-container">
              <Link
                to={String(props.pageDirection)}
                className="nav-link"
                onClick={closeSystem}
              >
                <FiX className="nav-close" />
              </Link>
            </div>
          ) : (
            <div className="nav-back-container">
              <Link to={String(props.pageDirection)} className="nav-link">
                <FiArrowLeft className="nav-back" />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default SystemNavbar;
