import React, { Component, FunctionComponent, useContext } from "react";

import { goto } from "reactStartup";
import ajaxUtil from "util/ajaxUtil";
import { AppContext } from "applicationRoot/renderUI";

import navClasses from "css/navbar.module.css";

const { nav, navHeader, navItems, navItemsRight } = navClasses;

const spreadClassNames = (baseCssClasses = "", ...userClasses) => `${baseCssClasses} ${userClasses.join(" ")}`;

const NavBarItem = props => {
  let { disabled, className, active, href, onClick, children, aStyle = {}, ...rest } = props;
  let hrefToUse = !disabled && !active ? null : href;

  return (
    <li className={spreadClassNames(className, !!disabled ? "disabled" : "", active ? "active" : "")} {...rest}>
      <a style={aStyle} onClick={onClick}>
        {children}
      </a>
    </li>
  );
};

const MainNavigationBar: FunctionComponent<{}> = props => {
  const logout = () => {
    localStorage.setItem("reduxState", "");
    ajaxUtil.post("/react-redux/logout", {}, () => window.location.reload());
  };

  let [{ isPublic, publicBooksHeader, publicName, module, isLoggedIn }] = useContext(AppContext);
  let isHome = module == "home";
  let isBookEntry = module == "scan";
  let isBookList = module == "books";
  let isSubjects = module == "subjects";
  let isLoginModule = module == "authenticate";
  let isSettings = module == "settings";

  return (
    <div className={nav} style={{ marginBottom: "5px" }}>
      <div className={`${navHeader} hidden-xs ${isHome ? "active" : ""}`}>
        <a onClick={() => goto("home")}>
          <i className="fal fa-book" style={{ marginRight: "5px" }} />
          <span>My Library</span>
        </a>
      </div>

      <ul className={navItems}>
        <NavBarItem className="visible-xs" disabled={isPublic} onClick={() => goto("home")} active={isHome} aStyle={{ marginTop: "2px" }}>
          <i className="fal fa-home visible-xs" />
        </NavBarItem>
        {isLoggedIn || isPublic ? (
          <NavBarItem disabled={isPublic} onClick={isPublic ? null : () => goto("scan")} active={isBookEntry}>
            <span className="hidden-xs">Book entry</span>
            <i className="visible-xs fal fa-scanner" />
          </NavBarItem>
        ) : null}
        {isLoggedIn || isPublic ? (
          <NavBarItem active={isBookList} onClick={() => goto("books")}>
            <span className="hidden-xs">Books</span>
            <i className="visible-xs fal fa-books" />
          </NavBarItem>
        ) : null}
        {isLoggedIn || isPublic ? (
          <NavBarItem disabled={isPublic} onClick={isPublic ? null : () => goto("subjects")} active={isSubjects}>
            <span className="hidden-xs">Subjects</span>
            <i className="visible-xs fal fa-sitemap" />
          </NavBarItem>
        ) : null}
        {isLoggedIn || isPublic ? (
          <NavBarItem disabled={isPublic} onClick={isPublic ? null : () => goto("settings")} active={isSettings}>
            <span className="hidden-xs">Settings</span>
            <i className="visible-xs fal fa-cogs" />
          </NavBarItem>
        ) : null}
      </ul>
      <ul className={navItemsRight}>
        {!isLoggedIn && !isLoginModule ? (
          <NavBarItem onClick={() => goto("login")}>
            <span className="hidden-xs">Login</span>
            <i className="visible-xs fal fa-sign-in" />
          </NavBarItem>
        ) : null}
      </ul>
      {isLoggedIn ? (
        <ul className={navItemsRight}>
          <NavBarItem onClick={logout}>
            <span className="hidden-xs">Logout</span>
            <i className="visible-xs fal fa-sign-out" />
          </NavBarItem>
        </ul>
      ) : null}
    </div>
  );
};

export default MainNavigationBar;
