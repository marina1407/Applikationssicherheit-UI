import { PureComponent } from "react";
import React from "react";
import { Nav, Navbar, NavbarBrand } from "react-bootstrap";
import NavLink from "react-bootstrap/NavLink";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import NavbarToggle from "react-bootstrap/NavbarToggle";
import { RouteComponentProps, withRouter } from "react-router";

import { getUser, removeStoredUser } from "../util/userHandler";

export class Navigation extends PureComponent<RouteComponentProps> {
  getUsername = () => {
    const user = getUser();
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "Anonymous";
  };

  isAuthenticated = () => getUser() !== null;

  handleUserNameClick = () => {
    if (this.isAuthenticated()) {
      removeStoredUser();
    }
    this.props.history.replace("/login");
  };

  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <NavbarBrand>Notenapp</NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          {this.isAuthenticated() && (
            <Nav className="mr-auto">
              <NavLink href="/overview">Noten Übersicht</NavLink>
              <NavLink href="/administration">Administration</NavLink>
              <NavLink href="/create/mark">Note erfassen</NavLink>
            </Nav>
          )}
          <Nav className="ml-auto">
            <NavLink onClick={this.handleUserNameClick}>
              Welcome {this.getUsername()}
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </Navbar>
    );
  }
}
export default withRouter(Navigation);
