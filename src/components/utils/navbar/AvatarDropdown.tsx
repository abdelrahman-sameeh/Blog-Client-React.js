import { Link } from "react-router-dom";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import style from "./style.module.css";

export const AvatarDropdown = () => {
  const { user } = useLoggedInUser();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="dropdown pointer">
      {user?.picture ? (
        <img
          src={user.picture}
          style={{width: "40px", height: "40px", objectFit: "cover"}}
          className={`avatar dropdown-toggle rounded-full ${style.avatarMenu}`}
          data-bs-toggle="dropdown"
        />
      ) : (
        <span
          className={`border border-secondary rounded-circle d-inline-block p-2 dropdown-toggle ${style.avatarMenu} user-select-none fs-5`}
          data-bs-toggle="dropdown"
        >
          {user?.firstName?.[0]?.toUpperCase() || "U"}
        </span>
      )}
      <ul className="dropdown-menu">
        <Link className="dropdown-item" to="/dashboard">
          Dashboard
        </Link>
        <Link className="dropdown-item" to="/profile">
          Profile
        </Link>
        <Link className="dropdown-item" to="/setting">
          Settings
        </Link>
        <hr className="dropdown-divider" />
        <li className="dropdown-item" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};
