import { Link } from "react-router-dom";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import style from "./style.module.css";
import { Dropdown } from "react-bootstrap";

export const AvatarDropdown = () => {
  const { user } = useLoggedInUser();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <Dropdown className="pointer">
      <Dropdown.Toggle
        bsPrefix="custom-toggle"
        variant="outline-light"
        className="text-dark border-0 bg-transparent p-1"
      >
        {user?.picture ? (
          <img
            src={user.picture}
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
            className={`rounded-circle ${style.avatarMenu}`}
          />
        ) : (
          <span
            className={`border border-secondary rounded-circle d-inline-block p-2 ${style.avatarMenu} user-select-none fs-5`}
          >
            {user?.firstName?.[0]?.toUpperCase() || "U"}
          </span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu align={"end"} className="dropdown-menu">
        <Link
          className="dropdown-item"
          to={
            user.role == "admin"
              ? `/dashboard/admin/articles-reports`
              : `/dashboard/user/articles`
          }
        >
          Dashboard
        </Link>
        <Link className="dropdown-item" to="/dashboard/shared/profile">
          Profile
        </Link>
        <Link className="dropdown-item" to="/dashboard/shared/setting">
          Settings
        </Link>
        <hr className="dropdown-divider" />
        <li className="dropdown-item" onClick={handleLogout}>
          Logout
        </li>
      </Dropdown.Menu>
    </Dropdown>
  );
};
