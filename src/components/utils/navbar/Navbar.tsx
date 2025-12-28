import { Link } from "react-router-dom";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { Search } from "./Search";
import { MdOutlineNoteAlt } from "react-icons/md";
import { AvatarDropdown } from "./AvatarDropdown";
import { Sidebar } from "../sidebar/Sidebar";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import { FaUserFriends } from "react-icons/fa";

export const Navbar = () => {
  const { user } = useLoggedInUser();

  const handleToggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar?.classList?.toggle("show");
  };

  return (
    <div className="navbar border-bottom py-3 border-secondary">
      <div className="w-100 px-4 container-fluid d-flex justify-content-between align-items-center flex-nowrap">
        <Link
          to={"/"}
          className="logo text-dark text-decoration-none d-inline-block fs-2 fw-bold user-select-none text-capitalize"
        >
          medium mirror
        </Link>
        <div>
          {user?._id ? (
            <div
              className={`links d-flex gap-4 list-unstyled mb-0 align-items-center`}
            >
              <Search />
              <Link
                to={"/friend-requests"}
                className="text-dark text-decoration-none text-capitalize d-flex gap-1"
              >
                <FaUserFriends className="fs-4" />
              </Link>
              <Link
                to={"/dashboard/user/create-article"}
                className="text-dark text-decoration-none text-capitalize d-flex gap-1"
              >
                <MdOutlineNoteAlt className="fs-4" />
                write
              </Link>
              <AvatarDropdown />
            </div>
          ) : (
            <>
              <Link className="text-dark" to={"/login"}>
                Login
              </Link>
            </>
          )}
        </div>

        {/* Bars displayed for only logged in accounts */}
        {user?._id && (
          <>
            <div
              onClick={handleToggleSidebar}
              className="bars d-none p-2 pointer"
            >
              <HiMiniBars3BottomRight className="fs-3" />
            </div>
            <Sidebar />
          </>
        )}
      </div>
    </div>
  );
};
