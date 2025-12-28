import { NavLink } from "react-router-dom";
import { MdOutlineArticle } from "react-icons/md";
import { FaArrowRight, FaRegUserCircle } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { BiCategory } from "react-icons/bi";
import { CiBookmark, CiSettings } from "react-icons/ci";

type linkType = {
  link: string;
  title: string;
  icon: React.ReactNode;
  isShared?: boolean;
};

type linksType = {
  admin: linkType[];
  user: linkType[];
  shared: linkType[];
};

const links: linksType = {
  admin: [
    {
      link: "articles-reports",
      title: "Articles Reports",
      icon: <MdOutlineArticle />,
    },
  ],
  user: [
    {
      link: "articles",
      title: "your articles",
      icon: <MdOutlineArticle />,
    },
    {
      link: "create-article",
      title: "create article",
      icon: <IoCreateOutline />,
    },
    {
      link: "saved-articles",
      title: "saved articles",
      icon: <CiBookmark />,
    },
    {
      link: "preferences",
      title: "your preferences",
      icon: <BiCategory />,
    },
  ],
  shared: [
    {
      link: "profile",
      title: "profile",
      icon: <FaRegUserCircle />,
      isShared: true,
    },
    {
      link: "setting",
      title: "setting",
      icon: <CiSettings />,
      isShared: true,
    },
  ],
};

export const DashboardSidebar = () => {
  const { user } = useLoggedInUser();
  const handleToggleSidebar = () => {
    const dashboardSidebar = document.querySelector(".dashboard-sidebar");
    dashboardSidebar?.classList.toggle("hide");
    dashboardSidebar?.classList.toggle("show");
  };

  return (
    <div className="dashboard-sidebar-content">
      {(() => {
        const roleLinks = user?._id
          ? links[user.role as keyof typeof links]
          : [];
        const userLinks = [...roleLinks, ...links.shared];
        return (
          <>
            <div className="d-flex justify-content-end mb-2">
              <FaArrowRight
                onClick={handleToggleSidebar}
                className="arrow fs-4 pointer mt-2"
              />
            </div>
            {userLinks?.map((link, index) => (
              <NavLink
                className="link d-block text-capitalize px-2  mb-1 text-decoration-none rounded text-dark"
                key={index}
                to={
                  link.isShared
                    ? `shared/${link.link}`
                    : `${user.role}/${link.link}`
                }
              >
                <span
                  title={`${link?.title?.[0]?.toUpperCase()}${link?.title
                    ?.slice(1)
                    ?.toLowerCase()}`}
                  className="link-icon fs-4 me-2"
                >
                  {link.icon}
                </span>
                <span className="link-content">{link.title}</span>
              </NavLink>
            ))}
          </>
        );
      })()}
    </div>
  );
};
