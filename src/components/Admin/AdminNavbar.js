import axios from "axios";
import React, { Component } from "react";

import wiggy_tails_icon from "../../img/wiggly-tails-icon.png";
import ManageEmployeesModal from "./Employees/ManageEmployeesModal.js";
import AboutUsModal from "../AboutUsModal.js";

class AdminNavbar extends Component {
  state = {
    record: {
      id: "",
      fullName: "",
    },
    navs: [
      {
        id: 0,
        text: "Home",
        link: "/wiggly-tails/admin",
        items: [],
      },
      {
        id: 1,
        text: "Manage",
        link: null,
        items: [
          {
            id: 2,
            text: "Transactions",
            link: "/wiggly-tails/admin/manage-transactions",
          },
          {
            id: 3,
            text: "Customers",
            link: "/wiggly-tails/admin/manage-customers",
          },
          {
            id: 4,
            text: "Pets",
            link: "/wiggly-tails/admin/manage-pets",
          },
          {
            id: 5,
            text: "Employees",
            link: "/wiggly-tails/admin/manage-employees",
          },
        ],
      },
      {
        id: 6,
        text: "Audit Logs",
        link: "/wiggly-tails/admin/view-logs",
        items: [],
      },
      {
        id: 7,
        text: "About us",
        link: null,
        items: [],
      },
      {
        id: 10,
        text: "Log out",
        link: "/wiggly-tails",
        items: [],
      },
    ],
  };

  onClickLink = (nav) => {
    const { history } = this.props;
    const link = nav.link;
    history.replace(link, { ...history.location.state });
  };

  onClickBrand = () => {
    const { history } = this.props;
    const link = "/wiggly-tails/admin";
    history.replace(link, { ...history.location.state });
  };

  onClickSignOut = (nav) => {
    const { history } = this.props;
    const record = this.state;
    const link = nav.link;
    axios.post(
      "http://princemc.heliohost.us/veterinaryClinic/employeeLogout.php",
      record
    );
    history.replace(link);
  };

  componentDidMount = () => {
    const { history } = this.props;
    const record = this.state;
    record.id = history.location.state.id;
    record.fullName = history.location.state.fullName;
    this.setState({ record });
  };

  render() {
    const { activeId, history } = this.props;
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <a onClick={this.onClickBrand} className="navbar-brand py-0">
            <img src={wiggy_tails_icon} alt="" className="mr-2" />
            Veterinary Clinic
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#admin-navbar"
            aria-controls="admin-navbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="admin-navbar">
            <ul className="navbar-nav ml-auto">
              {this.state.navs.map((nav) =>
                nav.items.length > 0 ? (
                  <li key={nav.id} className="nav-item dropdown mr-1">
                    <a
                      className={
                        "dropdown-toggle " + this.linkItemClasses(nav.id)
                      }
                      id={"dropdown" + nav.id}
                      href={nav.link}
                      data-toggle="dropdown"
                    >
                      {nav.text}
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby={"dropdown" + nav.id}
                    >
                      {nav.items.map((item) =>
                        item.id === 5 && item.id !== activeId ? (
                          <a
                            key={item.id}
                            className={this.dropdownItemClasses(item.id)}
                            data-toggle="modal"
                            data-target="#manageEmployeesModal"
                          >
                            {item.text}
                          </a>
                        ) : (
                          <a
                            key={item.id}
                            className={this.dropdownItemClasses(item.id)}
                            onClick={() => this.onClickLink(item)}
                          >
                            {item.text}
                          </a>
                        )
                      )}
                    </div>
                  </li>
                ) : (
                  <li key={nav.id} className="nav-item mr-1">
                    {nav.id === 10 ? (
                      <a
                        onClick={() => this.onClickSignOut(nav)}
                        className={this.linkItemClasses(nav.id)}
                      >
                        {nav.text}
                      </a>
                    ) : nav.id === 7 ? (
                      <a
                        key={nav.id}
                        className={this.linkItemClasses(nav.id)}
                        data-toggle="modal"
                        data-target="#aboutUsModal"
                      >
                        {nav.text}
                      </a>
                    ) : (
                      <a
                        onClick={() => this.onClickLink(nav)}
                        className={this.linkItemClasses(nav.id)}
                      >
                        {nav.text}
                      </a>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        </nav>

        <ManageEmployeesModal history={history} />
        <AboutUsModal />
      </React.Fragment>
    );
  }

  linkItemClasses = (id) => {
    const { activeId, sourceId } = this.props;

    let classes = "nav-link ";
    classes +=
      id === 10 || id === 7
        ? "btn rounded-pill text-center text-light py-1 my-1 px-3 "
        : "";

    classes +=
      id === activeId
        ? "active"
        : id === sourceId
        ? "active"
        : id === 10
        ? "btn-danger"
        : id === 7
        ? "btn-primary"
        : "inactive";

    return classes;
  };

  dropdownItemClasses = (id) => {
    const { activeId } = this.props;

    let classes = "dropdown-item ";
    classes += id === 5 ? "text-danger " : "text-dark ";
    classes += id === activeId ? "active-dropdown" : "inactive-dropdown";

    return classes;
  };
}

export default AdminNavbar;
