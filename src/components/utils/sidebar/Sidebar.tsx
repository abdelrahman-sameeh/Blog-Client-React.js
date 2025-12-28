import { IoCloseCircleOutline } from "react-icons/io5";
import { Search } from "../navbar/Search";
import { Link } from "react-router-dom";
import { MdOutlineNoteAlt } from "react-icons/md";
import { AvatarDropdown } from "../navbar/AvatarDropdown";
import { useRef } from "react";
import { FaUserFriends } from "react-icons/fa";

export const Sidebar = () => {
  const sidebar = useRef<HTMLDivElement>(null);

  const handleHide = () => {
    sidebar?.current?.classList.remove("show");
  };

  return (
    <div ref={sidebar} className={`sidebar d-none shadow`}>
      <div className="container mt-4">
        <div className="d-flex align-items-center justify-content-between">
          <span className="fs-4 text-capitalize fw-bold cursor-default user-select-none">
            sidebar
          </span>
          <IoCloseCircleOutline
            onClick={handleHide}
            className="fs-3 pointer text-danger"
          />
        </div>
      </div>
      <hr />
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <Search />
        <Link
          to={"/dashboard/user/create-article"}
          className="text-dark text-decoration-none text-capitalize d-flex gap-1 my-4"
        >
          <MdOutlineNoteAlt className="fs-3" />
          write
        </Link>
        <Link
          to={"/friend-requests"}
          className="text-dark text-decoration-none text-capitalize d-flex gap-1"
        >
          <FaUserFriends className="fs-4" />
        </Link>
        <AvatarDropdown />
      </div>
    </div>
  );
};
